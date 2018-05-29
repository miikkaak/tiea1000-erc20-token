// Importing node-modules we need
import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";

// Importing compiled contracts here
import token_artifact from "../build/contracts/MiggersToken.json";

// Importing styles
import styles from "./styles/index.scss";

// Making usable abstraction from our artifacts, so we can use it in code.
// var contract = contract(contract_abi);
var Token = contract(token_artifact);

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
        Token.setProvider(web3.currentProvider);
        web3.eth.getAccounts(console.log);
        web3.eth.getAccounts((err, accounts) => {
        	if (accounts.length == 0)
        		alert("Couldn't find accounts, configure your MetaMask.");
        	web3.eth.defaultAccount = accounts[0];
        	console.log(accounts.length);
        	console.log(web3.eth.defaultAccount);
        	App.getBalance();
        })
        	.catch(error => {
        		alert(error);
        	});
    },

    getBalance: () => {
    	Token.deployed()
    		.then(instance => {
    			return instance.balanceOf(web3.eth.defaultAccount);
    		})
    		.then(value => {
    			console.log(value);
    			console.log(value.toNumber());
    			document.getElementById("balance").innerHTML = value.toNumber();
    		})
    		.catch(error => {
    			console.log(error);
    		});
    }	
	

};


window.functions = {


	send: () => {
		
		var loader = document.getElementById("loader");
		loader.style.display == "block";
		var toAddress = document.getElementById("to").value;
		console.log(toAddress);
		var amount = document.getElementById("amount").value;
		
		Token.deployed()
			.then(instance => {
				return instance.transfer(toAddress, amount, { from: web3.eth.defaultAccount});
			})	
			.then(value => {
				if (true) {
					document.getElementById("message").innerHTML = "Transaction sent to address " + toAddress +
				". Amount: " + amount;
				loader.style.display == "none";
				App.getBalance();
				}
				console.log(value);
			})
			.catch(error => {
				document.getElementById("message").innerHTML = "Transaction failed!";
				console.log(error);
			})
	} 
};
/**
 * Initializing our App on window load
 * 'load' Happens when browser window loads
 */
window.addEventListener("load", () => {
    App.init();
});
