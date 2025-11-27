import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Unlock, Gift } from "lucide-react";

interface StakingModuleProps {
  stakedAmount: string;
  pendingRewards: string;
  onStake: (amount: string) => void;
  onUnstake: (amount: string) => void;
  onClaimRewards: () => void;
  isProcessing: boolean;
}

const StakingModule = ({
  stakedAmount,
  pendingRewards,
  onStake,
  onUnstake,
  onClaimRewards,
  isProcessing,
}: StakingModuleProps) => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  return (
    <div className="glass-card p-6 rounded-xl border-2 border-secondary/30">
      <h3 className="text-2xl font-bold mb-6 text-secondary flex items-center gap-2">
        <Lock className="w-6 h-6" />
        STAKING VAULT
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4 rounded-lg border border-secondary/30">
          <p className="text-sm text-muted-foreground mb-1">STAKED AMOUNT</p>
          <p className="text-2xl font-bold text-secondary">{stakedAmount} BPT</p>
        </div>
        <div className="glass-card p-4 rounded-lg border border-battle-energy/30">
          <p className="text-sm text-muted-foreground mb-1">PENDING REWARDS</p>
          <p className="text-2xl font-bold text-battle-energy">{pendingRewards} BPT</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">STAKE TOKENS</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="bg-input border-border flex-1"
            />
            <Button
              onClick={() => {
                onStake(stakeAmount);
                setStakeAmount("");
              }}
              disabled={isProcessing || !stakeAmount}
              className="purple-gradient hover:opacity-90 font-bold px-8"
            >
              <Lock className="mr-2 h-4 w-4" />
              STAKE
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">UNSTAKE TOKENS</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to unstake"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              className="bg-input border-border flex-1"
            />
            <Button
              onClick={() => {
                onUnstake(unstakeAmount);
                setUnstakeAmount("");
              }}
              disabled={isProcessing || !unstakeAmount}
              className="bg-destructive hover:bg-destructive/90 font-bold px-8"
            >
              <Unlock className="mr-2 h-4 w-4" />
              UNSTAKE
            </Button>
          </div>
        </div>

        <Button
          onClick={onClaimRewards}
          disabled={isProcessing || parseFloat(pendingRewards) === 0}
          size="lg"
          className="w-full fire-gradient hover:opacity-90 font-bold text-lg py-6"
        >
          <Gift className="mr-2 h-5 w-5" />
          CLAIM REWARDS
        </Button>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
        <p className="text-sm text-muted-foreground">
          <span className="text-accent font-bold">STAKING REWARDS:</span> Earn 10% APY on your staked BPT tokens. Rewards are calculated per second and can be claimed anytime.
        </p>
      </div>
    </div>
  );
};

export default StakingModule;
