import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShoppingCart, Package, Swords } from "lucide-react";

interface NFTSkin {
  tokenId: number;
  name: string;
  weaponType: number;
  rarity: number;
  imageURI: string;
  owner: string;
  equipped: boolean;
  forSale?: boolean;
  price?: string;
}

interface NFTSkinsProps {
  userSkins: NFTSkin[];
  marketplaceSkins: NFTSkin[];
  onMintSkin: (weaponType: number, rarity: number, name: string) => void;
  onEquipSkin: (tokenId: number, weaponType: number) => void;
  onUnequipSkin: (weaponType: number) => void;
  onListForSale: (tokenId: number, price: string) => void;
  onCancelListing: (tokenId: number) => void;
  onBuySkin: (tokenId: number) => void;
  isProcessing: boolean;
}

const NFTSkins = ({
  userSkins,
  marketplaceSkins,
  onMintSkin,
  onEquipSkin,
  onUnequipSkin,
  onListForSale,
  onCancelListing,
  onBuySkin,
  isProcessing,
}: NFTSkinsProps) => {
  const [selectedWeaponType, setSelectedWeaponType] = useState(0);
  const [selectedRarity, setSelectedRarity] = useState(0);
  const [skinName, setSkinName] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [selectedSkinForListing, setSelectedSkinForListing] = useState<number | null>(null);

  const weaponTypes = ["ASSAULT RIFLE", "SNIPER", "SHOTGUN"];
  const rarities = [
    { name: "COMMON", color: "text-muted-foreground", bg: "bg-muted/20", border: "border-muted" },
    { name: "RARE", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500" },
    { name: "EPIC", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500" },
    { name: "LEGENDARY", color: "text-battle-energy", bg: "bg-battle-energy/20", border: "border-battle-energy" },
  ];

  const handleMint = () => {
    if (!skinName.trim()) return;
    onMintSkin(selectedWeaponType, selectedRarity, skinName);
    setSkinName("");
  };

  const handleListForSale = () => {
    if (!listingPrice || !selectedSkinForListing) return;
    onListForSale(selectedSkinForListing, listingPrice);
    setListingPrice("");
    setSelectedSkinForListing(null);
  };

  return (
    <div className="glass-card p-6 rounded-xl border-2 border-accent/30">
      <h3 className="text-2xl font-bold mb-6 text-accent flex items-center gap-2">
        <Sparkles className="w-6 h-6" />
        NFT WEAPON SKINS
      </h3>

      <Tabs defaultValue="mint" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="mint" className="gap-2">
            <Sparkles className="w-4 h-4" />
            MINT
          </TabsTrigger>
          <TabsTrigger value="collection" className="gap-2">
            <Package className="w-4 h-4" />
            MY SKINS
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            MARKETPLACE
          </TabsTrigger>
        </TabsList>

        {/* MINT TAB */}
        <TabsContent value="mint" className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">WEAPON TYPE</label>
              <div className="grid grid-cols-3 gap-2">
                {weaponTypes.map((type, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWeaponType(idx)}
                    className={`p-3 rounded-lg font-bold text-sm transition-all ${
                      selectedWeaponType === idx
                        ? "fire-gradient text-background"
                        : "glass-card border border-muted hover:border-primary/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">RARITY</label>
              <div className="grid grid-cols-2 gap-2">
                {rarities.map((rarity, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRarity(idx)}
                    className={`p-4 rounded-lg font-bold text-sm transition-all border-2 ${
                      selectedRarity === idx
                        ? `${rarity.bg} ${rarity.border}`
                        : "glass-card border-muted hover:border-primary/30"
                    }`}
                  >
                    <span className={selectedRarity === idx ? rarity.color : "text-muted-foreground"}>
                      {rarity.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">SKIN NAME</label>
              <Input
                placeholder="Enter skin name..."
                value={skinName}
                onChange={(e) => setSkinName(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <Button
              onClick={handleMint}
              disabled={isProcessing || !skinName.trim()}
              size="lg"
              className="w-full purple-gradient hover:opacity-90 font-bold text-lg py-6"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              MINT NFT SKIN (100 BPT)
            </Button>
          </div>
        </TabsContent>

        {/* MY SKINS TAB */}
        <TabsContent value="collection" className="space-y-4">
          {userSkins.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No skins in your collection yet</p>
              <p className="text-sm text-muted-foreground mt-2">Mint your first NFT skin!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSkins.map((skin) => (
                <div
                  key={skin.tokenId}
                  className={`glass-card p-4 rounded-xl border-2 ${
                    skin.equipped ? "border-primary" : "border-muted"
                  } transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-foreground">{skin.name}</h4>
                      <p className="text-xs text-muted-foreground">{weaponTypes[skin.weaponType]}</p>
                    </div>
                    <Badge className={`${rarities[skin.rarity].color} ${rarities[skin.rarity].bg} border ${rarities[skin.rarity].border}`}>
                      {rarities[skin.rarity].name}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {skin.equipped ? (
                      <Button
                        onClick={() => onUnequipSkin(skin.weaponType)}
                        disabled={isProcessing}
                        size="sm"
                        className="w-full bg-destructive hover:bg-destructive/90"
                      >
                        UNEQUIP
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onEquipSkin(skin.tokenId, skin.weaponType)}
                        disabled={isProcessing}
                        size="sm"
                        className="w-full fire-gradient hover:opacity-90"
                      >
                        <Swords className="mr-2 h-4 w-4" />
                        EQUIP
                      </Button>
                    )}

                    {!skin.forSale && !skin.equipped && (
                      <Button
                        onClick={() => setSelectedSkinForListing(skin.tokenId)}
                        disabled={isProcessing}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        LIST FOR SALE
                      </Button>
                    )}

                    {skin.forSale && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Listed for {skin.price} BPT</div>
                        <Button
                          onClick={() => onCancelListing(skin.tokenId)}
                          disabled={isProcessing}
                          size="sm"
                          variant="ghost"
                          className="w-full"
                        >
                          CANCEL LISTING
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Listing Modal */}
          {selectedSkinForListing && (
            <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-card p-6 rounded-xl border-2 border-primary/30 max-w-md w-full">
                <h4 className="text-xl font-bold mb-4">LIST SKIN FOR SALE</h4>
                <div className="space-y-4">
                  <Input
                    type="number"
                    placeholder="Price in BPT"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    className="bg-input border-border"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleListForSale}
                      disabled={isProcessing || !listingPrice}
                      className="flex-1 purple-gradient hover:opacity-90"
                    >
                      LIST
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedSkinForListing(null);
                        setListingPrice("");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      CANCEL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* MARKETPLACE TAB */}
        <TabsContent value="marketplace" className="space-y-4">
          {marketplaceSkins.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No skins listed for sale</p>
              <p className="text-sm text-muted-foreground mt-2">Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketplaceSkins.map((skin) => (
                <div
                  key={skin.tokenId}
                  className="glass-card p-4 rounded-xl border-2 border-accent/30 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-foreground">{skin.name}</h4>
                      <p className="text-xs text-muted-foreground">{weaponTypes[skin.weaponType]}</p>
                    </div>
                    <Badge className={`${rarities[skin.rarity].color} ${rarities[skin.rarity].bg} border ${rarities[skin.rarity].border}`}>
                      {rarities[skin.rarity].name}
                    </Badge>
                  </div>

                  <div className="mb-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="text-2xl font-bold text-primary">{skin.price} BPT</div>
                  </div>

                  <Button
                    onClick={() => onBuySkin(skin.tokenId)}
                    disabled={isProcessing}
                    size="sm"
                    className="w-full fire-gradient hover:opacity-90 font-bold"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    BUY NOW
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFTSkins;
