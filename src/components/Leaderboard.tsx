import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  address: string;
  balance: string;
  wins: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentAddress: string;
}

const Leaderboard = ({ entries, currentAddress }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-6 h-6 text-battle-energy" />;
      case 1:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 2:
        return <Award className="w-6 h-6 text-primary" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank + 1}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 0:
        return "border-battle-energy bg-battle-energy/10";
      case 1:
        return "border-muted-foreground bg-muted/20";
      case 2:
        return "border-primary bg-primary/10";
      default:
        return "border-muted/30";
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="glass-card p-6 rounded-xl border-2 border-primary/30">
      <h3 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        LEADERBOARD
      </h3>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No players yet...</p>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.address}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 ${getRankBg(index)} transition-all hover:scale-[1.02] ${
                entry.address.toLowerCase() === currentAddress.toLowerCase()
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <div className="flex-shrink-0">{getRankIcon(index)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">
                  {shortenAddress(entry.address)}
                  {entry.address.toLowerCase() === currentAddress.toLowerCase() && (
                    <span className="ml-2 text-xs text-primary">(YOU)</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{entry.wins} wins</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{entry.balance}</p>
                <p className="text-xs text-muted-foreground">BPT</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
