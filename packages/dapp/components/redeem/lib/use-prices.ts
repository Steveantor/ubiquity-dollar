import useDeployedContracts from "@/components/lib/hooks/contracts/use-deployed-contracts";
import useManagerManaged from "@/components/lib/hooks/contracts/use-manager-managed";
import { BigNumber, utils } from "ethers";
import { useEffect, useState } from "react";

const usePrices = (): [BigNumber | null, BigNumber | null, () => Promise<void>] => {
  const deployedContracts = useDeployedContracts();
  const managedContracts = useManagerManaged();

  const [twapPrice, setTwapPrice] = useState<BigNumber | null>(null);
  const [spotPrice, setSpotPrice] = useState<BigNumber | null>(null);

  async function refreshPrices() {
    if (managedContracts && deployedContracts) {
      const dollarTokenAddress = await deployedContracts.manager.dollarTokenAddress();
      const newTwapPrice = await managedContracts.dollarTwapOracle.consult(dollarTokenAddress);
      const newSpotPrice = await managedContracts.dollarMetapool["get_dy(int128,int128,uint256)"](0, 1, utils.parseEther("1"));
      setTwapPrice(newTwapPrice);
      setSpotPrice(newSpotPrice);
    }
  }

  useEffect(() => {
    refreshPrices();
  }, [managedContracts, deployedContracts]);

  return [twapPrice, spotPrice, refreshPrices];
};

export default usePrices;
