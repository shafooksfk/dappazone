import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Dappazon from "./abis/Dappazon.json";

// Config
import config from "./config.json";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);

  const [clothing, setClothing] = useState(null);
  const [electronics, setElectronics] = useState(null);
  const [toys, setToys] = useState(null);

  const loadBlockChainData = async () => {
    // connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();

    // connect to smart contract
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon.address,
      Dappazon,
      provider
    );
    setDappazon(dappazon);
    const items = [];
    for (var i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1);
      items.push(item);
    }
    console.log(items);

    const clothing = items.filter((item) => item.category === "clothing");
    const electronics = items.filter((item) => item.category === "electronics");
    const toys = items.filter((item) => item.category === "toys");

    setClothing(clothing);
    setElectronics(electronics);
    setToys(toys);

    console.log(clothing, "\n", electronics, "\n", toys);
    // load data
  };

  const handlePop = () => {};
  useEffect(() => {
    loadBlockChainData();
  }, []);
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dappazon Best Sellers</h2>
      {clothing && electronics && toys && (
        <>
          <Section
            title={"Clothing & Jewellery"}
            items={clothing}
            togglePop={handlePop}
          ></Section>
          <Section
            title={"Electronics"}
            items={electronics}
            togglePop={handlePop}
          ></Section>
          <Section title={"Toys"} items={toys} togglePop={handlePop}></Section>
        </>
      )}
    </div>
  );
}

export default App;
