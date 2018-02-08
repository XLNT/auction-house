export default {
  address: "0x345ca3e014aaf5dca488057592ee47305d9b3e10",
  abi: [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string"
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
          name: "operator",
          type: "address"
        },
        {
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "approve",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
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
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "approvedFor",
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
      constant: true,
      inputs: [
        {
          name: "holder",
          type: "address"
        }
      ],
      name: "assetsOf",
      outputs: [
        {
          name: "",
          type: "uint256[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
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
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "safeHolderOf",
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
      constant: true,
      inputs: [
        {
          name: "operator",
          type: "address"
        },
        {
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "isApprovedFor",
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
      constant: true,
      inputs: [
        {
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "exists",
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
      constant: true,
      inputs: [
        {
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "ownerOf",
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
      constant: true,
      inputs: [
        {
          name: "holder",
          type: "address"
        }
      ],
      name: "balanceOf",
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
      inputs: [],
      name: "description",
      outputs: [
        {
          name: "",
          type: "string"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string"
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
          name: "operator",
          type: "address"
        },
        {
          name: "assetHolder",
          type: "address"
        }
      ],
      name: "isOperatorAuthorizedBy",
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
      constant: true,
      inputs: [],
      name: "isERC821",
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
          name: "to",
          type: "address"
        },
        {
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "transfer",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "assetData",
      outputs: [
        {
          name: "",
          type: "string"
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
          name: "operator",
          type: "address"
        },
        {
          name: "authorized",
          type: "bool"
        }
      ],
      name: "authorizeOperator",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "safeAssetData",
      outputs: [
        {
          name: "",
          type: "string"
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
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "safeOwnerOf",
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
          name: "to",
          type: "address"
        },
        {
          name: "assetId",
          type: "uint256"
        },
        {
          name: "userData",
          type: "bytes"
        }
      ],
      name: "transfer",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "holder",
          type: "address"
        }
      ],
      name: "assetCount",
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
          name: "holder",
          type: "address"
        },
        {
          name: "index",
          type: "uint256"
        }
      ],
      name: "assetByIndex",
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
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "holderOf",
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
          name: "to",
          type: "address"
        },
        {
          name: "assetId",
          type: "uint256"
        },
        {
          name: "userData",
          type: "bytes"
        },
        {
          name: "operatorData",
          type: "bytes"
        }
      ],
      name: "transfer",
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
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          name: "to",
          type: "address"
        },
        {
          indexed: true,
          name: "assetId",
          type: "uint256"
        },
        {
          indexed: false,
          name: "operator",
          type: "address"
        },
        {
          indexed: false,
          name: "userData",
          type: "bytes"
        },
        {
          indexed: false,
          name: "operatorData",
          type: "bytes"
        }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "assetId",
          type: "uint256"
        },
        {
          indexed: true,
          name: "holder",
          type: "address"
        },
        {
          indexed: true,
          name: "operator",
          type: "address"
        },
        {
          indexed: false,
          name: "data",
          type: "string"
        }
      ],
      name: "Update",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "operator",
          type: "address"
        },
        {
          indexed: true,
          name: "holder",
          type: "address"
        },
        {
          indexed: false,
          name: "authorized",
          type: "bool"
        }
      ],
      name: "AuthorizeOperator",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          name: "operator",
          type: "address"
        },
        {
          indexed: true,
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "Approve",
      type: "event"
    },
    {
      constant: true,
      inputs: [
        {
          name: "addr",
          type: "address"
        }
      ],
      name: "isContractProxy",
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
          name: "assetId",
          type: "uint256"
        },
        {
          name: "beneficiary",
          type: "address"
        },
        {
          name: "data",
          type: "string"
        }
      ],
      name: "generate",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "assetId",
          type: "uint256"
        },
        {
          name: "data",
          type: "string"
        }
      ],
      name: "update",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "assetId",
          type: "uint256"
        }
      ],
      name: "destroy",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "to",
          type: "address"
        },
        {
          name: "assetId",
          type: "uint256"
        },
        {
          name: "userData",
          type: "bytes"
        },
        {
          name: "operatorData",
          type: "bytes"
        }
      ],
      name: "transferTo",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    }
  ]
};
