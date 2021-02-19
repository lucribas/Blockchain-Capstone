pragma solidity >=0.4.21 <0.6.0;

// ok define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Verifier.sol";
import "./ERC721Mintable.sol";

// ok define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {
    // ok define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address wallet;
    }

    // ok define an array of the above struct
    Solution[] allSolutions;

    // ok define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private solutions;

    // ok Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address wallet);
    event TokenMint(uint256 index, address wallet);

    Verifier VerifierContract;

    constructor(string memory name, string memory symbol)
        public
        ERC721MintableComplete(name, symbol)
    {
        VerifierContract = new Verifier();
    }

    modifier solutionNotExists(uint256 index, address wallet) {
        bytes32 key = keccak256(abi.encodePacked(index, wallet));
        require(solutions[key].wallet == address(0), "Solution already exists");
        _;
    }

    // ok Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 index, address wallet)
        external
        solutionNotExists(index, wallet)
    {
        Solution memory solution = Solution({index: index, wallet: wallet});
        bytes32 key = keccak256(abi.encodePacked(index, wallet));
        solutions[key] = solution;
        allSolutions.push(solution);
        emit SolutionAdded(index, wallet);
    }

    // ok Create a function to mint new NFT only after the solution has been verified
    function mintNFT(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata inputs,
        uint256 index,
        address wallet
    ) external solutionNotExists(index, wallet) {
        //  - make sure the solution is unique (has not been used before)
        require(
            VerifierContract.verifyTx(a, b, c, inputs),
            "Solution is not verified"
        );
        this.addSolution(index, wallet);
        //  - make sure you handle metadata as well as tokenSuplly
        super.mint(wallet, index);
        emit TokenMint(index, wallet);
    }
}
