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
  beforeEach(async () => {
    // deploy Contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  describe("Deployment", async () => {
    it("has a name", async () => {
      const name = await dappazon.name();
      expect(name).to.be.equal("Dappazon");
    });
  });
});
