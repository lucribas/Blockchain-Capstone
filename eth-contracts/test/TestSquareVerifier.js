// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var Verifier = artifacts.require('Verifier');
const Proof = require("../../zokrates/code/square/proof.json");

contract('TestSquareVerifier', accounts => {
	const owner = accounts[0];

	beforeEach(async () => {
	});

	// Test verification with correct proof
	// - use the contents from proof.json generated from zokrates steps
	it("Should successfully verify correct proof", async () => {
		this.contract = await Verifier.new({ from: owner });
		let proofVerified = await this.contract.verifyTx.call(...Object.values(Proof.proof), Proof.inputs);

		assert.equal(proofVerified, true, "Proof could not be verified");
	});

	// Test verification with incorrect proof
	it("Should not verify incorrect proof", async () => {
		let proofVerified = await this.contract.verifyTx.call(...Object.values(Proof.proof), [16, 77]);

		assert.equal(proofVerified, false);
	});
});