import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, Zap, Send, Coins, Crosshair } from "lucide-react";

interface BattleActionsProps {
  onWinMatch: () => void;
  onEnergyBoost: () => void;
  onTransfer: (to: string, amount: string) => void;
  onBurn: (amount: string) => void;
  isProcessing: boolean;
}

const BattleActions = ({
  onWinMatch,
  onEnergyBoost,
  onTransfer,
  onBurn,
  isProcessing,
}: BattleActionsProps) => {
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [showMuzzleFlash, setShowMuzzleFlash] = useState(false);

  const handleWinMatch = () => {
    setShowMuzzleFlash(true);
    onWinMatch();
    setTimeout(() => setShowMuzzleFlash(false), 500);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl border-2 border-destructive/30 relative overflow-hidden">
        {showMuzzleFlash && (
          <div className="absolute inset-0 bg-primary/30 animate-pulse pointer-events-none">
            <div className="absolute inset-0 fire-gradient opacity-50" />
          </div>
        )}
        <h3 className="text-xl font-bold mb-4 text-destructive flex items-center gap-2">
          <Flame className="w-6 h-6" />
          BATTLE ZONE
        </h3>
        <Button
          onClick={handleWinMatch}
          disabled={isProcessing}
          size="lg"
          className="w-full fire-gradient hover:opacity-90 font-bold text-xl py-8 shadow-[0_0_30px_rgba(255,107,0,0.6)] hover:shadow-[0_0_50px_rgba(255,107,0,0.9)] transition-all"
        >
          <Crosshair className="mr-3 h-6 w-6" />
          WIN MATCH (+25 BPT)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 rounded-xl border-2 border-accent/30">
          <h3 className="text-lg font-bold mb-4 text-accent flex items-center gap-2">
            <Zap className="w-5 h-5" />
            ENERGY BOOST
          </h3>
          <Button
            onClick={onEnergyBoost}
            disabled={isProcessing}
            className="w-full purple-gradient hover:opacity-90 font-bold"
          >
            BOOST (+50 ENERGY)
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Cost: 10 BPT</p>
        </div>

        <div className="glass-card p-6 rounded-xl border-2 border-primary/30">
          <h3 className="text-lg font-bold mb-4 text-primary flex items-center gap-2">
            <Coins className="w-5 h-5" />
            BURN TOKENS
          </h3>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Amount to burn"
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              className="bg-input border-border"
            />
            <Button
              onClick={() => {
                onBurn(burnAmount);
                setBurnAmount("");
              }}
              disabled={isProcessing || !burnAmount}
              className="w-full bg-destructive hover:bg-destructive/90 font-bold"
            >
              BURN TOKENS
            </Button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl border-2 border-secondary/30">
        <h3 className="text-lg font-bold mb-4 text-secondary flex items-center gap-2">
          <Send className="w-5 h-5" />
          SEND SUPPORT
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Teammate Address (0x...)"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            className="bg-input border-border"
          />
          <Input
            type="number"
            placeholder="Amount (BPT)"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="bg-input border-border"
          />
          <Button
            onClick={() => {
              onTransfer(transferTo, transferAmount);
              setTransferTo("");
              setTransferAmount("");
            }}
            disabled={isProcessing || !transferTo || !transferAmount}
            className="w-full purple-gradient hover:opacity-90 font-bold"
          >
            <Send className="mr-2 h-4 w-4" />
            TRANSFER TOKENS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BattleActions;
