# Boilerplate Cairo | Starknet.js | Get-Wallet | Typescript | NextJS | ChakraUI

This project is a template that can serve as a basis for any new decentralized application project wanting to use starknet cairo for the development of smart contracts and Next.js for the user interface.

[https://www.loom.com/share/534a7cc3e14b4c719715bfe44b1c68ee](https://www.loom.com/share/7567ce8bf296495bb95575b4b1210878?sid=1cbb967a-c336-4941-8d32-b52c57ef3a10)

<details>
<summary><h1>Preview</h1></summary>
  
![image](https://github.com/AlexScotte/cairo-boilerplate-react-next/assets/53000621/d75ba214-0c58-4f51-bc20-17df6f933be7)

![image](https://github.com/AlexScotte/cairo-boilerplate-react-next/assets/53000621/d0ba0e8e-dd0c-4e14-b45a-c422428a54f2)

</details>

<details>
<summary><h1>Back-end</h1></summary>

## Description
  The smart contract is just a simple smart contract for storing and reading a digital value. It generates an event when the value is changed.

All commands must be executed in the backend folder (`cd backend`).

## Configuration

First you need to create a .env file in the root folder of the backend. The file must have these properties:
```
ADDRESS_WALLET_Dev_0="0xf39[...]266" // Address use to deploy contract on LOCALHOST (with "0x" prefix)
PRIVATE_KEY_Wallet_DEV_0="0xaa[...]80" // Private key of the address wallet above for deploying contract on LOCALHOST (with "0x" prefix)

ADDRESS_WALLET_PROD="0x0a[...]Ke" // Address use to deploy contract on MAINNET/TESTNET (with "0x" prefix)
PRIVATE_KEY_WALLET_PROD="0x45[...]1a" // Private key of the address wallet above for deploying contract on MAINNET/TESTNET (with "0x" prefix)

RPC_URL_LOCALHOST="http://127.0.0.1:5050" // RPC Local node
RPC_URL_SEPOLIA="https://starknet-sepolia.public.blastapi.io/rpc/v0_7" // Your favorite RPC to deploy on Starknet Testnet SEPOLIA
RPC_URL_MAINNET="https://starknet-mainnet.public.blastapi.io/rpc/v0_7" // Your favorite RPC to deploy on Starknet Mainnet
```

## Deploying onchain
 * To deploy on LOCAL node, simply run your node with the command `make node` (it will execute the command `starknet-devnet --seed 3` to always have the same prefunded 3 accounts) and execute the command `make deploy chain=localhost` to run the script backend/scripts/deploy.js that will declare and deploy your contract.

   The script will use the configured wallet (***_WALLET_DEV_0) in your .env file to deploy the contract onchain.
 * To deploy on SEPOLIA testnet, execute the command `make deploy chain=sepolia` .

   The script will use the configured wallet (***_WALLET_PROD) in your .env file to declare and deploy the contract onchain. (don't forget to have faucet tokens in the wallet). 

<img width="860" alt="image" src="https://github.com/AlexScotte/cairo-boilerplate-react-next/assets/53000621/6b3b0c4f-10b0-4f74-9f19-eb72d6bee779">

After deploying the script will copy the ABI and deployed address of the contract into a folder in the front directory (editable in the script)
This makes it easy to modify and redeploy your contract and test it without importing the ABI.

![image](https://github.com/AlexScotte/cairo-boilerplate-react-next/assets/53000621/18e7873b-ad74-4f3c-a9d6-dfb0304368a5)

If you want to test that your contract is well deployed you can interact with it with the command `make getset chain=sepolia addr=0xad...ds`.
This script will get the stored value, modified the stored value with the configured wallet in your .env file and get again the value.

<img width="899" alt="image" src="https://github.com/AlexScotte/cairo-boilerplate-react-next/assets/53000621/337b38f1-4199-4a3d-a04d-7dea06da169c">

## Testing contract (optional)

Launch the command `snforge test` to build and test the contract. You need to be in the contract folder to do that.

<img width="872" alt="image" src="https://github.com/AlexScotte/boilerplate-starknet-cairo-nextjs/assets/53000621/99e59a02-9c75-4477-964d-9238f9b99919">

</details>

<details>
<summary><h1>Front-end</h1></summary>

## Description
The front is an interface which will allow interaction with the deployed smart contract. It allows the user to connect their wallet using the [get-wallet](https://github.com/starknet-io/get-starknet) librairy and to get and update the contract value on the blockchain.
The front is already deployed and you can interact with it 
[https://boilerplate-foundry-wagmi.vercel.app/](https://boilerplate-starknet-cairo-nextjs.vercel.app/)

All commands must be executed in the frontend folder (`cd frontend`).

## Configuration

If you want to deploy the front in local you must create a .env file in the root folder of the front-end. The file must have these properties:
```
NEXT_PUBLIC_PROVIDER_SEPOLIA_RPC = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7" // Public provider to be able to interact with the contract without connected wallet
NEXT_PUBLIC_PROVIDER_LOCAL_RPC = "http://127.0.0.1:5050" // RPC Local node 
```
## Deploying on localhost

Simply run the command `make run` (or `npm run dev`) to deploy the front-end in local.

</details>
