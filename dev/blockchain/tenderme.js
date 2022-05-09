const ethers = require("ethers");
const tendermeAbi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
        inputs: [],
        name: "applyForTender",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
        name: "chooseContractor",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "contractors",
        outputs: [
            { internalType: "address payable", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "contracts",
        outputs: [
            { internalType: "address payable", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getContractors",
        outputs: [
            { internalType: "address payable[]", name: "", type: "address[]" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getStatus",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
        name: "getTenderDetails",
        outputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "string", name: "", type: "string" },
            { internalType: "string", name: "", type: "string" },
            { internalType: "address", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "_tenderName", type: "string" },
            { internalType: "string", name: "_tenderDetails", type: "string" },
        ],
        name: "initTender",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "organisation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "status",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "tenderCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "tenderID",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "tenders",
        outputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "string", name: "tenderName", type: "string" },
            {
                internalType: "string",
                name: "tenderDescription",
                type: "string",
            },
            { internalType: "address", name: "userHash", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "winner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
];

const tendermeContract = (web3) => {
    return new web3.eth.Contract(
        tendermeAbi,
        "0x270691b145C6aec313547d5178C669255F5148F7"
    );
    // const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner();
    // const transactionsContract = new ethers.Contract(
    //     "0x976ac96cB6aEFAE51C7ed25FF2beAB86efD3F1D7",
    //     tendermeAbi,
    //     signer
    // );

    // return transactionsContract;
};

export default tendermeContract;

// const provider = new ethers.providers.Web3Provider(ethereum);
// const signer = provider.getSigner();
// const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

// return transactionsContract;
