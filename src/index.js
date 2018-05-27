// Importing node-modules we need
import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";

// Importing compiled contracts here

// Importing styles
import styles from "./styles/index.scss";

// Making usable abstraction from our artifacts, so we can use it in code.
// var contract = contract(contract_abi);

window.App = {
    /**
     * Initializing Web3 provider for our app
     */
    initWeb3: () => {
        if (typeof web3 !== "undefined") web3 = new Web3(web3.currentProvider);
        else
            web3 = new Web3(
                new Web3.providers.HttpProvider("http://localhost:9545")
            );
    },

    /**
     * Initializing our App
     */
    init: () => {
        App.initWeb3();
        // Init your contract here and set web3provider to it.
    }
};

/**
 * Initializing our App on window load
 * 'load' Happens when browser window loads
 */
window.addEventListener("load", () => {
    App.init();
});
