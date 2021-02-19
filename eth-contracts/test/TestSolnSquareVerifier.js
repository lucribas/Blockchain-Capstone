const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const truffleAssert = require("truffle-assertions");

contract("SolnSquareVerifier", accounts => {
	const owner = accounts[0];
	beforeEach(async function () {
		this.contract = await SolnSquareVerifier.new("Ribas Token", "RTK", { from: owner });
	});

	// Test if a new solution can be added for contract - SolnSquareVerifier
	it("Should add a new solution can be added", async function () {
		const tx = await this.contract.addSolution(1, accounts[1]);

		await truffleAssert.eventEmitted(tx, "SolutionAdded");
	});

	it("Should revert a solution that exists", async function () {
		let reverted = false;
		const tx = await this.contract.addSolution(1, accounts[1]);
		await truffleAssert.eventEmitted(tx, "SolutionAdded");
		try {
			tx = await this.contract.addSolution(1, accounts[1]);
		} catch (e) {
			reverted = true;
		}

		assert(reverted, false, "Existing solution added again");
	});
	// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
	it("Should add a new ERC721 token can be added", async function () {
		const { proof, inputs } = require("../../zokrates/code/square/proof.json");
		const tx = await this.contract.mintNFT(proof.a, proof.b, proof.c, inputs, 1, accounts[1]);
		await truffleAssert.eventEmitted(tx, "SolutionAdded");
		await truffleAssert.eventEmitted(tx, "TokenMint");
	});
});
