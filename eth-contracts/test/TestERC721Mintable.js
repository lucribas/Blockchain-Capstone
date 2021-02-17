var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');
const truffleAssert = require("truffle-assertions");

contract('TestERC721Mintable', accounts => {

	const account_one = accounts[0];
	const account_two = accounts[1];
	const account_three = accounts[2];

	describe('match erc721 spec', function () {
		beforeEach(async function () {
			this.contract = await ERC721MintableComplete.new("Ribas Token", "RTK", { from: account_one });

			// TODO: mint multiple tokens
			await this.contract.mint(account_one, 10, { from: account_one });
			await this.contract.mint(account_two, 20, { from: account_one });
			await this.contract.mint(account_three, 30, { from: account_one });
			await this.contract.mint(account_two, 40, { from: account_one });
			await this.contract.mint(account_one, 50, { from: account_one });
			await this.contract.mint(account_one, 60, { from: account_one });
		})

		it('should return total supply', async function () {
			const total = await this.contract.totalSupply.call();
			assert.equal(parseInt(total), 5, "Total supply in not correct");
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
				(await this.contract.tokenURI(2)) ==
				"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2"
				, "TokenURI is incorrect");
		})

		it('should transfer token from one owner to another', async function () {
			const tokenId = 10;
			const before = await this.contract.ownerOf(tokenId);

			await this.contract.transferFrom(account_two, account_three, tokenId, {
				from: account_two
			});
			const after = await this.contract.ownerOf(tokenId);

			assert(before == account_two);
			assert(after == account_three);
			truffleAssert.eventEmitted(tx, "Transfer");
		});
	});

	describe("have ownership properties", function () {
		beforeEach(async function () {
			this.contract = await ERC721MintableComplete.new("Ribas Token", "RTK", { from: account_one });
		});

		it("should fail when minting when address is not contract owner", async () => {
			try {
				await this.contract.mint(account_two, 1, {
					from: account_two
				});
			} catch (error) {
				assert.isAbove(error.message.search("From address is not contract owner"), -1);
			}
		});

		it("should return contract owner", async () => {
			const owner = await this.contract.owner();

			assert(owner == account_one, "Owner is not correct");
		});
	});
});