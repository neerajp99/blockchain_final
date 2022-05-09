import React, { useEffect, useState } from "react";
import { useWeb3Context } from "web3-react";
import Web3 from "web3";

export const TransactionContext = React.createContext();

const TenderMeContextProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);

    // Check if metamask wallet is connected
    const checkForMetamaskWallet = async () => {
        try {
            if (!window.ethereum) {
                return alert("Please install metamask.");
            }
            // Get the accounts if metamask is connected
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            // If there are accounts, set the current account
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Get list of all accounts

    return (
        <TransactionContext.Provider>{children}</TransactionContext.Provider>
    );
};

const checkIfWalletIsConnect = async () => {
    try {
        if (!ethereum) return alert("Please install MetaMask.");

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length) {
            setCurrentAccount(accounts[0]);

            getAllTransactions();
        } else {
            console.log("No accounts found");
        }
    } catch (error) {
        console.log(error);
    }
};

// Connect to metamask wallet
const connectToMetamaskWallet = async () => {
    try {
        // If metamask is not connected
        if (!window.ethereum) {
            return alert("Please install MetaMask.");
        }
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
    } catch (error) {
        console.log(error);
        throw new Error("No ethereum object");
    }
    // const accounts = await web3.eth.getAccounts();
    // return accounts[0];
};
