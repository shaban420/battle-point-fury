import { Award, Zap, Shield, TrendingUp } from "lucide-react";

interface PlayerDashboardProps {
  address: string;
  balance: string;
  wins: number;
  energy: number;
  stakedAmount: string;
  pendingRewards: string;
}

const PlayerDashboard = ({
  address,
  balance,
  wins,
  energy,
  stakedAmount,
  pendingRewards,
}: PlayerDashboardProps) => {
  const energyPercentage = Math.min((energy / 100) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-card p-6 rounded-xl border-2 border-primary/30 hover:border-primary/60 transition-all animate-float">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-medium">BPT BALANCE</span>
          <TrendingUp className="w-5 h-5 text-battle-energy" />
        </div>
        <p className="text-3xl font-bold text-primary animate-glow-pulse">{balance}</p>
      </div>

      <div className="glass-card p-6 rounded-xl border-2 border-destructive/30 hover:border-destructive/60 transition-all animate-float" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-medium">TOTAL WINS</span>
          <Award className="w-5 h-5 text-destructive" />
        </div>
        <p className="text-3xl font-bold text-destructive">{wins}</p>
      </div>

      <div className="glass-card p-6 rounded-xl border-2 border-accent/30 hover:border-accent/60 transition-all animate-float" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-medium">ENERGY</span>
          <Zap className="w-5 h-5 text-battle-energy" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-battle-energy">{energy}/100</p>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full fire-gradient transition-all duration-500"
              style={{ width: `${energyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl border-2 border-secondary/30 hover:border-secondary/60 transition-all animate-float" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm font-medium">STAKED</span>
          <Shield className="w-5 h-5 text-secondary" />
        </div>
        <p className="text-2xl font-bold text-secondary">{stakedAmount}</p>
        <p className="text-sm text-battle-energy mt-1">+{pendingRewards} pending</p>
      </div>
    </div>
  );
};

export default PlayerDashboard;
