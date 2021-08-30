import { ethers } from "ethers"


const provider = ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();