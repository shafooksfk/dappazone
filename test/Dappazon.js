const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  Contract,
} = require("hardhat/internal/hardhat-network/stack-traces/model");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

// Global variables for testing purpose
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 10;

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
    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    });

    it("Return item attributes", async () => {
      const item = await dappazon.items(ID);
      expect(item.id).to.be.equal(ID);
      expect(item.name).to.be.equal(NAME);
      expect(item.category).to.be.equal(CATEGORY);
      expect(item.image).to.be.equal(IMAGE);
      expect(item.cost).to.be.equal(COST);
      expect(item.rating).to.be.equal(RATING);
      expect(item.stock).to.be.equal(STOCK);
    });

    it("Emits list event", async () => {
      expect(transaction).to.emit(dappazon, "List");
    });
  });

  describe("Buying", async () => {
    let transaction;
    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();
    });

    it("Updates buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address);
      expect(result).to.be.equal(1);
    });

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1);
      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.be.equal(NAME);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.be.equal(COST);
    });

    it("Emits buy event", async () => {
      expect(transaction).to.emit(dappazon, "Buy");
    });
  });

  describe("Withdrawing", async () => {
    let transaction;
    let balanceBefore;
    beforeEach(async () => {
      // Listing Item
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buying item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();

      // Checking balance before withdrawing
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      // // withdraw
      transaction = await dappazon.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const balance = await ethers.provider.getBalance(dappazon.address);
      expect(balance).to.be.equal(0);
    });
  });
});
