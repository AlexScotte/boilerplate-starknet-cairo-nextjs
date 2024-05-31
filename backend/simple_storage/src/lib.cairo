#[starknet::interface]
trait ISimpleStorage<TContractState> {
    fn set(ref self: TContractState, x: u128);
    fn get(self: @TContractState) -> u128;
}

#[starknet::contract]
mod SimpleStorage {
    use starknet::get_caller_address;
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        stored_data: u128,
    }

    #[derive(Drop, starknet::Event)]
    struct ValueChanged {
        #[key]
        caller : ContractAddress,
        oldValue : u128,
        newValue : u128,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ValueChanged: ValueChanged,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState
    ) {
        self.stored_data.write(1);
    }

    #[abi(embed_v0)]
    impl SimpleStorage of super::ISimpleStorage<ContractState> {
        fn set(ref self: ContractState, x: u128) {
            let storedOldValue: u128 = self.stored_data.read();
            self.stored_data.write(x);
            self.emit(ValueChanged {caller: get_caller_address(), oldValue: storedOldValue, newValue: x});
        }
        fn get(self: @ContractState) -> u128 {
            self.stored_data.read()
        }
    }
}

#[starknet::contract]
mod SimpleStorage2 {
    use starknet::get_caller_address;
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        stored_data: u128
    }

    #[derive(Drop, starknet::Event)]
    struct ValueChanged {
        #[key]
        caller : ContractAddress,
        oldValue : u128,
        newValue : u128,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ValueChanged: ValueChanged,
    }


    #[constructor]
    fn constructor(
        ref self: ContractState,
        number_1: u128,
        number_2: u128,
    ) {
        self.stored_data.write(number_1);
        self.stored_data.write(number_2);
    }

    #[abi(embed_v0)]
    impl SimpleStorage of super::ISimpleStorage<ContractState> {

        fn set(ref self: ContractState, x: u128) {
            let storedOldValue: u128 = self.stored_data.read();
            self.stored_data.write(x);
            self.emit(ValueChanged {caller: get_caller_address(), oldValue: storedOldValue, newValue: x});
        }
        fn get(self: @ContractState) -> u128 {
            self.stored_data.read()
        }
    }
}


// use starknet::prelude::*;
// use starknet::testing::*;


#[cfg(test)]
mod tests {

    use starknet::testing::pop_log;
    // use starknet::{
    //     deploy_syscall, ClassHash, class_hash_try_from_felt252, ContractAddress, 
    //     contract_address_const, SyscallResultTrait,
    // };
    use starknet::{
        ClassHash, ContractAddress, 
        contract_address_const, SyscallResultTrait,
    };
    use super::{SimpleStorage, ISimpleStorage, ISimpleStorageDispatcher, ISimpleStorageDispatcherTrait};
    use snforge_std::{
        declare, ContractClassTrait, ContractClass, start_cheat_caller_address,
        stop_cheat_caller_address, SpyOn, EventSpy, EventAssertions, spy_events, EventFetcher, load,
        cheatcodes::storage::load_felt252
    };

    fn deploy_simple_storage() -> (ISimpleStorageDispatcher, ContractAddress) {
        let contract = declare("SimpleStorage").unwrap();
        let owner: ContractAddress = contract_address_const::<'owner'>();
    
        let mut constructor_calldata = array![owner.into()];
    
        let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    
        let dispatcher = ISimpleStorageDispatcher { contract_address };
    
        (dispatcher, contract_address)
    }

    // Utilisez MockedStarkNetClient pour simuler les interactions avec StarkNet

    #[test]
    fn test_constructor() {

        let (simple_storage, simple_storage_address) = deploy_simple_storage();
        
        // let pepperoni_count = load(pizza_factory_address, selector!("pepperoni"), 1);
        // let pineapple_count = load(pizza_factory_address, selector!("pineapple"), 1);
        // assert_eq!(pepperoni_count, array![10]);
        // assert_eq!(pineapple_count, array![10]);

        // assert_eq!(simple_storage.get(), 1);
        simple_storage.set(10);
        assert_eq!(simple_storage.get(), 10);
    
        // let client = MockedStarkNetClient::new();

        // // Créez une instance de votre contrat en utilisant le client simulé
        // let contract = SimpleStorage::deploy(&client).unwrap();

        // // Testez la fonction set
        // let tx_hash = contract.set(42u128).send().unwrap();
        // assert!(tx_hash.is_ok(), "Transaction failed");

        // // Vérifiez que la valeur a été mise à jour dans le contrat
        // let result = contract.get().call().unwrap();
        // assert_eq!(result, 42u128, "Stored value does not match expected value");

        // Vous pouvez ajouter plus de tests ici pour vérifier d'autres aspects de votre contrat
    }

    // Ajoutez d'autres tests selon les besoins de votre contrat
}