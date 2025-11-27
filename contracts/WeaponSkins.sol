// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WeaponSkins is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    uint256 public constant MINT_COST = 100 * 10**18; // 100 BPT
    
    struct SkinMetadata {
        string name;
        uint8 weaponType; // 0: Rifle, 1: Sniper, 2: Shotgun
        uint8 rarity; // 0: Common, 1: Rare, 2: Epic, 3: Legendary
        string imageURI;
        uint256 mintedAt;
    }
    
    struct TradeOffer {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }
    
    mapping(uint256 => SkinMetadata) public skins;
    mapping(address => mapping(uint8 => uint256)) public equippedSkins; // user => weaponType => tokenId
    mapping(uint256 => TradeOffer) public tradeOffers;
    
    address public bptTokenAddress;
    
    event SkinMinted(address indexed owner, uint256 tokenId, uint8 weaponType, uint8 rarity);
    event SkinEquipped(address indexed owner, uint8 weaponType, uint256 tokenId);
    event TradeOfferCreated(uint256 indexed tokenId, address indexed seller, uint256 price);
    event TradeOfferCancelled(uint256 indexed tokenId);
    event SkinTraded(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);
    
    constructor(address _bptTokenAddress) ERC721("BattlePoint Weapon Skins", "BPWS") Ownable(msg.sender) {
        bptTokenAddress = _bptTokenAddress;
    }
    
    function mintSkin(uint8 weaponType, uint8 rarity, string memory skinName, string memory imageURI) external returns (uint256) {
        require(weaponType < 3, "Invalid weapon type");
        require(rarity < 4, "Invalid rarity");
        
        // In production, charge MINT_COST BPT tokens
        // IERC20(bptTokenAddress).transferFrom(msg.sender, address(this), MINT_COST);
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, imageURI);
        
        skins[newTokenId] = SkinMetadata({
            name: skinName,
            weaponType: weaponType,
            rarity: rarity,
            imageURI: imageURI,
            mintedAt: block.timestamp
        });
        
        emit SkinMinted(msg.sender, newTokenId, weaponType, rarity);
        return newTokenId;
    }
    
    function equipSkin(uint8 weaponType, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(skins[tokenId].weaponType == weaponType, "Wrong weapon type");
        
        equippedSkins[msg.sender][weaponType] = tokenId;
        emit SkinEquipped(msg.sender, weaponType, tokenId);
    }
    
    function unequipSkin(uint8 weaponType) external {
        equippedSkins[msg.sender][weaponType] = 0;
        emit SkinEquipped(msg.sender, weaponType, 0);
    }
    
    function createTradeOffer(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(!tradeOffers[tokenId].isActive, "Trade offer already exists");
        
        tradeOffers[tokenId] = TradeOffer({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });
        
        emit TradeOfferCreated(tokenId, msg.sender, price);
    }
    
    function cancelTradeOffer(uint256 tokenId) external {
        require(tradeOffers[tokenId].seller == msg.sender, "Not the seller");
        require(tradeOffers[tokenId].isActive, "Trade offer not active");
        
        tradeOffers[tokenId].isActive = false;
        emit TradeOfferCancelled(tokenId);
    }
    
    function acceptTradeOffer(uint256 tokenId) external {
        TradeOffer memory offer = tradeOffers[tokenId];
        require(offer.isActive, "Trade offer not active");
        require(ownerOf(tokenId) == offer.seller, "Seller no longer owns the skin");
        
        // In production, transfer BPT tokens
        // IERC20(bptTokenAddress).transferFrom(msg.sender, offer.seller, offer.price);
        
        tradeOffers[tokenId].isActive = false;
        
        // Unequip skin if equipped
        if (equippedSkins[offer.seller][skins[tokenId].weaponType] == tokenId) {
            equippedSkins[offer.seller][skins[tokenId].weaponType] = 0;
        }
        
        _transfer(offer.seller, msg.sender, tokenId);
        
        emit SkinTraded(tokenId, offer.seller, msg.sender, offer.price);
    }
    
    function getUserSkins(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory userTokenIds = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (_exists(i) && ownerOf(i) == user) {
                userTokenIds[index] = i;
                index++;
            }
        }
        
        return userTokenIds;
    }
    
    function getSkinMetadata(uint256 tokenId) external view returns (
        string memory name,
        uint8 weaponType,
        uint8 rarity,
        string memory imageURI,
        uint256 mintedAt
    ) {
        require(_exists(tokenId), "Skin does not exist");
        SkinMetadata memory skin = skins[tokenId];
        return (skin.name, skin.weaponType, skin.rarity, skin.imageURI, skin.mintedAt);
    }
    
    function getEquippedSkin(address user, uint8 weaponType) external view returns (uint256) {
        return equippedSkins[user][weaponType];
    }
    
    function getActiveTradeOffers() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (tradeOffers[i].isActive) {
                activeCount++;
            }
        }
        
        uint256[] memory activeOffers = new uint256[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (tradeOffers[i].isActive) {
                activeOffers[index] = i;
                index++;
            }
        }
        
        return activeOffers;
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
