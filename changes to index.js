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
