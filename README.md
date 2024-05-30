# Boilerplate Caïro | Starknet.js | Get-Wallet | Typescript | NextJS | ChakraUI

This project is a template that can serve as a basis for any new decentralized application project wanting to use starknet caïro for the development of smart contracts and Next.js for the user interface.

https://www.loom.com/share/534a7cc3e14b4c719715bfe44b1c68ee

<details>
<summary><h1>Preview</h1></summary>
  
![image](https://github.com/AlexScotte/boilerplate-foundry-nextjs-wagmi-rainbowkit/assets/53000621/621725c0-61f9-4ad4-925a-cf7ad0366116)

![image](https://github.com/AlexScotte/boilerplate-foundry-nextjs-wagmi-rainbowkit/assets/53000621/95f4d358-c908-4624-bc84-3d236d8cff18)

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
RPC_URL_SEPOLIA="https://eth-sepolia.g.alchemy.com/v2/Jk[...]ds" // Your favorite RPC to deploy on Starknet Testnet SEPOLIA
```

## Deploying onchain
 * To deploy on LOCAL node, simply run your node with the command `make node` (it will execute the command `starknet-devnet --seed 3` to always have the same prefunded 3 accounts) and execute the command `make deploy chain=localhost` to run the backend/scripts/deploy.js script.

   The script will use the configured wallet (***_WALLET_DEV_0) in your .env file to deploy the contract onchain.
 * To deploy on SEPOLIA testnet, execute the command `make deploy chain=sepolia` .

   The script will use the configured wallet (***_WALLET_PROD) in your .env file to deploy the contract onchain. (don't forget to have faucet tokens in the wallet). 

<img width="1565" alt="1" src="https://github.com/AlexScotte/boilerplate-foundry-nextjs-wagmi-rainbowkit/assets/53000621/5c456e95-2341-41e8-ad6c-cee2fbed040c">
<img width="935" alt="2" src="https://github.com/AlexScotte/boilerplate-foundry-nextjs-wagmi-rainbowkit/assets/53000621/3f2f3175-cb0e-494a-9953-5c2c46c1dfff">


After deploying the script will copy the ABI and deployed address of the contract into a folder in the front directory (editable in the script)
This makes it easy to modify and redeploy your contract and test it without importing the ABI.

![image](https://github.com/AlexScotte/boilerplate-foundry-nextjs-wagmi-rainbowkit/assets/53000621/90463006-3641-47ff-9234-f811c0039dac)



## Testing contract (optional)

Launch the coverage command `make coverage` (or `forge coverage`) to build and test the contract.

![image](https://github.com/AlexScotte/boilerplate-foundry-nextjs-wagmi-rainbowkit/assets/53000621/a3f4075a-6c35-408c-be5d-cf6e14c74d48)

</details>

<details>
<summary><h1>Front-end</h1></summary>

## Description
The front is an interface which will allow interaction with the deployed smart contract. It allows the user to connect their wallet using the rainbow kit tool and to get and update the contract value on the blockchain.
The front is already deployed and you can interact with it 
https://boilerplate-foundry-wagmi.vercel.app/

All commands must be executed in the frontend folder (`cd frontend`).

## Configuration

If you want to deploy the front in local you must create a .env file in the root folder of the front-end. The file must have these properties:
```
NEXT_PUBLIC_WALLET_CONNECT=1[...]4 // Project ID created on wallet connect cloud to allow the user to connect via Wallet connect 
```
## Deploying on localhost

Simply run the command `make run` (or `npm run dev`) to deploy the front-end in local.

</details>
