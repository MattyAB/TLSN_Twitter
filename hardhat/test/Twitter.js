const { expect } = require("chai");
const { decode_file } = require('../src/utils/decode');


describe("Twitter Token Test", function () {
    let owner;

    beforeEach(async function () {
        // Retrieve the default account from ethers
        [owner] = await ethers.getSigners();

        // Pull in the Cartesi ABIs.

        

        // A helper to get the contracts instance and deploy it locally
        const Soulbound = await ethers.getContractFactory("TwitterToken");
        soulbound = await Soulbound.deploy();

        // // Mint token ID 1 to owner address
        // await soulbound.safeMint(owner.address);
        
    });

    it("check we can send data to cartesi", async () => {
        auth_proof = decode_file('../tlsn/proof/auth_proof.json');
        user_proof = decode_file('../tlsn/proof/user_proof.json');

        
    });

    it("check the owner is correct", async () => {
        // Check that owner address owns the token ID 0
        const value = await soulbound.ownerOf(1);
        expect(value).to.equal(owner.address);
    });

    it("should revert when trying to transfer via safeTransferFrom", async () => {

        // Note that the approve function call will fail regardless
        const approve = await soulbound.approve("0x000000000000000000000000000000000000dEaD", 1)

        await expect(soulbound['safeTransferFrom(address,address,uint256)'](
            owner.address,
            "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
            1 // token id
        )).to.be.reverted;

    });

    it("should revert when trying to transfer via transferFrom", async () => {

        // Note that the approve function call will fail regardless
        const approve = await soulbound.approve("0x000000000000000000000000000000000000dEaD", 1)

        await expect(soulbound['transferFrom(address,address,uint256)'](
            owner.address,
            "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
            1 // token id
        )).to.be.reverted;
        
    });
});