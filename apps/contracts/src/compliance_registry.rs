use stylus_sdk::{
    alloy_primitives::{Address, U256},
    prelude::*,
    msg, block, evm,
};
use crate::events::{ComplianceNFTRegistered, ComplianceNFTRevoked, ComplianceNFTExpired};

// KYC tier levels
pub const TIER_BASIC:    u8 = 0;
pub const TIER_VERIFIED: u8 = 1;
pub const TIER_PREMIUM:  u8 = 2;

#[storage]
#[entrypoint]
pub struct ComplianceRegistry {
    // company address → compliance record
    records:         StorageMap<Address, ComplianceRecord>,
    // nft_id → company address (reverse lookup)
    nft_to_company:  StorageMap<U256, StorageAddress>,
    owner:           StorageAddress,
    nexus_protocol:  StorageAddress,   // TradeEscrow contract that queries this
    record_count:    StorageU256,
}

#[derive(StorageType)]
pub struct ComplianceRecord {
    nft_id:        StorageU256,
    kyc_score:     StorageU256,       // 0–1000
    tier:          StorageU8,         // BASIC / VERIFIED / PREMIUM
    country_code:  StorageU256,       // packed country string as bytes
    issued_at:     StorageU256,
    expires_at:    StorageU256,
    active:        StorageBool,
    documents_hash: StorageU256,      // SHA-256 of KYC documents
}

#[public]
impl ComplianceRegistry {
    pub fn initialize(&mut self, protocol: Address) -> Result<(), Vec<u8>> {
        if self.owner.get() != Address::ZERO {
            return Err(b"Already initialized".to_vec());
        }
        self.owner.set(msg::sender());
        self.nexus_protocol.set(protocol);
        Ok(())
    }

    // Called by ComplianceAgent after minting NFT on Rare Protocol
    pub fn register_compliance(
        &mut self,
        company: Address,
        nft_id: U256,
        kyc_score: U256,
        tier: u8,
        country_code: U256,
        documents_hash: U256,
        validity_seconds: U256,
    ) -> Result<(), Vec<u8>> {
        self.only_authorized()?;

        if tier > TIER_PREMIUM {
            return Err(b"Invalid tier".to_vec());
        }
        if kyc_score > U256::from(1000) {
            return Err(b"Score out of range 0-1000".to_vec());
        }

        let now = block::timestamp();
        let record = ComplianceRecord {
            nft_id:         nft_id.into(),
            kyc_score:      kyc_score.into(),
            tier:           tier.into(),
            country_code:   country_code.into(),
            issued_at:      now.into(),
            expires_at:     (now + validity_seconds).into(),
            active:         true.into(),
            documents_hash: documents_hash.into(),
        };

        self.records.insert(company, record);
        self.nft_to_company.insert(nft_id, company);
        self.record_count.set(self.record_count.get() + U256::from(1));

        evm::log(ComplianceNFTRegistered {
            company,
            nft_id,
            tier,
            score: kyc_score,
        });
        Ok(())
    }

    pub fn revoke_compliance(&mut self, company: Address) -> Result<(), Vec<u8>> {
        self.only_authorized()?;

        let nft_id = {
            let mut record = self.records.get_mut(company)
                .ok_or_else(|| b"Company not found".to_vec())?;
            if !record.active.get() {
                return Err(b"Already inactive".to_vec());
            }
            record.active.set(false);
            record.nft_id.get()
        };

        evm::log(ComplianceNFTRevoked { company, nft_id });
        Ok(())
    }

    // Called by TradeEscrow to validate a company before allowing trades
    pub fn is_compliant(&self, company: Address) -> bool {
        let record = match self.records.get(company) {
            Some(r) => r,
            None => return false,
        };
        if !record.active.get() {
            return false;
        }
        if block::timestamp() > record.expires_at.get() {
            return false;
        }
        true
    }

    pub fn get_compliance_level(&self, company: Address) -> Result<(U256, u8, bool), Vec<u8>> {
        let record = self.records.get(company)
            .ok_or_else(|| b"Company not found".to_vec())?;
        Ok((
            record.kyc_score.get(),
            record.tier.get(),
            record.active.get() && block::timestamp() <= record.expires_at.get(),
        ))
    }

    pub fn get_company_by_nft(&self, nft_id: U256) -> Result<Address, Vec<u8>> {
        let company = self.nft_to_company.get(nft_id)
            .ok_or_else(|| b"NFT not registered".to_vec())?;
        Ok(company.get())
    }

    pub fn get_record_count(&self) -> U256 {
        self.record_count.get()
    }

    fn only_authorized(&self) -> Result<(), Vec<u8>> {
        let sender = msg::sender();
        if sender != self.owner.get() && sender != self.nexus_protocol.get() {
            return Err(b"Not authorized".to_vec());
        }
        Ok(())
    }
}
