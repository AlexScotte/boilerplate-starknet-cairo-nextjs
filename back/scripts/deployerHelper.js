import fs from "fs";
import { CallData, json } from "starknet";
dotenv.config();

const declareAndDeployContract = async function declareAndDeployContract(
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
};

const declareContract = async function declareContract(
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
  const declareResponse = await deployerAccount.declare({
    contract: contractClass,
    casm: compiledContract,
  });
  await provider.waitForTransaction(declareResponse.transaction_hash);

  console.log(`📝✅ Contract ${package_name}/${contract_name} declared`);
  console.log(declareResponse);

  return { contractClass, declareResponse };
};

const deployContract = async function deployContract(
  provider,
  deployerAccount,
  classHash,
  abi,
  args
) {
  console.log(`🚀⌛ Deploying contract in progress...`);

  /** Estimate fees **/
  const myCallData = new CallData(abi);
  const constructor = myCallData.compile("constructor", args);
  const { suggestedMaxFee: estimatedFee1 } =
    await deployerAccount.estimateDeployFee({
      classHash: classHash,
      constructorCalldata: constructor,
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
};

export { declareAndDeployContract, declareContract, deployContract };
