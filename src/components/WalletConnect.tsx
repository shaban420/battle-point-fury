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
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this DApp!");
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts.length > 0) {
        onConnect(accounts[0], window.ethereum);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
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
