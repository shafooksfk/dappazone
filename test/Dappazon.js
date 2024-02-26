const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  Contract,
} = require("hardhat/internal/hardhat-network/stack-traces/model");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer;
  beforeEach(async () => {
    // Setup Contract
    [deployer, buyer] = await ethers.getSigners();

    // deploy Contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  describe("Deployment", async () => {
    it("Sets the owner", async () => {
      expect(deployer.address).to.be.equal(await dappazon.owner());
    });
  });

  describe("Listing", async () => {
    let transaction;
    const ID=1
    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, "Shoes", "Clothing", "IMAGE", 1, 4, 10);
      await transaction.wait();
    });
    it("Return item attributes" , async ()=>{
      const item = await dappazon.items(ID);
      expect(item.id).to.be.equal(ID);
    })
  });
});
