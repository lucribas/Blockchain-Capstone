var ERC721MintableComplete = artifacts.require("ERC721MintableComplete");
const truffleAssert = require("truffle-assertions");

contract('TestERC721Mintable', accounts => {

	const account_one = accounts[0];
	const account_two = accounts[1];
	const account_three = accounts[2];

	describe('match erc721 spec', function () {
		beforeEach(async function () {
			this.contract = await ERC721MintableComplete.new("Ribas Token", "RTK", { from: account_one });

			// ok: mint multiple tokens
			await this.contract.mint(account_one, 10, { from: account_one });
			await this.contract.mint(account_two, 20, { from: account_one });
			await this.contract.mint(account_three, 30, { from: account_one });
			await this.contract.mint(account_two, 40, { from: account_one });
			await this.contract.mint(account_one, 50, { from: account_one });
			await this.contract.mint(account_one, 60, { from: account_one });
		})

		it('should return total supply', async function () {
			const total = await this.contract.totalSupply.call();
			assert.equal(parseInt(total), 6, "Total supply in not correct");
		})

		it('should get token balance', async function () {
			const balance_one = await this.contract.balanceOf(account_one);
			assert.equal(balance_one, 3, "Balance is not correct");
			const balance_two = await this.contract.balanceOf(account_two);
			assert.equal(balance_two, 2, "Balance is not correct");
			const balance_three = await this.contract.balanceOf(account_three);
			assert.equal(balance_three, 1, "Balance is not correct");
		})

		// token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
		it('should return token uri', async function () {
			assert(
				(await this.contract.tokenURI(20)) ==
				"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/20"
				, "TokenURI is incorrect");
		})

		it('should transfer token from one owner to another', async function () {
			const tokenId = 20;
			const before = await this.contract.ownerOf(tokenId);

			await this.contract.transferFrom(account_two, account_three, tokenId, { from: account_two });
			const after = await this.contract.ownerOf(tokenId);

			assert(before == account_two);
			assert(after == account_three);
			// truffleAssert.eventEmitted(tx, "Transfer");
		});
	});

	describe("have ownership properties", function () {

		it("should fail when minting when address is not contract owner", async () => {
			this.contract = await ERC721MintableComplete.new("Ribas Token", "RTK", { from: account_one });

			try {
				await this.contract.mint(account_two, 1, { from: account_two });
			} catch (error) {
				assert.isAbove(error.message.search("Only contract owner can mint a token"), -1);
			}
		});

		it("should return contract owner", async () => {
			this.contract = await ERC721MintableComplete.new("Ribas Token", "RTK", { from: account_one });
			const owner = await this.contract.getOwner();

			assert(owner == account_one, "Owner is not correct");
		});
	});
});
