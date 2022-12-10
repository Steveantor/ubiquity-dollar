import { OptionDefinition } from "command-line-args";

import { DeployFuncParam } from "../../shared";
import { create } from "../create";
import { constants } from "ethers";

export const optionDefinitions: OptionDefinition[] = [
    { name: "task", defaultOption: true },
    { name: "manager", alias: "m", type: String },
    { name: "base3Pool", alias: "p", type: String },
    { name: "depositZap", alias: "d", type: String },
];
// # e.g. yarn workspace @ubiquity/contracts deploy Bonding --manager 0x4DA97a8b831C345dBe6d16FF7432DF2b7b776d98  
//        --base3Pool 0x20955CB69Ae1515962177D164dfC9522feef567E --depositZap --network mainnet
//
const func = async (params: DeployFuncParam) => {
    const contractInstance = "src/dollar/DirectGovernanceFarmer.sol:DirectGovernanceFarmer";
    const { env, args } = params;
    const manager = args.manager;
    const sablier = args.sablier ?? constants.AddressZero;

    const { stderr } = await create({ ...env, name: args.task, network: args.network, contractInstance, constructorArguments: [manager, sablier] });
    return !stderr ? "succeeded" : "failed";
};
export default func;
