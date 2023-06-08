import { useEffect, useState } from "react";

import "./App.css";

import lotteryContract from "./config/lotteryContract";
import web3 from "./config/web3";

function App() {
  const [manager, setManager] = useState(null);
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const getManager = async () => {
    // Leave call function empty because metamask knows who is calling the function
    // But in case of transactions we need to know who is sending the transaction
    const manager = await lotteryContract.methods.manager().call();
    setManager(manager);
  };

  const getPlayers = async () => {
    const players = await lotteryContract.methods.getPlayers().call();
    setPlayers(players);
  };

  const getBalance = async () => {
    const contractBalance = await web3.eth.getBalance(
      lotteryContract.options.address
    );
    setBalance(contractBalance);
  };

  const getContractData = () => {
    getManager();
    getPlayers();
    getBalance();
  };

  useEffect(() => {
    getContractData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (value.length === 0) {
      setMessage("Invalid ether amount!");
      return;
    }

    setMessage("Waiting on transaction success...");

    const accounts = await web3.eth.getAccounts();

    await lotteryContract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
    setValue("");
    getContractData();
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lotteryContract.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
    getContractData();
  };

  /*
  ===============================
               JSX
  ===============================
  */
  const managerPlayersInfo = (
    <>
      <p>
        {manager
          ? `This contract is managed by ${manager}`
          : "Loading manager..."}
      </p>
      <p>Players entered: {players.length}</p>
      <p>Winning Prize: {web3.utils.fromWei(balance, "ether")} ether!</p>
    </>
  );

  const enterLotteryForm = (
    <form onSubmit={handleFormSubmit}>
      <h4>Want to try your luck?</h4>
      <div>
        <label>Amount of ether to enter:&nbsp;&nbsp;</label>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <button type="submit">Enter</button>
    </form>
  );

  // ============================

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      {managerPlayersInfo}
      <hr />
      {enterLotteryForm}
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick a winner</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
