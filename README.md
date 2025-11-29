# BattlePoint — Arena Fury 🎮⚔️

A Web3 gaming DApp where players earn BattlePoint Tokens (BPT) through intense battle arena gameplay. Built with React, TypeScript, and Solidity smart contracts.

![Battle Arena](src/assets/battle-background.jpg)

## 🚀 Live Demo

Deploy your own instance to see it live!

## 📋 Smart Contract Details

### BattlePoint Token (BPT)

- **Contract Address**: `0x488FC849743FD0d3f203cec1a133DCccFBb0FDB1`
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111 (0xaa36a7)
- **Token Standard**: ERC-20
- **Decimals**: 18
- **Symbol**: BPT

### Contract Features

- ✅ **Win-to-Earn**: Mint BPT tokens for winning battles
- ✅ **Weapon Upgrades**: Burn tokens to upgrade weapon stats (damage, accuracy, fire rate)
- ✅ **Energy Boost**: Burn tokens to refill energy
- ✅ **Token Staking**: Stake BPT tokens to earn passive rewards
- ✅ **Token Transfers**: Send tokens to teammates
- ✅ **Gas Optimized**: Packed structs and efficient storage patterns

### View on Etherscan

[View Contract on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x488FC849743FD0d3f203cec1a133DCccFBb0FDB1)

## 🎯 Key Features

### Gameplay Systems
- **Battle Rewards**: Win matches to earn BPT tokens instantly
- **Weapon Arsenal**: Three weapon types (Rifle, Shotgun, Sniper) with unique stats
- **Upgrade System**: Improve weapon damage, accuracy, and fire rate
- **Energy Management**: Spend energy on battles, refill with tokens
- **Staking Module**: Stake tokens for passive income

### Web3 Integration
- **MetaMask Connection**: Seamless wallet integration with Sepolia testnet
- **Real Blockchain Transactions**: All actions trigger real on-chain transactions
- **Player Dashboard**: View BPT balance, wins, energy, and weapon levels
- **Activity Log**: Track all your blockchain transactions
- **Leaderboard**: Compare stats with other players

### Battle Arena Theme
- Animated gun muzzle flashes and shooting sparks
- Glowing fire-like gradients (orange/red/purple)
- Moving battlefield background with smoke particles
- Neon borders and glowing upgrade buttons
- Floating stat cards with animations

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

### Blockchain
- **Solidity** - Smart contract language
- **ethers.js v5** - Web3 library
- **MetaMask** - Wallet provider
- **Sepolia Testnet** - Development network

## 📦 Installation & Setup

### Prerequisites

- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- MetaMask browser extension ([download here](https://metamask.io/download/))
- Sepolia testnet ETH ([get from faucet](https://sepoliafaucet.com/))

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### MetaMask Setup

1. Install MetaMask extension
2. Switch to **Sepolia Test Network**
3. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
4. Connect your wallet to the DApp

## 🎮 How to Play

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Win Battles**: Click "Win Match" to earn BPT tokens and energy
3. **Upgrade Weapons**: Use tokens to improve your weapon stats
4. **Boost Energy**: Refill your energy by burning tokens
5. **Stake Tokens**: Earn passive rewards by staking BPT
6. **Send Tokens**: Transfer tokens to other players

## 📄 Smart Contract Source

The BattlePoint Token contract is located at `contracts/BattlePointToken.sol`

### Main Functions

```solidity
// Mint tokens for winning
function mintForWin(address player) external onlyOwner

// Upgrade weapon stats
function upgradeWeapon(uint8 weaponId, uint8 statId) external

// Boost energy
function energyBoost() external

// Staking functions
function stake(uint256 amount) external
function unstake(uint256 amount) external
function claimRewards() public

// View functions
function getPlayerStats(address player) external view
function getWeaponStats(address player, uint8 weaponId) external view
```

## 🔧 Project Structure

```
├── contracts/
│   └── BattlePointToken.sol      # Smart contract
├── src/
│   ├── assets/                   # Images and icons
│   ├── components/
│   │   ├── WalletConnect.tsx     # MetaMask connection
│   │   ├── PlayerDashboard.tsx   # Stats display
│   │   ├── BattleActions.tsx     # Win/Energy/Transfer
│   │   ├── WeaponUpgrade.tsx     # Upgrade system
│   │   ├── StakingModule.tsx     # Staking interface
│   │   ├── Leaderboard.tsx       # Player rankings
│   │   └── ActivityLog.tsx       # Transaction history
│   ├── lib/
│   │   ├── blockchain.ts         # Web3 utilities
│   │   └── contractInfo.ts       # Contract ABI & address
│   └── pages/
│       └── Index.tsx             # Main game page
├── README.md
└── package.json
```

## 🚀 Deployment

### Frontend Deployment

Build and deploy the frontend using standard React deployment methods (Vercel, Netlify, GitHub Pages, etc.).

### Smart Contract Deployment

The contract is already deployed on Sepolia. To redeploy:

1. Use Remix IDE or Hardhat
2. Compile `contracts/BattlePointToken.sol`
3. Deploy to Sepolia testnet
4. Update `BPT_ADDRESS` in `src/lib/contractInfo.ts`

## 🔗 Links

- **Contract Address**: `0x488FC849743FD0d3f203cec1a133DCccFBb0FDB1`
- **Sepolia Etherscan**: https://sepolia.etherscan.io/address/0x488FC849743FD0d3f203cec1a133DCccFBb0FDB1
- **MetaMask**: https://metamask.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This is a testnet application for educational purposes. Do not use real funds or deploy to mainnet without proper auditing.

---

Built with ❤️ using React, TypeScript, and Solidity
