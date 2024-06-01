#source .env in .env directory
-include .env

.PHONY: help test coverage node deploy

help:
	@echo "Usage:"
	@echo "  make node"
	@echo "    Deploy a local starkNet-devnet node with 3 prefunded accounts"
	@echo "\n"
	@echo "  make get_faucet addr=0x023...Ad"
	@echo "    Fund specify address with 1 faucet ETH"
	@echo "\n"
	@echo "  make deploy [chain=...]"
	@echo "    example: make deploy -> to deploy by default on localhost"
	@echo "	     make deploy chain=sepolia -> to deploy on sepolia"
	@echo "\n"
	@echo "  make getset [chain=...] [addr=...]"
	@echo "    example: make getset chain=localhost addr=0x2f...ef-> to interact with the contract on the specified chain"
	@echo "\n"

version:
	scarb --version 
	starkli --version 
	katana --version

node:
	starknet-devnet --seed 3
		
get_faucet:
ifndef addr
	$(error You need to specify an account address to provide (ex: make get_faucet addr=0x023...Ad))
endif

	@curl -X POST -H "Content-Type: application/json" "http://127.0.0.1:5050/mint" -d '{"address": "${addr}", "amount": 1000000000000000000}'

create_wallet:
	make create_signer account=${account}
	make create_descriptor account=${account} wallet_address=${wallet_address} rpc=${rpc}

create_wallet_prompt:
	@read -p "Please enter the account name: " ACCOUNT_NAME; \
	export ACCOUNT_NAME; \
	read -p "Please enter the wallet address: " WALLET_ADDRESS; \
	export WALLET_ADDRESS; \
	read -p "Please enter the RPC url: " RPC_URL; \
	export RPC_URL; \
	$(MAKE) create_wallet account=$$ACCOUNT_NAME wallet_address=$$WALLET_ADDRESS rpc=$$RPC_URL

create_signer:
ifndef account
	$(error You need to specify an account name (ex: account=account0))
endif

	starkli signer keystore from-key ~/.starkli-wallets/deployer/${account}_keystore.json


check_keystore:
ifndef account
	$(error You need to specify an account name (ex: account=account0))
endif

	cat ~/.starkli-wallets/deployer/${account}_keystore.json


create_descriptor:
ifndef wallet_address
	$(error You need to specify the smart wallet address (ex: wallet_address=0x12...b1))
endif
ifndef account
	$(error You need to specify an account name (ex: account=account0))
endif
ifndef rpc
	$(error You need to specify the RPC URL (ex: rpc=http://0.0.0.0:5050))
endif

	starkli account fetch ${wallet_address} --output ~/.starkli-wallets/deployer/${account}_account.json --rpc ${rpc}


declare_deploy:
	make declare contract=${contract} rpc=${rpc} account=${account} args=
	# @read -p "Please enter the contract class hash: " CLASS_HASH; \
	# export CLASS_HASH; \
	# $(MAKE) deployy class_hash=$$CLASS_HASH args=${args} rpc=${rpc} account=${account}


# not working for now with several args, need to find a way to read input several args
declare_deploy_prompt:
	@read -p "Please enter the path folder to your contract: " PACKAGE; \
	export PACKAGE; \
	read -p "Please enter the contract name: " CONTRACT; \
	export CONTRACT; \
	read -p "Please enter the RPC url: " RPC_URL; \
	export RPC_URL; \
	read -p "Please enter the account name to use: " ACCOUNT_NAME; \
	export ACCOUNT_NAME; \
	read -p "Please enter constructor args if necessary: " ARGS; \
	export ARGS; \
	$(MAKE) declare_deploy package=$$PACKAGE contract=$$CONTRACT args=$$ARGS rpc=$$RPC_URL account=$$ACCOUNT_NAME 

declare:
ifndef package
	$(error You need to specify the folder path to your contract (ex: package=folder1))
endif
ifndef contract
	$(error You need to specify the contract name (ex: contract=contractName))
endif
ifndef rpc
	$(error You need to specify the RPC URL (ex: rpc=http://0.0.0.0:5050))
endif
ifndef account
	$(error You need to specify an account name (ex: account=account0))
endif

	starkli declare ${package}/target/dev/${package}_${contract}.contract_class.json --rpc ${rpc} --account ~/.starkli-wallets/deployer/${account}_account.json --keystore ~/.starkli-wallets/deployer/${account}_keystore.json

deployy:
ifndef class_hash
	$(error You need to specify the class hash of the contract (ex: class_hash=0x09...a52 ) \
			The class hash is generated after declaring the contract)
endif
ifndef rpc
	$(error You need to specify the RPC URL (ex: rpc=http://0.0.0.0:5050))
endif
ifndef account
	$(error You need to specify the account name (ex: account=account0))
endif
ifdef args
	@echo deploying contract with constructor args=${args}
else
	@echo deploying contract with no constructor args
endif

	starkli deploy ${class_hash} ${args} --rpc ${rpc} --account ~/.starkli-wallets/deployer/${account}_account.json --keystore ~/.starkli-wallets/deployer/${account}_keystore.json



deploy:
ifdef chain
	@echo Deploying contract on ${chain}
else
	@echo No chain specified, using localhost by default "(ex: chain=sepolia)"
endif
	@node scripts/deploy.js ${chain}

getset:
ifdef chain
	@echo Testing contract on ${chain}
else
	@echo No chain specified, testing on localhost by default "(ex: chain=sepolia)"
endif
ifndef addr
	$(error You need to specify the contract address (ex: addr=0x2f6905caa9981af1ade028c3c609b4c8b0096e8ba3dff6aa22e9a7f86d2667d))
endif
	@node scripts/simpleStorage.js ${chain} ${addr}