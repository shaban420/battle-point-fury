import { useState, useCallback, useEffect } from "react";
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
import { formatTokenAmount, parseTokenAmount } from "@/lib/blockchain";
import { useWeb3 } from "@/contexts/Web3Context";

const Index = () => {
  const { connectedAddress, contract, contractReadOnly, connectWallet } = useWeb3();
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
      const connectedAddr = await connectWallet(ethProvider);
      if (connectedAddr) {
        await loadPlayerData(connectedAddr);
        addActivity("success", "Wallet connected successfully");
        toast.success("Wallet connected to Sepolia!");
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      addActivity("error", "Failed to connect wallet");
      toast.error(error?.message || "Failed to connect wallet");
    }
  };

  const loadPlayerData = useCallback(async (address: string) => {
    if (!contractReadOnly) return;
    
    try {
      // Batch all reads together for efficiency
      const [balanceWei, stats, ...weaponData] = await Promise.all([
        contractReadOnly.balanceOf(address),
        contractReadOnly.getPlayerStats(address),
        contractReadOnly.getWeaponStats(address, 0),
        contractReadOnly.getWeaponStats(address, 1),
        contractReadOnly.getWeaponStats(address, 2),
      ]);
      
      // Update all state in one batch
      setBalance(formatTokenAmount(balanceWei));
      setWins(stats[0].toNumber());
      setEnergy(stats[1].toNumber());
      setStakedAmount(formatTokenAmount(stats[2]));
      setPendingRewards(formatTokenAmount(stats[3]));
      
      setWeapons(
        weaponData.map((stats) => ({
          damage: stats[0],
          range: stats[1],
          speed: stats[2],
          armor: stats[3],
        }))
      );
    } catch (error: any) {
      console.error("Error loading player data:", error);
      const errorMsg = error?.reason || error?.message || "Failed to load player data. Please ensure you're on Sepolia network.";
      toast.error(errorMsg);
      addActivity("error", errorMsg);
    }
  }, [contractReadOnly]);

  const handleWinMatch = async () => {
    if (!connectedAddress || !contract) return;
    
    setIsProcessing(true);
    try {
      addActivity("info", "Submitting battle victory...");
      const tx = await contract.mintForWin(connectedAddress);
      
      addActivity("info", "Waiting for confirmation...");
      await tx.wait();
      
      await loadPlayerData(connectedAddress);
      
      addActivity("success", "Victory! Earned 25 BPT");
      toast.success("🔥 VICTORY! +25 BPT", {
        description: "+10 Energy",
      });
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg = error?.reason || error?.message || "Transaction failed";
      addActivity("error", errorMsg);
      toast.error("Transaction failed", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnergyBoost = async () => {
    if (!connectedAddress || !contract) return;
    
    setIsProcessing(true);
    try {
      addActivity("info", "Boosting energy...");
      const tx = await contract.energyBoost();
      
      addActivity("info", "Waiting for confirmation...");
      await tx.wait();
      
      await loadPlayerData(connectedAddress);
      
      addActivity("success", "Energy boosted +50");
      toast.success("⚡ Energy Boosted!", {
        description: "+50 Energy",
      });
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg = error?.reason || error?.message || "Transaction failed";
      addActivity("error", errorMsg);
      toast.error("Transaction failed", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransfer = async (to: string, amount: string) => {
    if (!to || !amount || !connectedAddress || !contract) return;
    
    setIsProcessing(true);
    try {
      const amountWei = parseTokenAmount(amount);
      
      addActivity("info", `Transferring ${amount} BPT...`);
      const tx = await contract.transfer(to, amountWei);
      
      addActivity("info", "Waiting for confirmation...");
      await tx.wait();
      
      await loadPlayerData(connectedAddress);
      
      addActivity("success", `Transferred ${amount} BPT to teammate`);
      toast.success("Transfer successful!", {
        description: `Sent ${amount} BPT`,
      });
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg = error?.reason || error?.message || "Transaction failed";
      addActivity("error", errorMsg);
      toast.error("Transaction failed", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBurn = async (amount: string) => {
    if (!amount || !connectedAddress || !contract) return;
    
    setIsProcessing(true);
    try {
      const amountWei = parseTokenAmount(amount);
      
      addActivity("info", `Burning ${amount} BPT...`);
      const tx = await contract.burn(amountWei);
      
      addActivity("info", "Waiting for confirmation...");
      await tx.wait();
      
      await loadPlayerData(connectedAddress);
      
      addActivity("success", `Burned ${amount} BPT`);
      toast.success("Tokens burned!", {
        description: `Destroyed ${amount} BPT`,
      });
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg = error?.reason || error?.message || "Transaction failed";
      addActivity("error", errorMsg);
      toast.error("Transaction failed", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async (weaponId: number, statId: number) => {
    if (!connectedAddress || !contract) return;
    
    setIsProcessing(true);
    try {
      const statNames = ["damage", "range", "speed", "armor"];
      addActivity("info", `Upgrading weapon ${statNames[statId]}...`);
      
      const tx = await contract.upgradeWeapon(weaponId, statId);
      
      addActivity("info", "Waiting for confirmation...");
      await tx.wait();
      
      await loadPlayerData(connectedAddress);
      
      addActivity("success", `Weapon upgraded: ${statNames[statId]} +5`);
      toast.success("Weapon Upgraded!", {
        description: `${statNames[statId].toUpperCase()} +5`,
      });
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg = error?.reason || error?.message || "Transaction failed";
      addActivity("error", errorMsg);
      toast.error("Transaction failed", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStake = async (amount: string) => {
    if (!amount || !connectedAddress || !contract) return;
    
    setIsProcessing(true);
    try {
      const amountWei = parseTokenAmount(amount);
      
      addActivity("info", `Staking ${amount} BPT...`);
      const tx = await contract.stake(amountWei);
      
      addActivity("info", "Waiting for confirmation...");
      await tx.wait();
      
      await loadPlayerData(connectedAddress);
      
      addActivity("success", `Staked ${amount} BPT`);
      toast.success("Staking successful!", {
        description: `Staked ${amount} BPT`,
      });
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg = error?.reason || error?.message || "Transaction failed";
      addActivity("error", errorMsg);
      toast.error("Transaction failed", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnstake = async (amount: string) => {
    if (!amount || !connectedAddress || !contract) return;
    
    setIsProcessing(true);
    try {
      const amountWei = parseTokenAmount(amount);
      
      addActivity("info", `Unstaking ${amount} BPT...`);
      const tx = await contract.unstake(amountWei);
      
      addActivity("info", "Waiting for confirmation...");
      await tx.wait();
      
      await loadPlayerData(connectedAddress);
      
      addActivity("success", `Unstaked ${amount} BPT`);
      toast.success("Unstaking successful!", {
        description: `Withdrew ${amount} BPT`,
      });
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg = error?.reason || error?.message || "Transaction failed";
      addActivity("error", errorMsg);
      toast.error("Transaction failed", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!connectedAddress || !contract) return;
    
    setIsProcessing(true);
    try {
      addActivity("info", "Claiming rewards...");
      const tx = await contract.claimRewards();
      
      addActivity("info", "Waiting for confirmation...");
      await tx.wait();
      
      await loadPlayerData(connectedAddress);
      
      const rewards = parseFloat(pendingRewards);
      addActivity("success", `Claimed ${rewards.toFixed(2)} BPT rewards`);
      toast.success("Rewards claimed!", {
        description: `Received ${rewards.toFixed(2)} BPT`,
      });
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg = error?.reason || error?.message || "Transaction failed";
      addActivity("error", errorMsg);
      toast.error("Transaction failed", {
        description: errorMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Load player data when address changes (from account switch)
  useEffect(() => {
    if (connectedAddress && contractReadOnly) {
      loadPlayerData(connectedAddress);
    }
  }, [connectedAddress, contractReadOnly, loadPlayerData]);


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
