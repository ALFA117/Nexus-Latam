use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    msg, block, evm,
};
use crate::events::*;

// Trade states
const STATE_PENDING: u8   = 0;
const STATE_FUNDED: u8    = 1;
const STATE_DELIVERED: u8 = 2;
const STATE_SETTLED: u8   = 3;
const STATE_DISPUTED: u8  = 4;

#[storage]
#[entrypoint]
pub struct TradeEscrow {
    trades:           StorageMap<U256, Trade>,
    trade_count:      StorageU256,
    oracle_address:   StorageAddress,
    yield_vault:      StorageAddress,
    nexus_treasury:   StorageAddress,
    usdc_token:       StorageAddress,
    fee_bps:          StorageU256,         // 30 = 0.3%
    yield_share_bps:  StorageU256,         // 2000 = 20%
    owner:            StorageAddress,
}

#[derive(StorageType)]
pub struct Trade {
    buyer:              StorageAddress,
    seller:             StorageAddress,
    amount_usdc:        StorageU256,
    compliance_nft_id:  StorageU256,
    lc_nft_id:          StorageU256,
    state:              StorageU8,
    created_at:         StorageU256,
    deadline:           StorageU256,
    yield_position:     StorageU256,
}

#[public]
impl TradeEscrow {
    pub fn initialize(
        &mut self,
        oracle: Address,
        vault: Address,
        treasury: Address,
        usdc: Address,
    ) -> Result<(), Vec<u8>> {
        if self.owner.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        self.owner.set(msg::sender());
        self.oracle_address.set(oracle);
        self.yield_vault.set(vault);
        self.nexus_treasury.set(treasury);
        self.usdc_token.set(usdc);
        self.fee_bps.set(U256::from(30));
        self.yield_share_bps.set(U256::from(2000));
        Ok(())
    }

    pub fn create_trade(
        &mut self,
        seller: Address,
        amount_usdc: U256,
        compliance_nft_id: U256,
        deadline_seconds: U256,
    ) -> Result<U256, Vec<u8>> {
        if amount_usdc == U256::ZERO {
            return Err(b"Amount must be > 0".to_vec());
        }
        if seller == msg::sender() {
            return Err(b"Buyer and seller must be different".to_vec());
        }

        let trade_id = self.trade_count.get() + U256::from(1);

        let trade = Trade {
            buyer:             msg::sender().into(),
            seller:            seller.into(),
            amount_usdc:       amount_usdc.into(),
            compliance_nft_id: compliance_nft_id.into(),
            lc_nft_id:         U256::ZERO.into(),
            state:             STATE_PENDING.into(),
            created_at:        block::timestamp().into(),
            deadline:          (block::timestamp() + deadline_seconds).into(),
            yield_position:    U256::ZERO.into(),
        };

        self.trades.insert(trade_id, trade);
        self.trade_count.set(trade_id);

        evm::log(TradeCreated {
            trade_id,
            buyer: msg::sender(),
            seller,
            amount: amount_usdc,
        });

        Ok(trade_id)
    }

    pub fn set_lc_nft(&mut self, trade_id: U256, lc_nft_id: U256) -> Result<(), Vec<u8>> {
        let mut trade = self.trades.get_mut(trade_id)
            .ok_or_else(|| b"Trade not found".to_vec())?;
        if trade.state.get() != STATE_PENDING {
            return Err(b"Trade not in PENDING state".to_vec());
        }
        trade.lc_nft_id.set(lc_nft_id);
        Ok(())
    }

    pub fn fund_trade(&mut self, trade_id: U256) -> Result<(), Vec<u8>> {
        let mut trade = self.trades.get_mut(trade_id)
            .ok_or_else(|| b"Trade not found".to_vec())?;

        if trade.state.get() != STATE_PENDING {
            return Err(b"Trade not in PENDING state".to_vec());
        }
        if trade.buyer.get() != msg::sender() {
            return Err(b"Only buyer can fund".to_vec());
        }
        if block::timestamp() > trade.deadline.get() {
            return Err(b"Trade deadline passed".to_vec());
        }

        let amount = trade.amount_usdc.get();
        let fee = amount * self.fee_bps.get() / U256::from(10000);
        let net_amount = amount - fee;

        // Transfer USDC from buyer to this contract (caller must have approved)
        // IErc20(self.usdc_token).transfer_from(msg::sender(), contract_address(), amount)?;

        // Deposit net amount into yield vault
        let yield_position = self.deposit_to_yield_vault(net_amount)?;
        trade.yield_position.set(yield_position);
        trade.state.set(STATE_FUNDED);

        evm::log(TradeFunded { trade_id, amount, fee });
        Ok(())
    }

    pub fn confirm_delivery(
        &mut self,
        trade_id: U256,
        delivery_hash: [u8; 32],
    ) -> Result<(), Vec<u8>> {
        if msg::sender() != self.oracle_address.get() {
            return Err(b"Only oracle can confirm delivery".to_vec());
        }

        let state = {
            let trade = self.trades.get(trade_id)
                .ok_or_else(|| b"Trade not found".to_vec())?;
            trade.state.get()
        };

        if state != STATE_FUNDED {
            return Err(b"Trade not in FUNDED state".to_vec());
        }

        {
            let mut trade = self.trades.get_mut(trade_id).unwrap();
            trade.state.set(STATE_DELIVERED);
        }

        self.settle_trade_internal(trade_id, delivery_hash)
    }

    pub fn dispute_trade(&mut self, trade_id: U256) -> Result<(), Vec<u8>> {
        let mut trade = self.trades.get_mut(trade_id)
            .ok_or_else(|| b"Trade not found".to_vec())?;

        if trade.state.get() != STATE_FUNDED {
            return Err(b"Can only dispute FUNDED trades".to_vec());
        }
        if trade.buyer.get() != msg::sender() && trade.seller.get() != msg::sender() {
            return Err(b"Only trade parties can dispute".to_vec());
        }

        trade.state.set(STATE_DISPUTED);
        evm::log(TradeDisputed { trade_id, disputer: msg::sender() });
        Ok(())
    }

    pub fn refund_expired_trade(&mut self, trade_id: U256) -> Result<(), Vec<u8>> {
        let (buyer, deadline, state, yield_position) = {
            let trade = self.trades.get(trade_id)
                .ok_or_else(|| b"Trade not found".to_vec())?;
            (trade.buyer.get(), trade.deadline.get(), trade.state.get(), trade.yield_position.get())
        };

        if state != STATE_FUNDED {
            return Err(b"Trade not in FUNDED state".to_vec());
        }
        if block::timestamp() <= deadline {
            return Err(b"Trade deadline not yet passed".to_vec());
        }

        let (principal, _yield_earned) = self.withdraw_from_yield_vault(yield_position)?;

        {
            let mut trade = self.trades.get_mut(trade_id).unwrap();
            trade.state.set(STATE_PENDING); // reuse as REFUNDED marker
        }

        evm::log(TradeRefunded { trade_id, buyer, amount: principal });
        Ok(())
    }

    // View functions
    pub fn get_trade_state(&self, trade_id: U256) -> Result<u8, Vec<u8>> {
        let trade = self.trades.get(trade_id)
            .ok_or_else(|| b"Trade not found".to_vec())?;
        Ok(trade.state.get())
    }

    pub fn get_trade_count(&self) -> U256 {
        self.trade_count.get()
    }

    pub fn set_oracle(&mut self, oracle: Address) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err(b"Only owner".to_vec());
        }
        self.oracle_address.set(oracle);
        Ok(())
    }

    // Internal helpers
    fn settle_trade_internal(
        &mut self,
        trade_id: U256,
        delivery_hash: [u8; 32],
    ) -> Result<(), Vec<u8>> {
        let (seller, yield_position) = {
            let trade = self.trades.get(trade_id).unwrap();
            (trade.seller.get(), trade.yield_position.get())
        };

        let (principal, yield_earned) = self.withdraw_from_yield_vault(yield_position)?;

        let yield_to_seller = yield_earned * U256::from(8000) / U256::from(10000);
        let yield_to_nexus  = yield_earned - yield_to_seller;
        let total_to_seller = principal + yield_to_seller;

        // Transfer USDC to seller and treasury
        // IErc20(self.usdc_token).transfer(seller, total_to_seller)?;
        // IErc20(self.usdc_token).transfer(self.nexus_treasury.get(), yield_to_nexus)?;

        {
            let mut trade = self.trades.get_mut(trade_id).unwrap();
            trade.state.set(STATE_SETTLED);
        }

        evm::log(TradeSettled {
            trade_id,
            seller,
            amount: total_to_seller,
            yield_earned,
            delivery_hash,
        });
        Ok(())
    }

    fn deposit_to_yield_vault(&self, amount: U256) -> Result<U256, Vec<u8>> {
        // Call NexusVault.deposit(trade_id, amount) via cross-contract call
        // Returning the position ID (= trade_id for simplicity)
        Ok(amount) // placeholder: real impl calls IYieldVault
    }

    fn withdraw_from_yield_vault(&self, position_id: U256) -> Result<(U256, U256), Vec<u8>> {
        // Call NexusVault.withdraw(position_id) via cross-contract call
        // Returns (principal, yield_earned)
        Ok((position_id, U256::ZERO)) // placeholder
    }
}
