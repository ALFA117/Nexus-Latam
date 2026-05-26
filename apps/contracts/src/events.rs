use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::alloy_sol_types::sol;

sol! {
    // TradeEscrow events
    event TradeCreated(uint256 indexed trade_id, address indexed buyer, address indexed seller, uint256 amount);
    event TradeFunded(uint256 indexed trade_id, uint256 amount, uint256 fee);
    event TradeSettled(uint256 indexed trade_id, address indexed seller, uint256 amount, uint256 yield_earned, bytes32 delivery_hash);
    event TradeDisputed(uint256 indexed trade_id, address indexed disputer);
    event TradeRefunded(uint256 indexed trade_id, address indexed buyer, uint256 amount);

    // BatchPayment events
    event BatchExecuted(uint256 indexed batch_id, uint256 payment_count, uint256 total_volume, bytes32 batch_root);

    // NexusVault events
    event Deposited(uint256 indexed trade_id, uint256 amount, uint256 atoken_received);
    event Withdrawn(uint256 indexed position_id, uint256 principal, uint256 yield_earned);

    // ComplianceRegistry events
    event ComplianceNFTRegistered(address indexed company, uint256 indexed nft_id, uint8 tier, uint256 score);
    event ComplianceNFTRevoked(address indexed company, uint256 indexed nft_id);
    event ComplianceNFTExpired(address indexed company, uint256 indexed nft_id);
}
