import web3 from "../config/web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../data/lotteryContract";

export default new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
