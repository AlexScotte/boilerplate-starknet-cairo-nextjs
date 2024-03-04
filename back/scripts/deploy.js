import { Account, RpcProvider } from "starknet";
import { declareAndDeployContract } from "./deployerHelper";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const nodeUrl = process.env.LOCAL_RPC;
  console.log(`💻⌛ Connection to provider ${nodeUrl}...`);
  const provider = new RpcProvider({ nodeUrl: nodeUrl });
  console.log(`💻✅ Provider connected to ${nodeUrl}`);

  const pk_deployer = process.env.PK_ACCOUNT_DEV_0;
  const addr_deployer = process.env.ACCOUNT_DEV_0;
  console.log(`🤖⌛ Connection to account ${addr_deployer}...`);
  const deployerAccount = new Account(provider, addr_deployer, pk_deployer);
  console.log(`🤖✅ Account connected: ${addr_deployer}`);

  const contractsToDeploy = [
    /** Contract 1: simple_storage/SimpleStorage with no args **/
    {
      package_name: "simple_storage",
      contract_name: "SimpleStorage",
      args: {},
    },
    /** Contract 2: simple_storage/SimpleStorage2 args **/
    {
      package_name: "simple_storage",
      contract_name: "SimpleStorage2",
      args: {
        number_1: 1,
        number_2: 2,
      },
    },
  ];

  for (const contract of contractsToDeploy) {
    await declareAndDeployContract(
      provider,
      deployerAccount,
      contract.package_name,
      contract.contract_name,
      contract.args
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
