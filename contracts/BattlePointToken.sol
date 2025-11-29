// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BattlePointToken is ERC20, Ownable {
    uint256 public constant WIN_REWARD = 25 * 10**18;
    uint256 public constant ENERGY_COST = 10 * 10**18;
    uint256 public constant UPGRADE_COST = 50 * 10**18;
    uint256 public constant REWARD_RATE = 10; // 10% APY per day for simplicity
    uint256 private constant SECONDS_PER_DAY = 86400;
    
    struct PlayerStats {
        uint128 stakedAmount; // Packed with stakeTimestamp
        uint64 stakeTimestamp;
        uint64 lastRewardClaim;
        uint32 wins;
        uint32 energy;
    }
    
    struct WeaponStats {
        uint8 damage;
        uint8 range;
        uint8 speed;
        uint8 armor;
    }
    
    mapping(address => PlayerStats) public playerStats;
    mapping(address => mapping(uint8 => WeaponStats)) public weaponStats;
    
    event WinReward(address indexed player, uint256 amount);
    event TokensBurned(address indexed player, uint256 amount);
    event WeaponUpgraded(address indexed player, uint8 weaponId, uint8 statId, uint8 newValue);
    event EnergyBoosted(address indexed player, uint256 newEnergy);
    event Staked(address indexed player, uint256 amount);
    event Unstaked(address indexed player, uint256 amount);
    event RewardsClaimed(address indexed player, uint256 amount);
    
    constructor() ERC20("BattlePoint Token", "BPT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function mintForWin(address player) external {
        require(player != address(0), "Invalid address");
        
        _mint(player, WIN_REWARD);
        
        PlayerStats storage stats = playerStats[player];
        unchecked {
            stats.wins += 1;
            stats.energy += 10;
        }
        
        emit WinReward(player, WIN_REWARD);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    function upgradeWeapon(uint8 weaponId, uint8 statId) external {
        require(weaponId < 3, "Invalid weapon ID");
        require(statId < 4, "Invalid stat ID");
        
        _burn(msg.sender, UPGRADE_COST);
        
        WeaponStats storage weapon = weaponStats[msg.sender][weaponId];
        uint8 newValue;
        
        unchecked {
            if (statId == 0) {
                weapon.damage += 5;
                newValue = weapon.damage;
            } else if (statId == 1) {
                weapon.range += 5;
                newValue = weapon.range;
            } else if (statId == 2) {
                weapon.speed += 5;
                newValue = weapon.speed;
            } else {
                weapon.armor += 5;
                newValue = weapon.armor;
            }
        }
        
        emit WeaponUpgraded(msg.sender, weaponId, statId, newValue);
    }
    
    function energyBoost() external {
        _burn(msg.sender, ENERGY_COST);
        
        PlayerStats storage stats = playerStats[msg.sender];
        unchecked {
            stats.energy += 50;
        }
        
        emit EnergyBoosted(msg.sender, stats.energy);
    }
    
    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        PlayerStats storage stats = playerStats[msg.sender];
        
        if (stats.stakedAmount > 0) {
            _claimRewards(stats);
        }
        
        _transfer(msg.sender, address(this), amount);
        
        unchecked {
            stats.stakedAmount += uint128(amount);
        }
        stats.stakeTimestamp = uint64(block.timestamp);
        stats.lastRewardClaim = uint64(block.timestamp);
        
        emit Staked(msg.sender, amount);
    }
    
    function claimRewards() external {
        PlayerStats storage stats = playerStats[msg.sender];
        _claimRewards(stats);
    }
    
    function _claimRewards(PlayerStats storage stats) internal {
        require(stats.stakedAmount > 0, "No staked amount");
        
        uint256 timeStaked;
        unchecked {
            timeStaked = block.timestamp - stats.lastRewardClaim;
        }
        
        uint256 rewards = (uint256(stats.stakedAmount) * REWARD_RATE * timeStaked) / (100 * SECONDS_PER_DAY);
        
        if (rewards > 0) {
            _mint(msg.sender, rewards);
            stats.lastRewardClaim = uint64(block.timestamp);
            emit RewardsClaimed(msg.sender, rewards);
        }
    }
    
    function unstake(uint256 amount) external {
        PlayerStats storage stats = playerStats[msg.sender];
        require(stats.stakedAmount >= amount, "Insufficient staked amount");
        
        _claimRewards(stats);
        
        unchecked {
            stats.stakedAmount -= uint128(amount);
        }
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    function getPlayerStats(address player) external view returns (
        uint256 wins,
        uint256 energy,
        uint256 stakedAmount,
        uint256 pendingRewards
    ) {
        PlayerStats memory stats = playerStats[player];
        
        uint256 timeStaked;
        unchecked {
            timeStaked = block.timestamp - stats.lastRewardClaim;
        }
        
        uint256 rewards = (uint256(stats.stakedAmount) * REWARD_RATE * timeStaked) / (100 * SECONDS_PER_DAY);
        
        return (
            stats.wins,
            stats.energy,
            stats.stakedAmount,
            rewards
        );
    }
    
    function getWeaponStats(address player, uint8 weaponId) external view returns (
        uint8 damage,
        uint8 range,
        uint8 speed,
        uint8 armor
    ) {
        WeaponStats memory weapon = weaponStats[player][weaponId];
        return (weapon.damage, weapon.range, weapon.speed, weapon.armor);
    }
}
