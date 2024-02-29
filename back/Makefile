#source .env in .env directory
-include .env

RUN_LOCAL_NODE := katana
# Conditionally add args  if the variables are set
ifneq ($(strip $(accounts)),)
    RUN_LOCAL_NODE += --accounts $(accounts)
endif
ifneq ($(strip $(seed)),)
    RUN_LOCAL_NODE += --seed $(seed)
endif
ifneq ($(strip $(gas_price)),)
    RUN_LOCAL_NODE += --gas-price $(gas_price)
endif

local_node:
	$(RUN_LOCAL_NODE)

rpc:
	echo ${LOCAL_RPC}
	
version:
	scarb --version 
	starkli --version 
	katana --version

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
	@read -p "Please enter the contract class hash: " CLASS_HASH; \
	export CLASS_HASH; \
	$(MAKE) deployy class_hash=$$CLASS_HASH args=${args} rpc=${rpc} account=${account}


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

