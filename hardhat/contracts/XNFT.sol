// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

// Deploy this contract on Sepolia

// Importing OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// Importing Chainlink contracts
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract XNFT is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter public tokenIdCounter;

    struct ChainStruct {
        uint64 code;
        string name;
        string color;
    }
    mapping (uint256 => ChainStruct) chain;

    struct FollowerCount {
        string username;
        uint64 follower_count;
    }

    //https://docs.chain.link/ccip/supported-networks/testnet
    constructor() ERC721("Twitter NFT", "XNFT") {
        chain[0] = ChainStruct ({
            code: 10344971235874465080,
            name: "Base Sepolia",
            color: "#0000ff" //red
        });
        chain[1] = ChainStruct ({
            code: 16015286601757825753,
            name: "Sepolia",
            color: "#00ff00" //blue
        });

        // // Mint an NFT
        // mint(msg.sender);
    }

    function pullFollowers(address sender_address, string memory username) public pure returns (uint64) {
        // in the future, require that the username is in the Cartesi databse.
        require(
            keccak256(abi.encodePacked(username)) == 
            keccak256(abi.encodePacked("mattbeton")), 
            "Username must be mattbeton");


        return 18;
    }

    function mint(address to, string memory username) public {
        // Mint from Sepolia network = chain[0]
        mintFrom(to, username, 0);
    }

    function mintFrom(address to, string memory username, uint256 sourceId) public {
        uint64 followers_count = pullFollowers(msg.sender, username);

        string memory _tokenURI = string(abi.encodePacked(username, '\n', Strings.toString(followers_count)));

        uint256 tokenId = tokenIdCounter.current();

        // sourceId 0 Base Sepolia, 1 Sepolia
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        tokenIdCounter.increment();
    }

    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // The following function is an override required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
}