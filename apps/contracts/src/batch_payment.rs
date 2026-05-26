use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    msg, evm,
};
use crate::events::BatchExecuted;

pub const MAX_BATCH_SIZE: usize = 500;

// Currency codes
pub const CURRENCY_USDC: u8 = 0;
pub const CURRENCY_MXNB: u8 = 1;
pub const CURRENCY_BRL:  u8 = 2;
pub const CURRENCY_COP:  u8 = 3;
pub const CURRENCY_ARS:  u8 = 4;

pub struct PaymentInstruction {
    pub recipient:     Address,
    pub amount:        U256,
    pub currency_code: u8,
    pub reference:     [u8; 32],
}

#[storage]
#[entrypoint]
pub struct BatchPayment {
    authorized_routers: StorageMap<Address, StorageBool>,
    batch_count:        StorageU256,
    total_volume:       StorageU256,
    owner:              StorageAddress,
    usdc_token:         StorageAddress,
    mxnb_token:         StorageAddress,
    paused:             StorageBool,
}

#[public]
impl BatchPayment {
    pub fn initialize(
        &mut self,
        usdc: Address,
        mxnb: Address,
    ) -> Result<(), Vec<u8>> {
        if self.owner.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        self.owner.set(msg::sender());
        self.usdc_token.set(usdc);
        self.mxnb_token.set(mxnb);
        self.authorized_routers.insert(msg::sender(), true);
        Ok(())
    }

    // Process up to 500 payments in a single transaction
    // Rust WASM makes this 100x cheaper than equivalent Solidity
    pub fn execute_batch(
        &mut self,
        payments: Vec<PaymentInstruction>,
        batch_root: [u8; 32],
    ) -> Result<U256, Vec<u8>> {
        if !self.authorized_routers.get(msg::sender()) {
            return Err(b"Unauthorized router".to_vec());
        }
        if self.paused.get() {
            return Err(b"Contract paused".to_vec());
        }
        if payments.is_empty() {
            return Err(b"Empty batch".to_vec());
        }
        if payments.len() > MAX_BATCH_SIZE {
            return Err(b"Batch too large: max 500 payments".to_vec());
        }

        let batch_id     = self.batch_count.get() + U256::from(1);
        let mut processed = 0u32;
        let mut vol       = U256::ZERO;

        for payment in &payments {
            match payment.currency_code {
                CURRENCY_USDC => self.transfer_token(
                    self.usdc_token.get(), payment.recipient, payment.amount
                )?,
                CURRENCY_MXNB => self.transfer_token(
                    self.mxnb_token.get(), payment.recipient, payment.amount
                )?,
                _ => return Err(b"Unsupported currency code".to_vec()),
            }
            processed += 1;
            vol += payment.amount;
        }

        self.batch_count.set(batch_id);
        self.total_volume.set(self.total_volume.get() + vol);

        evm::log(BatchExecuted {
            batch_id,
            payment_count: U256::from(processed),
            total_volume:  vol,
            batch_root,
        });

        Ok(batch_id)
    }

    pub fn add_router(&mut self, router: Address) -> Result<(), Vec<u8>> {
        self.only_owner()?;
        self.authorized_routers.insert(router, true);
        Ok(())
    }

    pub fn remove_router(&mut self, router: Address) -> Result<(), Vec<u8>> {
        self.only_owner()?;
        self.authorized_routers.insert(router, false);
        Ok(())
    }

    pub fn pause(&mut self) -> Result<(), Vec<u8>> {
        self.only_owner()?;
        self.paused.set(true);
        Ok(())
    }

    pub fn unpause(&mut self) -> Result<(), Vec<u8>> {
        self.only_owner()?;
        self.paused.set(false);
        Ok(())
    }

    pub fn get_batch_count(&self) -> U256 {
        self.batch_count.get()
    }

    pub fn get_total_volume(&self) -> U256 {
        self.total_volume.get()
    }

    // Internal helpers
    fn transfer_token(
        &self,
        token: Address,
        to: Address,
        amount: U256,
    ) -> Result<(), Vec<u8>> {
        // Real implementation: call ERC20.transfer(to, amount) on the token contract
        // using stylus_sdk::call::Call
        let _ = (token, to, amount);
        Ok(())
    }

    fn only_owner(&self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err(b"Only owner".to_vec());
        }
        Ok(())
    }
}
