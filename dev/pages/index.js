import Head from "next/head";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import tendermeContract from "../blockchain/tenderme";
import { ethers } from "ethers";
import { RadioGroup } from "@headlessui/react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
    MenuIcon,
    SearchIcon,
    ShoppingBagIcon,
    XIcon as XIconOutline,
} from "@heroicons/react/outline";
import {
    CheckIcon,
    ClockIcon,
    QuestionMarkCircleIcon,
    XIcon as XIconSolid,
} from "@heroicons/react/solid";

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
    const [currentOwner, setCurrentOwner] = useState(
        "0xBc35F66f0B66035116670F8556E3c792264Fb1e2"
    );
    const [currentTender, setCurrentTender] = useState(null);
    const [selected, setSelected] = useState(contractors[0] || null);
    const [appliedStatus, setAppliedStatus] = useState(false);
    const stats = [
        {
            label: "Owner",
            value: `${
                currentOwner.substring(0, 5) +
                "...." +
                currentOwner.substring(currentOwner.length - 5)
            }`,
        },
        { label: "Current Contractors", value: `${contractors.length}` },
        { label: "Status", value: "Ongoing" },
        { label: "Entry price", value: "Ξ 0.01" },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

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
            // throw new Error("No ethereum object");
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

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", () => {
                window.location.reload();
            });
            window.ethereum.on("accountsChanged", () => {
                window.location.reload();
            });
        }
    }, []);

    useEffect(() => {
        if (currentAccount !== null) {
            if (contractors.includes(currentAccount)) {
                setAppliedStatus(true);
            }
        }
    }, [contractors]);

    console.log("Current Acount: ", currentAccount);
    console.log("Current contract", abiContract);
    console.log("Current status", tenderStatus);
    console.log("Contract Signer", contractSigner);
    console.log("Contractors", contractors);
    console.log("Past Contractors", pastContractors);
    console.log("Current tender", currentTender);

    return (
        <div className="w-screen h-screen m-auto">
            <div className="container m-auto w-3/4 h-full">
                <Head className="flex justify-center items-center m-auto text-center">
                    <title>TenderMe</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className="h-full w-full">
                    <div className="flex flex-row w-full h-20 relative mt-10 sm:flex-col md:flex-col lg:flex-row xl:flex-row ">
                        <div className="w-3/4">
                            <h1 className="title text-teal-600 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                                TenderMe
                            </h1>
                        </div>
                        <div className="w-1/4 relative r-0 flex items-right justify-end">
                            {currentAccount == null && (
                                <button
                                    className="bg-teal-700 h-16 w-60 rounded-xl text-white  font-bold font-sans text-xl  px-2 py-2 text-center flex justify-center items-center"
                                    onClick={() => {
                                        connectToMetamaskWallet();
                                    }}
                                >
                                    Connect Wallet
                                </button>
                            )}
                            {currentAccount && (
                                <div className="bg-teal-600 px-8 py-2 h-16 rounded text-white font-semibold flex justify-center items-center">
                                    <h4 className="">
                                        {currentAccount.substring(0, 10) +
                                            "...." +
                                            currentAccount.substring(
                                                currentAccount.length - 5
                                            )}
                                    </h4>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="h-3/4 w-full mt-6 bg-slate-50 rounded flex justify-center items-center m-auto">
                        {!currentAccount && (
                            <div className="relative ">
                                <div className="sm:text-center">
                                    <h2 className="inline text-4xl font-extrabold tracking-tight text-cyan-900 sm:block sm:text-4xl lg:text-5xl">
                                        Metamask not connected!
                                    </h2>
                                    <p className="mt-6 mx-auto max-w-2xl text-lg text-teal-700">
                                        In order to access the TenderMe
                                        platform, kindly click on the connect
                                        metamask button and connect your account
                                        to TenderMe.
                                    </p>
                                </div>
                            </div>
                        )}
                        {currentAccount &&
                            currentAccount !==
                                "0xBc35F66f0B66035116670F8556E3c792264Fb1e2" && (
                                <div className="relative mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6 lg:px-0">
                                    {/* Content area */}
                                    <div className="pt-12 sm:pt-16 lg:pt-20">
                                        <h2 className="text-3xl tracking-tight text-cyan-800 font-extrabold tracking-tight sm:text-4xl">
                                            Dummy Tender for Ashoka v2.0
                                        </h2>
                                        <div className="mt-6 text-slate-500 space-y-6">
                                            <p className="text-lg">
                                                Sagittis scelerisque nulla
                                                cursus in enim consectetur quam.
                                                Dictum urna sed consectetur
                                                neque tristique pellentesque.
                                                Blandit amet, sed aenean erat
                                                arcu morbi. Cursus faucibus nunc
                                                nisl netus morbi vel porttitor
                                                vitae ut. Amet vitae fames
                                                senectus vitae.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Stats section */}
                                    <div className="mt-10">
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                                            {stats.map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="border-t-2 border-gray-100 pt-6"
                                                >
                                                    <dt className="text-base font-medium tracking-tight text-cyan-900">
                                                        {stat.label}
                                                    </dt>
                                                    <dd className="text-3xl font-extrabold tracking-tight text-cyan-800">
                                                        {stat.value}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={appliedStatus}
                                        onClick={() => {
                                            applyForTender();
                                        }}
                                        className={`${
                                            appliedStatus === true
                                                ? "cursor-not-allowed"
                                                : "cursor"
                                        } inline-flex items-center mt-10 h-16 w-1/2 px-4 py-2 border border-transparent shadow-sm font-bold tracking-wide rounded-md text-white bg-teal-700 hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700 flex items-center justify-center text-xl mt-10 mb-10 text-white`}
                                    >
                                        Apply Now
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        {currentAccount &&
                            currentAccount ===
                                "0xBc35F66f0B66035116670F8556E3c792264Fb1e2" && (
                                <div className="container w-11/12 h-full flex flex-row mt-8">
                                    <div className="w-7/12">
                                        <h1 className="mb-10 text-3xl font-extrabold tracking-tight text-teal-800 sm:text-4xl">
                                            Contractors
                                        </h1>
                                        <RadioGroup
                                            value={selected}
                                            onChange={setSelected}
                                        >
                                            <RadioGroup.Label className="sr-only">
                                                Contractors Size
                                            </RadioGroup.Label>
                                            <div className="space-y-4">
                                                {contractors.length > 0 &&
                                                    contractors.map(
                                                        (contractor, index) => (
                                                            <RadioGroup.Option
                                                                key={contractor}
                                                                value={
                                                                    contractor
                                                                }
                                                                onClick={() => {
                                                                    setCurrentTender(
                                                                        index
                                                                    );
                                                                }}
                                                                className={({
                                                                    checked,
                                                                    active,
                                                                }) =>
                                                                    classNames(
                                                                        checked
                                                                            ? "border-transparent"
                                                                            : "border-gray-300",
                                                                        active
                                                                            ? "border-teal-500 ring-2 ring-teal-500"
                                                                            : "",
                                                                        "relative block bg-white border rounded-lg shadow-sm px-6 py-4 cursor-pointer sm:flex sm:justify-between focus:outline-none"
                                                                    )
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    checked,
                                                                }) => (
                                                                    <>
                                                                        <span className="flex items-center">
                                                                            <span className="text-sm flex flex-col">
                                                                                <RadioGroup.Label
                                                                                    as="span"
                                                                                    className="font-medium text-gray-900"
                                                                                >
                                                                                    {`Contractor ${index}`}
                                                                                </RadioGroup.Label>
                                                                                <RadioGroup.Description
                                                                                    as="span"
                                                                                    className="text-gray-500"
                                                                                >
                                                                                    <span className="block sm:inline">
                                                                                        {
                                                                                            contractor
                                                                                        }{" "}
                                                                                    </span>{" "}
                                                                                    <span
                                                                                        className="hidden sm:inline sm:mx-1"
                                                                                        aria-hidden="true"
                                                                                    >
                                                                                        &middot;
                                                                                    </span>{" "}
                                                                                </RadioGroup.Description>
                                                                            </span>
                                                                        </span>
                                                                        <RadioGroup.Description
                                                                            as="span"
                                                                            className="mt-2 flex text-sm sm:mt-0 sm:flex-col sm:ml-4 sm:text-right"
                                                                        >
                                                                            <span className="font-medium text-gray-900">
                                                                                {`Ξ 0.01`}
                                                                            </span>
                                                                        </RadioGroup.Description>
                                                                        <span
                                                                            className={classNames(
                                                                                active
                                                                                    ? "border"
                                                                                    : "border-2",
                                                                                checked
                                                                                    ? "border-teal-500"
                                                                                    : "border-transparent",
                                                                                "absolute -inset-px rounded-lg pointer-events-none"
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                    </>
                                                                )}
                                                            </RadioGroup.Option>
                                                        )
                                                    )}
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="w-5/12 mt-10">
                                        <section
                                            aria-labelledby="summary-heading"
                                            className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                                        >
                                            <h2
                                                id="summary-heading"
                                                className="text-lg font-medium text-gray-900"
                                            >
                                                Update Tender
                                            </h2>

                                            <dl className="mt-6 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <dt className="text-sm text-gray-600">
                                                        Subtotal
                                                    </dt>
                                                    <dd className="text-sm font-medium text-gray-900">
                                                        Ξ 324.89
                                                    </dd>
                                                </div>

                                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                                    <dt className="flex text-sm text-gray-600">
                                                        <span>
                                                            Tax estimate
                                                        </span>
                                                        <a
                                                            href="#"
                                                            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                                                        >
                                                            <span className="sr-only">
                                                                Ξ 70.01
                                                            </span>
                                                            <QuestionMarkCircleIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </a>
                                                    </dt>
                                                    <dd className="text-sm font-medium text-gray-900">
                                                        Ξ 70.01
                                                    </dd>
                                                </div>
                                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                                    <dt className="flex text-sm text-gray-600">
                                                        <span>Contractor</span>
                                                        <a
                                                            href="#"
                                                            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                                                        >
                                                            <span className="sr-only">
                                                                {currentTender ===
                                                                null
                                                                    ? "-"
                                                                    : `Contractor ${currentTender}`}
                                                            </span>
                                                        </a>
                                                    </dt>
                                                    <dd className="text-sm font-medium text-gray-900">
                                                        {currentTender === null
                                                            ? "-"
                                                            : `Contractor ${currentTender}`}
                                                    </dd>
                                                </div>
                                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                                    <dt className="text-base font-medium text-gray-900">
                                                        Tender Total
                                                    </dt>
                                                    <dd className="text-base font-medium text-gray-900">
                                                        Ξ 404.9
                                                    </dd>
                                                </div>
                                            </dl>

                                            <div className="mt-6">
                                                <button
                                                    type="submit"
                                                    onClick={() => {
                                                        chooseContractorMethod(
                                                            currentTender
                                                        );
                                                    }}
                                                    className="w-full bg-teal-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-teal-500"
                                                >
                                                    Declare Tender
                                                </button>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* <button
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
                    </button> */}
                </main>
            </div>
        </div>
    );
}
