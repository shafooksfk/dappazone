const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Dappazon", () => {
  it("check name", async () => {
    const Dappazon = await ethers.getContractFactory("Dappazon");
    const dappazon = await Dappazon.deploy();
    const name = await dappazon.name();
    expect(name).to.be.equal("Dappazon");
  });
});
