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
    // Check if any injected provider exists
    const anyEthereum = (window as any).ethereum;

    if (!anyEthereum) {
      alert(
        "MetaMask is not detected.\n\nPlease install MetaMask from https://metamask.io or enable it for this browser profile."
      );
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    // Some browsers/wallets inject multiple providers (MetaMask, Coinbase, etc.)
    // Prefer the MetaMask provider if available
    let metamaskProvider = anyEthereum;

    if (anyEthereum.providers && Array.isArray(anyEthereum.providers)) {
      const mm = anyEthereum.providers.find((p: any) => p.isMetaMask);
      if (mm) {
        metamaskProvider = mm;
      }
    }

    if (!metamaskProvider.request) {
      alert("Detected wallet provider does not support the required API.");
      return;
    }

    try {
      setIsConnecting(true);

      // Request account access from the selected provider
      const accounts: string[] = await metamaskProvider.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        onConnect(accounts[0], metamaskProvider);
      } else {
        throw new Error("No accounts returned by wallet");
      }
    } catch (error: any) {
      console.error("MetaMask connection error:", error);

      if (error?.code === 4001) {
        // EIP-1193 userRejectedRequest error
        alert("You rejected the connection request. Please approve it in MetaMask to continue.");
      } else if (error?.code === -32002) {
        // Request already pending
        alert("A connection request is already pending in MetaMask. Please open MetaMask and complete it.");
      } else {
        alert(`Failed to connect wallet: ${error?.message || "Unknown error"}`);
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
