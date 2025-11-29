import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ethers } from "ethers";
import { BPT_ADDRESS, BPT_ABI } from "@/lib/contractInfo";

interface Web3ContextType {
  connectedAddress: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  contractReadOnly: ethers.Contract | null;
  connectWallet: (ethProvider: any) => Promise<string | null>;
  disconnectWallet: () => void;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [contractReadOnly, setContractReadOnly] = useState<ethers.Contract | null>(null);

  // Initialize read-only contract on mount
  useEffect(() => {
    if (window.ethereum) {
      const readProvider = new ethers.providers.Web3Provider(window.ethereum);
      const readContract = new ethers.Contract(BPT_ADDRESS, BPT_ABI, readProvider);
      setContractReadOnly(readContract);
    }
  }, []);

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== connectedAddress) {
      setConnectedAddress(accounts[0]);
    }
  }, [connectedAddress]);

  // Handle chain changes
  const handleChainChanged = useCallback(() => {
    // Reload the page when chain changes to ensure clean state
    window.location.reload();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const connectWallet = async (ethProvider: any): Promise<string | null> => {
    try {
      // Create provider instance ONCE
      const web3Provider = new ethers.providers.Web3Provider(ethProvider);
      
      // Check network
      const network = await web3Provider.getNetwork();
      if (network.chainId !== 11155111) {
        throw new Error("Please switch to Sepolia network");
      }

      // Get signer and address
      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      // Create contract instance ONCE with signer
      const contractInstance = new ethers.Contract(BPT_ADDRESS, BPT_ABI, web3Signer);

      // Update all state at once
      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setConnectedAddress(address);

      return address;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  };

  const disconnectWallet = useCallback(() => {
    setConnectedAddress(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
  }, []);

  const value: Web3ContextType = {
    connectedAddress,
    provider,
    signer,
    contract,
    contractReadOnly,
    connectWallet,
    disconnectWallet,
    isConnected: !!connectedAddress,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
