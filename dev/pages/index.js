import Head from "next/head";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import tendermeContract from "../blockchain/tenderme";
import { ethers } from "ethers";

export default function Home() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [web3Object, setWeb3Object] = useState(null);
    const [abiContract, setAbiContract] = useState(null);
    const [tenderStatus, setTenderStatus] = useState(null);
    const [contractSigner, setContractSigner] = useState(null);
    const [tenderID, setTenderID] = useState("");
    const [contractCreator, setContractCreator] = useState(null);
    const [contractors, setContractors] = useState([]);
    const [pastContractors, setPastContractors] = useState([]);

    // Check if metamask wallet is connected
    const checkForMetamaskWallet = async () => {
        if (
            typeof window !== "undefined" ||
            typeof window.ethereum !== "undefined"
        ) {
            try {
                if (!window.ethereum) {
                    return alert("Please install metamask.");
                }
                // Get the accounts if metamask is connected
                await window.ethereum.request({
                    method: "eth_accounts",
                });
                const web3 = new Web3(window.ethereum);
                /* set web3 instance in React state */
                setWeb3Object(web3);
                const accounts = await web3.eth.getAccounts();

                // If there are accounts, set the current account
                if (accounts.length) {
                    console.log("Accounts: ", accounts);
                    setCurrentAccount(accounts[0]);
                    // Set the ethereum contract
                    const tendermeAbiContract = await tendermeContract(web3);
                    setAbiContract(tendermeAbiContract);
                } else {
                    console.log("No accounts found.");
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("No metamask found.");
        }
    };

    // Connect to metamask wallet
    const connectToMetamaskWallet = async () => {
        try {
            // If metamask is not connected
            if (!window.ethereum) {
                return alert("Please install MetaMask.");
            }
            await ethereum.request({
                method: "eth_requestAccounts",
            });
            const web3 = new Web3(window.ethereum);
            /* set web3 instance in React state */
            setWeb3Object(web3);
            const accounts = await web3.eth.getAccounts();
            setCurrentAccount(accounts[0]);

            // Set the ethereum contract
            const tendermeAbiContract = await tendermeContract(web3);
            setAbiContract(tendermeAbiContract);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
        // const accounts = await web3.eth.getAccounts();
        // return accounts[0];
    };

    // Get the details of past contractors
    const getPastContractors = async (tenderID) => {
        setPastContractors([]);
        for (let i = parseInt(tenderID); i > 0; i--) {
            const currentContractor = await abiContract.methods
                .contracts(i)
                .call();
            const tenderObject = {};
            tenderObject.tenderID = i;
            tenderObject.address = currentContractor;
            setPastContractors((contracts) => [...contracts, tenderObject]);
        }
        // const pastContractors = await abiContract.methods.contracts().call();
        // setPastContractors(pastContractors);
    };

    // Get the Tender ID
    const getTenderID = async () => {
        const tenderID = await abiContract.methods.tenderID().call();
        setTenderID(tenderID);
        await getPastContractors(tenderID);
    };

    // Get the current tender status
    const getTenderStatus = async () => {
        const tenderStatus = await abiContract.methods.getStatus().call();
        console.log("TENDER STATUS: ", tenderStatus);
        setTenderStatus(parseInt(tenderStatus));
    };

    // Method to apply for the tender
    const applyForTender = async () => {
        const tenderStatus = await abiContract.methods.getStatus().call();
        // const tenderStatus = await abiContract.getStatus();
        // const parsedStatus = parseInt(tenderStatus._hex, 16);
        if (parseInt(tenderStatus) === 0) {
            // await abiContract.initTender();
            // await getTenderStatus();
            const parsedAmount = ethers.utils.parseEther("0.01");

            // await ethereum.request({
            //     method: "eth_sendTransaction",
            //     params: [
            //         {
            //             from: currentAccount,
            //             to: "0xBc35F66f0B66035116670F8556E3c792264Fb1e2",
            //             gas: "0x5208",
            //             value: parsedAmount._hex,
            //         },
            //     ],
            // });

            // const transactionHash = await abiContract.applyForTender();

            await abiContract.methods.applyForTender().send({
                from: currentAccount,
                value: parsedAmount,
                gas: 300000,
                gasPrice: null,
            });
        } else {
            alert("Tender is closed now.");
        }
    };

    // Choose the tender winner
    const chooseContractorMethod = async (contractorAddress) => {
        const tenderStatus = await abiContract.methods.getStatus().call();
        if (parseInt(tenderStatus) === 0) {
            await abiContract.methods.chooseContractor(contractorAddress).send({
                from: currentAccount,
                gas: 300000,
                gasPrice: null,
            });
        } else {
            alert("Tender is closed now.");
        }
    };

    // Get the contract signer
    const getContractSigner = async () => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        setContractSigner(signer);
    };

    // Get all the contractor pool
    const getContractors = async () => {
        const contractors = await abiContract.methods.getContractors().call();
        // const contractors = await abiContract.getContractors();
        setContractors(contractors);
    };

    useEffect(() => {
        if (abiContract) {
            getTenderStatus();
            getContractSigner();
            getContractors();
            getTenderID();
        }
    }, [abiContract]);

    useEffect(() => {
        checkForMetamaskWallet();
    }, []);

    console.log("Current Acount: ", currentAccount);
    console.log("Current contract", abiContract);
    console.log("Current status", tenderStatus);
    console.log("Contract Signer", contractSigner);
    console.log("Contractors", contractors);
    console.log("Past Contractors", pastContractors);

    return (
        <div className="w-full h-full m-auto">
            <div className="container m-auto w-3/4">
                <Head className="flex justify-center items-center m-auto text-center">
                    <title>TenderMe</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main>
                    <h1 className="title text-cyan-600 font-sans font-semibold">
                        TenderMe
                    </h1>
                    <button
                        onClick={() => {
                            connectToMetamaskWallet();
                        }}
                    >
                        Click me{" "}
                    </button>
                    <button
                        onClick={() => {
                            applyForTender();
                        }}
                    >
                        Apply
                    </button>
                    <br />
                    <button
                        onClick={() => {
                            chooseContractorMethod(1);
                        }}
                    >
                        Choose winner
                    </button>
                </main>
            </div>
        </div>
    );
}
