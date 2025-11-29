import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectProps {
  onConnect: (address: string, provider: any) => void;
  connectedAddress: string | null;
}

const WalletConnect = ({ onConnect, connectedAddress }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      alert("MetaMask is not installed!\n\nPlease install MetaMask from https://metamask.io to use this DApp.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    // Check if it's actually MetaMask (not another wallet)
    if (!window.ethereum.isMetaMask) {
      alert("Please use MetaMask wallet to connect.");
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts && accounts.length > 0) {
        onConnect(accounts[0], window.ethereum);
      } else {
        throw new Error("No accounts found");
      }
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      
      // Handle specific errors
      if (error.code === 4001) {
        alert("Connection rejected. Please approve the connection in MetaMask.");
      } else if (error.code === -32002) {
        alert("Connection request already pending. Please check MetaMask.");
      } else {
        alert(`Failed to connect: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-4">
      {connectedAddress ? (
        <div className="glass-card px-6 py-3 rounded-lg neon-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-battle-energy animate-pulse-fire" />
            <span className="text-battle-glow font-semibold">
              {shortenAddress(connectedAddress)}
            </span>
          </div>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="fire-gradient hover:opacity-90 transition-all font-bold text-lg px-8 py-6 rounded-lg shadow-[0_0_20px_rgba(255,107,0,0.5)] hover:shadow-[0_0_40px_rgba(255,107,0,0.8)]"
        >
          <Wallet className="mr-2 h-5 w-5" />
          {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
