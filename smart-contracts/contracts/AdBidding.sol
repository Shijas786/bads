// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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
