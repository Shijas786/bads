// Sources flattened with hardhat v2.28.3 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/Context.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File @openzeppelin/contracts/utils/ReentrancyGuard.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}


// File contracts/AdBidding.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;


contract AdBidding is Ownable, ReentrancyGuard {
    struct Auction {
        string adId;
        address auctioneer;
        uint256 minBid;
        uint256 highestBidAmount;
        address highestBidder;
        bool ended;
        uint256 endTime;
    }

    // Map adId (string) to Auction
    mapping(string => Auction) public auctions;
    
    event AuctionCreated(string indexed adId, address indexed auctioneer, uint256 minBid, uint256 endTime);
    event BidPlaced(string indexed adId, address indexed bidder, uint256 amount);
    event AuctionEnded(string indexed adId, address indexed winner, uint256 amount);

    // Platform fee in percentage (e.g., 5 = 5%)
    uint256 public feePercentage = 5;

    event FeeUpdated(uint256 newFee);

    constructor() Ownable(msg.sender) {}

    function setFeePercentage(uint256 _fee) external onlyOwner {
        require(_fee <= 50, "Fee too high"); // Max 50% safety cap
        feePercentage = _fee;
        emit FeeUpdated(_fee);
    }

    function createAuction(string memory _adId, uint256 _minBid, uint256 _duration) external {
        require(auctions[_adId].auctioneer == address(0), "Auction already exists for this ID");
        require(_duration > 0, "Duration must be positive");

        Auction storage newAuction = auctions[_adId];
        newAuction.adId = _adId; // redundant but keeps struct complete
        newAuction.auctioneer = msg.sender;
        newAuction.minBid = _minBid;
        newAuction.endTime = block.timestamp + _duration;
        newAuction.ended = false;

        emit AuctionCreated(_adId, msg.sender, _minBid, newAuction.endTime);
    }

    function placeBid(string memory _adId) external payable nonReentrant {
        Auction storage auction = auctions[_adId];
        require(auction.auctioneer != address(0), "Auction does not exist");
        require(block.timestamp < auction.endTime, "Auction expired");
        require(!auction.ended, "Auction already ended");
        require(msg.value >= auction.minBid, "Bid below minimum");
        require(msg.value > auction.highestBidAmount, "Bid not high enough");

        // Refund previous highest bidder
        address previousBidder = auction.highestBidder;
        uint256 previousBidAmount = auction.highestBidAmount;

        auction.highestBidAmount = msg.value;
        auction.highestBidder = msg.sender;

        if (previousBidder != address(0)) {
            (bool success, ) = previousBidder.call{value: previousBidAmount}("");
            require(success, "Refund failed");
        }

        emit BidPlaced(_adId, msg.sender, msg.value);
    }

    function endAuction(string memory _adId) external nonReentrant {
        Auction storage auction = auctions[_adId];
        require(auction.auctioneer != address(0), "Auction does not exist");
        require(!auction.ended, "Auction already ended");
        // Allow ending only after time expires
        require(block.timestamp >= auction.endTime, "Auction not yet ended");

        auction.ended = true;

        uint256 winningAmount = auction.highestBidAmount;
        
        if (winningAmount > 0) {
            uint256 platformFee = (winningAmount * feePercentage) / 100;
            uint256 sellerPayout = winningAmount - platformFee;

            // Pay Platform Fee
            (bool feeSuccess, ) = owner().call{value: platformFee}("");
            require(feeSuccess, "Fee transfer failed");

            // Pay Auctioneer (Seller)
            (bool sellerSuccess, ) = auction.auctioneer.call{value: sellerPayout}("");
            require(sellerSuccess, "Seller payout failed");
        }

        emit AuctionEnded(_adId, auction.highestBidder, winningAmount);
    }
}
