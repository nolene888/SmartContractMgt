# Project Title

Project: Function Frontend

## Description

This program is a simple contract written in Solidity,a programming language used for developing smart contracts on the Ethereum blockchain and Javascript, a programming lanuage to display the value of the contract functions on the frontend of the application. Aside from the default functions already in this project (given to us as a template), I added two new features and a little bit of design-change. For the first feature, I gave the transactor the option to input their name and upon submitting, have their name displayed on the page header. This function mainly worked with the Javascript aspect of the project. For the second feature, instead of the default 'Deposit 1 ETH' and 'Withdraw 1 ETH' buttons, I added another button that says 'Deposit 2 ETH'. The new button works similarly as the Deposit 1 ETH button, only this time it allows the user to deposit 2 ETH at a time.

## Getting Started

### Executing Program

To run this execute and run this program, you can use Remix, an online Solidity IDE. To get started, you may use your VSCode IDE. Use this starter template: https://github.com/MetacrafterChris/SCM-Starter and click on the blue code dropdown button. Copy the HTTPS link. 

Once you've copied the link, open VSCode and select Clone GIT Repository and paste the link you've copied. Once you're all set, make these changes to your index.js file and Assessment.sol file.

//For this project, add 2 or 3 new functions to the given application template.
//this is the index.js file

import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const[enteredName, setEnteredName] = useState("");


  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const depositOneETH = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const depositTwoETH = async() => {
    if (atm) {
      let tx = await atm.deposit(2);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <main className="container">
          <button onClick={connectAccount} className="connectWallet">Please connect your Metamask wallet</button>
          <style jsx>{`
            .connectWallet{
              font-family:arial;
              padding:8px;
              border-radius:6px;
              border: none;
              background-color:#33b249;
              color:white;
              border:none;
              font-weight: bold;
            }

            .connectWallet:hover {
              background-color: #3e8e41;
            }

            .connectWallet:active {
              background-color: #3e8e41;
              box-shadow: 0 5px #666;
              transform: translateY(4px);
            }
          `}
          </style>
        </main>
          
      )
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <main className="container">
        <div>
          <p>Your Account: {account}</p>
          <p>Your Balance: {balance}</p>
          <button onClick={depositOneETH}>Deposit 1 ETH</button>
          <button onClick={depositTwoETH}>Deposit 2 ETH</button>
          <button onClick={withdraw}>Withdraw 1 ETH</button>
        </div>
        <style jsx>
          {`
            button{
              font-family:arial;
              padding:8px;
              border-radius:6px;
              border: none;
              background-color:#33b249;
              color:white;
              border:none;
              margin: 4px;
              font-weight:bold;
            }
            
            button:hover {
              background-color: #3e8e41;
            }

            button:active {
              background-color: #3e8e41;
              box-shadow: 0 5px #666;
              transform: translateY(4px);
            }
            
          `}
          
        </style>
      </main>
      
    )
  }

  useEffect(() => {getWallet();}, []);


  const insertName = (event) => {
    event.preventDefault();
    var inputName = document.getElementById("name").value;
    setEnteredName(inputName);
  };


  return (
    <main className="container">
      <form onSubmit={insertName}> 
        <label className="askName">What is your name? </label>
        <input type = "text" id="name" className="giveName"></input>
        <button onClick={insertName}className="submit">Submit</button>
      </form>
      <header id="welcome" className="welcome"><h1>Welcome to the Metacrafters ATM {enteredName}!</h1></header>
      
      
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }

        *{
          font-family: arial
        }

        .askName{
          margin-right: 5px;
          font-size: large;

        }

        .giveName, .submit{
          padding: 8px;
          border-radius: 6px;
          border: 1px solid;

        }


        .submit{
          margin-left: 5px;
          background-color:#4681f4;
          border: none;
          color:white;
          font-weight:bold;
          
        }

        .submit:hover {
          background-color: #55c2da;
        }

        .submit:active {
          background-color: #55c2da;
          box-shadow: 0 5px #666;
          transform: translateY(4px);
        }

        
        form{
          margin-top: 200px;
        }
      
      
      `}
      </style>
    </main>
  );
}

//On the other hand, this is the Assessment.sol file

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function depositOneETH(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    function depositTwoETH(uint256 _amount) public payable{
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}

To make the code work, simply type  npx hardhat run --network localhost scripts/deploy.js to the terminal and the page should load. Interact with the page by first, putting down your name. And then, you can connect your metamask wallet by pressing the respective button. Once you've connected your wallet, you may deposit 1 or 2 ETH at a time, or you may withdraw 1 ETH.

## Author(s)

The author of this file is Nolene Ignacio
