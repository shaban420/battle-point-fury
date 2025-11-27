import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crosshair, TrendingUp, Zap, Shield } from "lucide-react";
import rifleImage from "@/assets/weapon-rifle.png";
import sniperImage from "@/assets/weapon-sniper.png";
import shotgunImage from "@/assets/weapon-shotgun.png";

interface WeaponStats {
  damage: number;
  range: number;
  speed: number;
  armor: number;
}

interface WeaponUpgradeProps {
  weapons: WeaponStats[];
  onUpgrade: (weaponId: number, statId: number) => void;
  isUpgrading: boolean;
}

const WeaponUpgrade = ({ weapons, onUpgrade, isUpgrading }: WeaponUpgradeProps) => {
  const [selectedWeapon, setSelectedWeapon] = useState(0);
  const [animatingWeapon, setAnimatingWeapon] = useState<number | null>(null);

  const weaponImages = [rifleImage, sniperImage, shotgunImage];
  const weaponNames = ["ASSAULT RIFLE", "SNIPER", "SHOTGUN"];

  const statIcons = [
    { icon: Crosshair, name: "DAMAGE", color: "text-destructive" },
    { icon: TrendingUp, name: "RANGE", color: "text-battle-energy" },
    { icon: Zap, name: "SPEED", color: "text-primary" },
    { icon: Shield, name: "ARMOR", color: "text-secondary" },
  ];

  const handleUpgrade = (statId: number) => {
    setAnimatingWeapon(selectedWeapon);
    onUpgrade(selectedWeapon, statId);
    setTimeout(() => setAnimatingWeapon(null), 300);
  };

  const getStatValue = (statId: number) => {
    const weapon = weapons[selectedWeapon];
    if (!weapon) return 0;
    return [weapon.damage, weapon.range, weapon.speed, weapon.armor][statId];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {weaponNames.map((name, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWeapon(idx)}
            className={`glass-card p-4 rounded-xl transition-all ${
              selectedWeapon === idx
                ? "neon-border scale-105"
                : "border-2 border-muted hover:border-primary/50"
            } ${animatingWeapon === idx ? "animate-shake" : ""}`}
          >
            <img
              src={weaponImages[idx]}
              alt={name}
              className={`w-full h-24 object-contain mb-2 ${
                selectedWeapon === idx ? "animate-glow-pulse" : ""
              }`}
            />
            <p className="text-sm font-bold text-center">{name}</p>
          </button>
        ))}
      </div>

      <div className="glass-card p-6 rounded-xl border-2 border-primary/30">
        <h3 className="text-xl font-bold mb-4 text-primary">UPGRADE STATS</h3>
        <div className="grid grid-cols-2 gap-4">
          {statIcons.map((stat, idx) => {
            const StatIcon = stat.icon;
            const value = getStatValue(idx);
            return (
              <div
                key={idx}
                className="glass-card p-4 rounded-lg border border-muted"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatIcon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-sm font-medium">{stat.name}</span>
                  </div>
                  <span className={`text-lg font-bold ${stat.color}`}>{value}</span>
                </div>
                <Button
                  onClick={() => handleUpgrade(idx)}
                  disabled={isUpgrading}
                  size="sm"
                  className="w-full fire-gradient hover:opacity-90 font-bold"
                >
                  UPGRADE (50 BPT)
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeaponUpgrade;
