import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import WalletConnect from "@/components/WalletConnect";
import PlayerDashboard from "@/components/PlayerDashboard";
import WeaponUpgrade from "@/components/WeaponUpgrade";
import BattleActions from "@/components/BattleActions";
import StakingModule from "@/components/StakingModule";
import ActivityLog, { Activity } from "@/components/ActivityLog";
import Leaderboard from "@/components/Leaderboard";
import backgroundImage from "@/assets/battle-background.jpg";

// Contract ABI (simplified for demo - in production, import full ABI)
const CONTRACT_ABI = [
  "function mintForWin(address player) external",
  "function burn(uint256 amount) external",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function upgradeWeapon(uint8 weaponId, uint8 statId) external",
  "function energyBoost() external",
  "function stake(uint256 amount) external",
  "function claimRewards() external",
  "function unstake(uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function getPlayerStats(address player) external view returns (uint256, uint256, uint256, uint256)",
  "function getWeaponStats(address player, uint8 weaponId) external view returns (uint8, uint8, uint8, uint8)",
];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

const Index = () => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [balance, setBalance] = useState("0");
  const [wins, setWins] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [stakedAmount, setStakedAmount] = useState("0");
  const [pendingRewards, setPendingRewards] = useState("0");
  const [weapons, setWeapons] = useState([
    { damage: 10, range: 10, speed: 10, armor: 10 },
    { damage: 15, range: 20, speed: 5, armor: 10 },
    { damage: 20, range: 5, speed: 15, armor: 10 },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leaderboard, setLeaderboard] = useState([
    { address: "0x1234...5678", balance: "1250", wins: 45 },
    { address: "0x8765...4321", balance: "980", wins: 38 },
    { address: "0xabcd...efgh", balance: "750", wins: 29 },
  ]);

  const addActivity = (type: "success" | "error" | "info", message: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
    };
    setActivities((prev) => [...prev, newActivity]);
  };

  const handleConnect = async (address: string, ethProvider: any) => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(ethProvider);
      const signer = web3Provider.getSigner();
      
      // For demo purposes, we'll simulate contract interactions
      // In production, use actual deployed contract
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        toast.info("Demo Mode: Using simulated contract interactions");
        addActivity("info", "Connected in demo mode - deploy contract for full functionality");
      }
      
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setConnectedAddress(address);
      setProvider(web3Provider);
      setContract(contractInstance);
      
      await loadPlayerData(address, contractInstance);
      addActivity("success", "Wallet connected successfully");
      toast.success("Wallet connected!");
    } catch (error) {
      console.error("Connection error:", error);
      addActivity("error", "Failed to connect wallet");
      toast.error("Failed to connect wallet");
    }
  };

  const loadPlayerData = async (address: string, contractInstance: any) => {
    try {
      // Demo mode - simulate data
      setBalance("100");
      setWins(5);
      setEnergy(50);
      setStakedAmount("50");
      setPendingRewards("2.5");
      
      // In production, load from contract:
      // const balance = await contractInstance.balanceOf(address);
      // const stats = await contractInstance.getPlayerStats(address);
      // etc.
    } catch (error) {
      console.error("Error loading player data:", error);
    }
  };

  const handleWinMatch = async () => {
    if (!connectedAddress) return;
    
    setIsProcessing(true);
    try {
      // Demo mode simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance((prev) => (parseFloat(prev) + 25).toString());
      setWins((prev) => prev + 1);
      setEnergy((prev) => Math.min(prev + 10, 100));
      
      addActivity("success", "Victory! Earned 25 BPT");
      toast.success("🔥 VICTORY! +25 BPT", {
        description: "+10 Energy",
      });
      
      // In production:
      // const tx = await contract.mintForWin(connectedAddress);
      // await tx.wait();
    } catch (error) {
      console.error("Error:", error);
      addActivity("error", "Battle action failed");
      toast.error("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnergyBoost = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setBalance((prev) => (parseFloat(prev) - 10).toString());
      setEnergy((prev) => Math.min(prev + 50, 100));
      
      addActivity("success", "Energy boosted +50");
      toast.success("⚡ Energy Boosted!", {
        description: "+50 Energy",
      });
    } catch (error) {
      addActivity("error", "Energy boost failed");
      toast.error("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransfer = async (to: string, amount: string) => {
    if (!to || !amount) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance((prev) => (parseFloat(prev) - parseFloat(amount)).toString());
      
      addActivity("success", `Transferred ${amount} BPT to teammate`);
      toast.success("Transfer successful!", {
        description: `Sent ${amount} BPT`,
      });
    } catch (error) {
      addActivity("error", "Transfer failed");
      toast.error("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBurn = async (amount: string) => {
    if (!amount) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setBalance((prev) => (parseFloat(prev) - parseFloat(amount)).toString());
      
      addActivity("success", `Burned ${amount} BPT`);
      toast.success("Tokens burned!", {
        description: `Destroyed ${amount} BPT`,
      });
    } catch (error) {
      addActivity("error", "Burn failed");
      toast.error("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async (weaponId: number, statId: number) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance((prev) => (parseFloat(prev) - 50).toString());
      
      const statNames = ["damage", "range", "speed", "armor"];
      setWeapons((prev) =>
        prev.map((weapon, idx) =>
          idx === weaponId
            ? { ...weapon, [statNames[statId]]: weapon[statNames[statId] as keyof typeof weapon] + 5 }
            : weapon
        )
      );
      
      addActivity("success", `Weapon upgraded: ${statNames[statId]} +5`);
      toast.success("Weapon Upgraded!", {
        description: `${statNames[statId].toUpperCase()} +5`,
      });
    } catch (error) {
      addActivity("error", "Upgrade failed");
      toast.error("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStake = async (amount: string) => {
    if (!amount) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance((prev) => (parseFloat(prev) - parseFloat(amount)).toString());
      setStakedAmount((prev) => (parseFloat(prev) + parseFloat(amount)).toString());
      
      addActivity("success", `Staked ${amount} BPT`);
      toast.success("Staking successful!", {
        description: `Staked ${amount} BPT`,
      });
    } catch (error) {
      addActivity("error", "Staking failed");
      toast.error("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnstake = async (amount: string) => {
    if (!amount) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance((prev) => (parseFloat(prev) + parseFloat(amount)).toString());
      setStakedAmount((prev) => (parseFloat(prev) - parseFloat(amount)).toString());
      
      addActivity("success", `Unstaked ${amount} BPT`);
      toast.success("Unstaking successful!", {
        description: `Withdrew ${amount} BPT`,
      });
    } catch (error) {
      addActivity("error", "Unstaking failed");
      toast.error("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimRewards = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const rewards = parseFloat(pendingRewards);
      setBalance((prev) => (parseFloat(prev) + rewards).toString());
      setPendingRewards("0");
      
      addActivity("success", `Claimed ${rewards.toFixed(2)} BPT rewards`);
      toast.success("Rewards claimed!", {
        description: `Received ${rewards.toFixed(2)} BPT`,
      });
    } catch (error) {
      addActivity("error", "Claim failed");
      toast.error("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="fire-gradient bg-clip-text text-transparent">
                BATTLEPOINT
              </span>
            </h1>
            <p className="text-battle-glow text-lg font-semibold">ARENA FURY</p>
          </div>
          <WalletConnect
            onConnect={handleConnect}
            connectedAddress={connectedAddress}
          />
        </header>

        {connectedAddress ? (
          <div className="space-y-6">
            {/* Dashboard */}
            <PlayerDashboard
              address={connectedAddress}
              balance={balance}
              wins={wins}
              energy={energy}
              stakedAmount={stakedAmount}
              pendingRewards={pendingRewards}
            />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <BattleActions
                  onWinMatch={handleWinMatch}
                  onEnergyBoost={handleEnergyBoost}
                  onTransfer={handleTransfer}
                  onBurn={handleBurn}
                  isProcessing={isProcessing}
                />
                <ActivityLog activities={activities} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <WeaponUpgrade
                  weapons={weapons}
                  onUpgrade={handleUpgrade}
                  isUpgrading={isProcessing}
                />
                <Leaderboard
                  entries={leaderboard}
                  currentAddress={connectedAddress}
                />
              </div>
            </div>

            {/* Staking Module - Full Width */}
            <StakingModule
              stakedAmount={stakedAmount}
              pendingRewards={pendingRewards}
              onStake={handleStake}
              onUnstake={handleUnstake}
              onClaimRewards={handleClaimRewards}
              isProcessing={isProcessing}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="glass-card p-12 rounded-2xl border-2 border-primary/30 max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 fire-gradient bg-clip-text text-transparent">
                ENTER THE ARENA
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Connect your wallet to start battling, earning rewards, and upgrading weapons
              </p>
              <div className="flex flex-col gap-4 text-left text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full fire-gradient" />
                  <span>Win matches and earn 25 BPT per victory</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full purple-gradient" />
                  <span>Upgrade weapons and dominate the battlefield</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-battle-energy" />
                  <span>Stake tokens and earn passive rewards</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Support teammates with token transfers</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
