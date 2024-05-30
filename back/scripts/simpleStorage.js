import { Account, RpcProvider, Contract, uint256 } from "starknet";
// import { declareAndDeployContract } from "./deployerHelper";
import * as dotenv from "dotenv";
import fs from "fs";
import { CallData, json } from "starknet";

dotenv.config();
const network = {};

async function main() {
  try {
    let nodeUrl = process.env.RPC_URL_SEPOLIA;
    let pk_deployer = process.env.PRIVATE_KEY_WALLET_PROD;
    let addr_deployer = process.env.ADDRESS_WALLET_PROD;

    const chain = process.argv[2];
    const contractAddress = process.argv[3];
    console.log(process.argv);
    if (chain === "mainnet") {
      network.name = chain;
      network.chainId = 0x534e5f4d41494e;
      // Modify if necessary
      // nodeUrl = process.env.RPC_URL_SEPOLIA;
    } else if (chain === "sepolia") {
      network.name = chain;
      network.chainId = 0x534e5f5345504f4c4941;
    } else if (chain === "goerli") {
      network.name = chain;
      network.chainId = 0x534e5f474f45524c49;
      // Modify if necessary
      // nodeUrl = process.env.RPC_URL_SEPOLIA;
    } else {
      network.name = "localhost";
      network.chainId = 0x0;
      nodeUrl = process.env.RPC_URL_LOCALHOST;
      pk_deployer = process.env.PRIVATE_KEY_WALLET_DEV_0;
      addr_deployer = process.env.ADDRESS_WALLET_DEV_0;
    }

    console.log(`💻⌛ Connection to provider ${nodeUrl}...`);
    const provider = new RpcProvider({ nodeUrl: nodeUrl });
    console.log(`💻✅ Provider connected to ${nodeUrl}`);

    console.log(`🤖⌛ Connection to account ${addr_deployer}...`);
    const account = new Account(provider, addr_deployer, pk_deployer, "1");
    console.log(`🤖✅ Account connected: ${addr_deployer}`);

    /** Read contract class file **/
    const contractClass = json.parse(
      fs
        .readFileSync(
          `simple_storage/target/dev/simple_storage_SimpleStorage.contract_class.json`
        )
        .toString("ascii")
    );

    const contract = new Contract(contractClass.abi, contractAddress, provider);
    contract.connect(account);

    await get(contract);
    await set(contract, account, 1233);
    await get(contract);
  } catch (error) {
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function get(contract) {
  try {
    // GET VALUE
    console.log(`🔍⌛ Get stored value in progress...`);
    const res = await contract.get();
    console.log(`🔍✅ Stored value: ${res}`);
  } catch (error) {
    console.log(`🔍❌ Get stored value failed !`);
    console.error(error);
  }
}

async function set(contract, account, newValue) {
  try {
    console.log(`📝⌛ Set new stored value to ${newValue} in progress...`);
    // SET VALUE
    const myCall = await contract?.populate("set", [newValue]);
    const res = await account?.execute(myCall, undefined, { version: 3 });
    console.log(`📝✅ Set stored value completed !`);
    console.log(res);
  } catch (error) {
    console.log(`📝❌ Set stored value failed !`);
    console.error(error);
  }
}
