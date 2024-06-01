import { Account, RpcProvider } from "starknet";
import * as dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { CallData, json } from "starknet";

dotenv.config();

const contractFrontFolder = "../../src/frontend/src/contracts";

const network = {};

async function main() {
  let nodeUrl = process.env.RPC_URL_SEPOLIA;
  let pk_deployer = process.env.PRIVATE_KEY_WALLET_PROD;
  let addr_deployer = process.env.ADDRESS_WALLET_PROD;

  const args = process.argv[2];
  if (args === "mainnet") {
    network.name = args;
    network.chainId = "0x534e5f4d41494e";
    // Modify if necessary
    // nodeUrl = process.env.RPC_URL_SEPOLIA;
  } else if (args === "sepolia") {
    network.name = args;
    network.chainId = "0x534e5f5345504f4c4941";
  } else if (args === "goerli") {
    network.name = args;
    network.chainId = "0x534e5f474f45524c49";
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
    // {
    //   package_name: "simple_storage",
    //   contract_name: "SimpleStorage2",
    //   args: {
    //     number_1: 1,
    //     number_2: 2,
    //   },
    // },
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

async function declareAndDeployContract(
  provider,
  deployerAccount,
  package_name,
  contract_name,
  args
) {
  /** Declaring contract **/
  const { contractClass, declareResponse } = await declareContract(
    provider,
    deployerAccount,
    package_name,
    contract_name
  );

  /** Deploying contract **/
  const deployResponse = await deployContract(
    provider,
    deployerAccount,
    declareResponse.class_hash,
    contractClass.abi,
    args
  );

  /** Copy contract artifact in front folder **/
  await saveFrontendFiles(contract_name, contractClass.abi, deployResponse);
}

async function declareContract(
  provider,
  deployerAccount,
  package_name,
  contract_name
) {
  /** Read contract class file **/
  const contractClass = json.parse(
    fs
      .readFileSync(
        `${package_name}/target/dev/${package_name}_${contract_name}.contract_class.json`
      )
      .toString("ascii")
  );

  // console.log(contractClass["sierra_program"]);

  /** Read compiled class file **/
  const compiledContract = json.parse(
    fs
      .readFileSync(
        `${package_name}/target/dev/${package_name}_${contract_name}.compiled_contract_class.json`
      )
      .toString("ascii")
  );

  // console.log(compiledContract);

  /** Declare contract **/
  console.log(
    `📝⌛ Declaring contract ${package_name}/${contract_name} in progress...`
  );

  let declareResponse;
  try {
    const resp = await provider.getSpecVersion();
    console.log("     RPC version =", resp);

    const { suggestedMaxFee: estimatedDeclareFee } =
      await deployerAccount.estimateDeclareFee({
        contract: contractClass,
        casm: compiledContract,
      });

    declareResponse = await deployerAccount.declare(
      {
        contract: contractClass,
        casm: compiledContract,
      },
      { maxFee: (estimatedDeclareFee * 11n) / 10n }
    );
    await provider.waitForTransaction(declareResponse.transaction_hash);
  } catch (error) {
    // If error, check if it's not because the contract is already declared
    // trying to get the classhash from the error message
    const regex = /ClassHash\(StarkFelt\(\\"0x[a-fA-F0-9]{64}\\"\)\)/;
    const match = error.message.match(regex);
    if (match) {
      const addressRegex = /0x[0-9a-fA-F]+/;
      const addressMatch = match[0].match(addressRegex);
      console.log("📝✅ ClassHash already declared: ", addressMatch[0]);
      declareResponse = {
        class_hash: addressMatch[0],
      };
    } else {
      console.log(error.message);
      console.log(
        "estimatedDeclareFee =",
        estimatedDeclareFee.toString(),
        "wei"
      );

      throw new Error(`❌ Error when declaring the contract`);
    }
  }

  console.log(`📝✅ Contract ${package_name}/${contract_name} declared`);
  console.log(declareResponse);

  return { contractClass, declareResponse };
}

async function deployContract(provider, deployerAccount, classHash, abi, args) {
  console.log(`🚀⌛ Deploying contract in progress...`);

  /** Estimate fees **/
  const myCallData = new CallData(abi);
  const constructor = myCallData.compile("constructor", args);
  const { suggestedMaxFee: estimatedFee1 } =
    await deployerAccount.estimateDeployFee({
      classHash: classHash,
      constructorCalldata: constructor,
      simulation_flags: 1,
    });
  const deployResponse = await deployerAccount.deployContract(
    {
      classHash: classHash,
      constructorCalldata: constructor,
    },
    { maxFee: (estimatedFee1 * 11n) / 10n }
  );
  await provider.waitForTransaction(deployResponse.transaction_hash);
  console.log(`🚀✅ Contract deployed`);
  console.log(deployResponse);

  return deployResponse;
}

async function saveFrontendFiles(contractName, contractAbi, deployResponse) {
  const chainId = network.chainId;
  const networkName = network.name;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const frontContractsDir = path.join(__dirname, contractFrontFolder);
  const frontContractFilePath = path.join(
    frontContractsDir,
    `${contractName}.json`
  );

  console.log(
    `🖍️ ⌛Write deployed ${contractName} informations in ${frontContractFilePath} in progress...`
  );

  if (!contractAbi) {
    throw new Error(
      `❌ Error when reading the abi in file: ${pathToCompiledContractFile}`
    );
  }

  let previousArtifact = {};
  let currentArtifact = {};
  let abiChanged = false;

  currentArtifact["abi"] = contractAbi;

  try {
    // Read previous deployed artifact
    previousArtifact = JSON.parse(
      fs.readFileSync(frontContractFilePath, "utf8")
    );

    // If the contract changed, we remove all previous network informations
    if (
      JSON.stringify(currentArtifact.abi) !=
      JSON.stringify(previousArtifact.abi)
    ) {
      abiChanged = true;
      console.log(
        "🔄 ABI changed, you need to redeploy the contract on all networks"
      );
    }
  } catch (err) {
    console.error("❌ No previous artifact");
    previousArtifact = currentArtifact;
  }

  // Write deployed contract informations in a file
  if (abiChanged || !previousArtifact.hasOwnProperty("networks")) {
    previousArtifact.networks = {};
  }

  // Create chain ID node in networks section
  if (!previousArtifact.networks.hasOwnProperty(chainId)) {
    previousArtifact.networks[chainId] = {};
  }

  previousArtifact.networks[chainId].network = networkName;
  previousArtifact.networks[chainId].address = deployResponse.contract_address;
  previousArtifact.networks[chainId].transactionHash =
    deployResponse.transaction_hash;
  previousArtifact.networks[chainId].blockNumber = "";

  currentArtifact.networks = previousArtifact.networks;

  fs.writeFileSync(
    frontContractFilePath,
    JSON.stringify(currentArtifact, null, 2)
  );

  console.log(`🖍️ ✅ ${contractName} informations written !`);
}
