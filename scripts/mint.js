const web3 = require('web3')
const truffle_config = require("../eth-contracts/truffle-config.js");
const zokratesProof = [
	require("./proof_0.json"),
	require("./proof_1.json"),
	require("./proof_2.json"),
	require("./proof_3.json"),
	require("./proof_4.json"),
	require("./proof_5.json"),
	require("./proof_6.json"),
	require("./proof_7.json"),
	require("./proof_8.json"),
	require("./proof_9.json"),
];

const contract = require('../eth-contracts/build/contracts/SolnSquareVerifier.json');
const OWNER_ADDRESS = "0xAC1bAde854beFc9cC81C13F258a4DEe38c4cf91a";

// use for rinkeby
const CONTRACT_ADDRESS = contract.networks[4].address;
const net_provider = truffle_config.networks.rinkeby;

// use for ganache - localhost
// const CONTRACT_ADDRESS = contract.networks[5777].address;
// const net_provider = truffle_config.networks.development;

const MINT_COUNT = 11

if (!OWNER_ADDRESS || !CONTRACT_ADDRESS) {
	console.error("Please set owner and contract address.")
	return
}

async function main() {
	const web3Instance = new web3(
		net_provider.provider()
	)

	if (CONTRACT_ADDRESS) {

		const ABI = contract.abi;
		const r2token = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" })

		// tokens issued directly to the owner.
		for (let tokenId = 1; tokenId < MINT_COUNT; tokenId++) {
			try {
				console.log("-------------------------------------------");
				console.log("OWNER_ADDRESS: " + OWNER_ADDRESS);
				console.log("tokenId: " + tokenId);

				try {
					const tokenIdOwnerAdress = await r2token.methods.ownerOf(tokenId).call({ from: OWNER_ADDRESS })
					console.log(`TokenID:${tokenId}, owner:${tokenIdOwnerAdress}`)

					const totalSupplyBefore = await r2token.methods.totalSupply().call({ from: OWNER_ADDRESS });
					console.log('totalSupplyBefore: ', totalSupplyBefore);
				} catch (err) {
					console.error(err)
					process.exit()
				}

				// using mintNFT
				if (false) {
					let proofs = Object.values(zokratesProof[i].proof);
					let inputs = zokratesProof[i].inputs;
					console.log("proofs " + JSON.stringify(proofs) + "\n");
					console.log("inputs " + JSON.stringify(inputs) + "\n");
					tx = await r2token.methods.mintNFT(...proofs, inputs, i, OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
				} else {
					tx = await r2token.methods.mint(OWNER_ADDRESS, tokenId).send({ from: OWNER_ADDRESS });
					console.log("Minted item. Transaction: " + tx.transactionHash);
				}


			} catch (e) {
				console.log(e);
			}
		}
	}
}

main()