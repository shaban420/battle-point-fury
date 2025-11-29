import { ethers } from "ethers";
import { BPT_ADDRESS, BPT_ABI } from "./contractInfo";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

export const checkAndSwitchNetwork = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    
    if (chainId !== SEPOLIA_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          throw new Error("Please add Sepolia network to MetaMask");
        }
        throw switchError;
      }
    }
  } catch (error) {
    console.error("Network check error:", error);
    throw error;
  }
};

export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  return new ethers.providers.Web3Provider(window.ethereum);
};

export const getSigner = async () => {
  await checkAndSwitchNetwork();
  const provider = getProvider();
  return provider.getSigner();
};

export const getContract = async () => {
  const signer = await getSigner();
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
