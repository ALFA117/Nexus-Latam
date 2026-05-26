use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    msg, block, evm,
};
use crate::events::{Deposited, Withdrawn};

#[storage]
#[entrypoint]
pub struct NexusVault {
    aave_pool:          StorageAddress,
    ausdc_token:        StorageAddress,
    usdc_token:         StorageAddress,
    trade_escrow:       StorageAddress,
    owner:              StorageAddress,
    total_deposited:    StorageU256,
    total_yield_earned: StorageU256,
    positions:          StorageMap<U256, VaultPosition>,
    position_count:     StorageU256,
}

#[derive(StorageType)]
pub struct VaultPosition {
    trade_id:        StorageU256,
    amount:          StorageU256,
    deposited_at:    StorageU256,
    atoken_balance:  StorageU256,
    active:          StorageBool,
}

#[public]
impl NexusVault {
    pub fn initialize(
        &mut self,
        aave_pool: Address,
        ausdc: Address,
        usdc: Address,
        escrow: Address,
    ) -> Result<(), Vec<u8>> {
        if self.owner.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        self.owner.set(msg::sender());
        self.aave_pool.set(aave_pool);
        self.ausdc_token.set(ausdc);
        self.usdc_token.set(usdc);
        self.trade_escrow.set(escrow);
        Ok(())
    }

    pub fn deposit(&mut self, trade_id: U256, amount: U256) -> Result<U256, Vec<u8>> {
        if msg::sender() != self.trade_escrow.get() && msg::sender() != self.owner.get() {
            return Err(b"Only escrow or owner".to_vec());
        }
        if amount == U256::ZERO {
            return Err(b"Amount must be > 0".to_vec());
        }

        // Supply to Aave V3 on Arbitrum → receive aUSDC
        let atoken_received = self.aave_supply(amount)?;

        let position_id = self.position_count.get() + U256::from(1);

        self.positions.insert(position_id, VaultPosition {
            trade_id:       trade_id.into(),
            amount:         amount.into(),
            deposited_at:   block::timestamp().into(),
            atoken_balance: atoken_received.into(),
            active:         true.into(),
        });

        self.position_count.set(position_id);
        self.total_deposited.set(self.total_deposited.get() + amount);

        evm::log(Deposited { trade_id, amount, atoken_received });
        Ok(position_id)
    }

    pub fn withdraw(&mut self, position_id: U256) -> Result<(U256, U256), Vec<u8>> {
        if msg::sender() != self.trade_escrow.get() && msg::sender() != self.owner.get() {
            return Err(b"Only escrow or owner".to_vec());
        }

        let (trade_id, original_amount, atoken_balance, active) = {
            let pos = self.positions.get(position_id)
                .ok_or_else(|| b"Position not found".to_vec())?;
            (
                pos.trade_id.get(),
                pos.amount.get(),
                pos.atoken_balance.get(),
                pos.active.get(),
            )
        };

        if !active {
            return Err(b"Position already withdrawn".to_vec());
        }

        // Withdraw from Aave → USDC principal + accrued interest
        let total_withdrawn = self.aave_withdraw(atoken_balance)?;
        let yield_earned = if total_withdrawn > original_amount {
            total_withdrawn - original_amount
        } else {
            U256::ZERO
        };

        {
            let mut pos = self.positions.get_mut(position_id).unwrap();
            pos.active.set(false);
        }

        self.total_yield_earned.set(self.total_yield_earned.get() + yield_earned);

        evm::log(Withdrawn { position_id, principal: original_amount, yield_earned });
        Ok((original_amount, yield_earned))
    }

    pub fn get_position(&self, position_id: U256) -> Result<(U256, U256, U256, bool), Vec<u8>> {
        let pos = self.positions.get(position_id)
            .ok_or_else(|| b"Position not found".to_vec())?;
        Ok((
            pos.trade_id.get(),
            pos.amount.get(),
            pos.atoken_balance.get(),
            pos.active.get(),
        ))
    }

    pub fn get_stats(&self) -> (U256, U256) {
        (self.total_deposited.get(), self.total_yield_earned.get())
    }

    // Internal: Aave V3 supply
    fn aave_supply(&self, amount: U256) -> Result<U256, Vec<u8>> {
        // Real: call IPool(aave_pool).supply(usdc, amount, address(this), 0)
        // then return the aUSDC received (1:1 ratio initially, grows over time)
        Ok(amount)
    }

    // Internal: Aave V3 withdraw
    fn aave_withdraw(&self, atoken_balance: U256) -> Result<U256, Vec<u8>> {
        // Real: call IPool(aave_pool).withdraw(usdc, type(uint256).max, address(this))
        // aTokens accrue interest, so returned amount > original deposit
        // For testnet: simulate ~4.5% APY accrual
        let simulated_yield = atoken_balance * U256::from(45) / U256::from(10000); // 0.45% as demo
        Ok(atoken_balance + simulated_yield)
    }
}
