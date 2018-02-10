export default {
  address: "0x98d9f9e8debd4a632682ba207670d2a5acd3c489",
  abi: [
    {
      constant: false,
      inputs: [],
      name: "unpause",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      name: "auctions",
      outputs: [
        {
          name: "nftAddress",
          type: "address"
        },
        {
          name: "tokenId",
          type: "uint256"
        },
        {
          name: "seller",
          type: "address"
        },
        {
          name: "bidIncrement",
          type: "uint128"
        },
        {
          name: "duration",
          type: "uint256"
        },
        {
          name: "startBlock",
          type: "uint256"
        },
        {
          name: "startedAt",
          type: "uint256"
        },
        {
          name: "highestBid",
          type: "uint256"
        },
        {
          name: "highestBidder",
          type: "address"
        },
        {
          name: "cancelled",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "paused",
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [],
      name: "pause",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      payable: true,
      stateMutability: "payable",
      type: "fallback"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "id",
          type: "uint256"
        },
        {
          indexed: false,
          name: "nftAddress",
          type: "address"
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "AuctionCreated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "id",
          type: "uint256"
        },
        {
          indexed: false,
          name: "nftAddress",
          type: "address"
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "AuctionSuccessful",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "id",
          type: "uint256"
        },
        {
          indexed: false,
          name: "nftAddress",
          type: "address"
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "AuctionCancelled",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "id",
          type: "uint256"
        },
        {
          indexed: false,
          name: "nftAddress",
          type: "address"
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: false,
          name: "bidder",
          type: "address"
        },
        {
          indexed: false,
          name: "bid",
          type: "uint256"
        }
      ],
      name: "BidCreated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "id",
          type: "uint256"
        },
        {
          indexed: false,
          name: "nftAddress",
          type: "address"
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: false,
          name: "withdrawer",
          type: "address"
        }
      ],
      name: "AuctionNFTWithdrawal",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "id",
          type: "uint256"
        },
        {
          indexed: false,
          name: "nftAddress",
          type: "address"
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: false,
          name: "withdrawer",
          type: "address"
        },
        {
          indexed: false,
          name: "amount",
          type: "uint256"
        }
      ],
      name: "AuctionFundWithdrawal",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [],
      name: "Pause",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [],
      name: "Unpause",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      constant: true,
      inputs: [],
      name: "getAuctionsCount",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_auctionId",
          type: "uint256"
        }
      ],
      name: "getAuction",
      outputs: [
        {
          name: "id",
          type: "uint256"
        },
        {
          name: "nftAddress",
          type: "address"
        },
        {
          name: "tokenId",
          type: "uint256"
        },
        {
          name: "seller",
          type: "address"
        },
        {
          name: "bidIncrement",
          type: "uint256"
        },
        {
          name: "duration",
          type: "uint256"
        },
        {
          name: "startedAt",
          type: "uint256"
        },
        {
          name: "startBlock",
          type: "uint256"
        },
        {
          name: "status",
          type: "uint8"
        },
        {
          name: "highestBid",
          type: "uint256"
        },
        {
          name: "highestBidder",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "_auctionId",
          type: "uint256"
        },
        {
          name: "bidder",
          type: "address"
        }
      ],
      name: "getBid",
      outputs: [
        {
          name: "bid",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_nftAddress",
          type: "address"
        },
        {
          name: "_tokenId",
          type: "uint256"
        },
        {
          name: "_bidIncrement",
          type: "uint256"
        },
        {
          name: "_duration",
          type: "uint256"
        }
      ],
      name: "createAuction",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_auctionId",
          type: "uint256"
        }
      ],
      name: "bid",
      outputs: [
        {
          name: "success",
          type: "bool"
        }
      ],
      payable: true,
      stateMutability: "payable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_auctionId",
          type: "uint256"
        }
      ],
      name: "withdrawBalance",
      outputs: [
        {
          name: "success",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_nftAddress",
          type: "address"
        },
        {
          name: "_tokenId",
          type: "uint256"
        }
      ],
      name: "cancelAuction",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "_auctionId",
          type: "uint256"
        }
      ],
      name: "cancelAuction",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "addr",
          type: "address"
        },
        {
          name: "interfaceHash",
          type: "bytes32"
        }
      ],
      name: "canImplementInterfaceForAddress",
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "",
          type: "uint256"
        },
        {
          name: "",
          type: "address"
        },
        {
          name: "",
          type: "address"
        },
        {
          name: "",
          type: "bytes"
        },
        {
          name: "",
          type: "address"
        },
        {
          name: "",
          type: "bytes"
        }
      ],
      name: "onAssetReceived",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    }
  ]
};
