import { ethers } from "ethers";
import { BPT_ADDRESS, BPT_ABI } from "./contractInfo";

export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  return new ethers.providers.Web3Provider(window.ethereum);
};

export const getSigner = () => {
  const provider = getProvider();
  return provider.getSigner();
};

export const getContract = () => {
  const signer = getSigner();
  return new ethers.Contract(BPT_ADDRESS, BPT_ABI, signer);
};

export const getContractReadOnly = () => {
  const provider = getProvider();
  return new ethers.Contract(BPT_ADDRESS, BPT_ABI, provider);
};

export const formatTokenAmount = (amount: ethers.BigNumber): string => {
  return ethers.utils.formatEther(amount);
};

export const parseTokenAmount = (amount: string): ethers.BigNumber => {
  return ethers.utils.parseEther(amount);
};

export const addTokenToMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: BPT_ADDRESS,
          symbol: "BPT",
          decimals: 18,
          image: "", // You can add a token logo URL here if available
        },
      },
    });

    return wasAdded;
  } catch (error) {
    console.error("Error adding token to MetaMask:", error);
    throw error;
  }
};
