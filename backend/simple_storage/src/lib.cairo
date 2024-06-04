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
    pub struct ValueChanged {
        #[key]
        pub caller : ContractAddress,
        pub oldValue : u128,
        pub newValue : u128,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
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

#[cfg(test)]
mod tests {

    use core::traits::TryInto;
    use super::{SimpleStorage, ISimpleStorage, ISimpleStorageDispatcher, ISimpleStorageDispatcherTrait};

    use starknet::{
        ClassHash, ContractAddress, Event, testing::pop_log,
        contract_address_const, SyscallResultTrait,
    };
    
    use snforge_std::{
        declare,  ContractClassTrait, ContractClass, start_cheat_caller_address,
        stop_cheat_caller_address, SpyOn, EventSpy, EventAssertions, spy_events, EventFetcher, load,
        cheatcodes::storage::load_felt252
    };

    fn deploy_simple_storage() -> (ISimpleStorageDispatcher, ContractAddress) {

        // First declare and deploy a contract
        let contract = declare("SimpleStorage").unwrap();

        // Alternatively we could use `deploy_syscall` here
        let (contract_address, _) = contract.deploy(@array![]).unwrap();

        // Create a Dispatcher object that will allow interacting with the deployed contract
        let dispatcher = ISimpleStorageDispatcher { contract_address };

        (dispatcher, contract_address)
    }

    #[test]
    fn test_should_get_right_initial_stored_value() {

        let (simple_storage, _) = deploy_simple_storage();
        let initialStoredValue = simple_storage.get();
        assert_eq!(initialStoredValue, 1, "Initial stored value incorrect");
    }

    #[test]
    fn test_should_set_right_value() {

        let (simple_storage, _) = deploy_simple_storage();

        let initialStoredValue = simple_storage.get();
        assert_eq!(initialStoredValue, 1, "Initial stored value incorrect");

        simple_storage.set(123);
        let newStoredValue = simple_storage.get();
        assert_eq!(newStoredValue, 123, "new stored value incorrect");
    }

    #[test]
    fn test_should_set_right_value_from_another_address() {

        let (simple_storage, simple_storage_address) = deploy_simple_storage();

        let initialStoredValue = simple_storage.get();
        assert_eq!(initialStoredValue, 1, "Initial stored value incorrect");

        // Change the caller address to 123 when calling the contract at the `contract_address` address
        start_cheat_caller_address(simple_storage_address, 123.try_into().unwrap());
        simple_storage.set(123);
        let newStoredValue = simple_storage.get();
        assert_eq!(newStoredValue, 123, "new stored value incorrect");
    }
    
    #[test]
    fn test_should_emit_event_after_setting_value() {

        let (simple_storage, simple_storage_address) = deploy_simple_storage();

        let oldValue = simple_storage.get();
        let newValue = 2;

        let caller = 123.try_into().unwrap();

        let mut spy = spy_events(SpyOn::One(simple_storage_address));

        start_cheat_caller_address(simple_storage_address, caller.try_into().unwrap());
        
        simple_storage.set(newValue);

        spy.assert_emitted(@array![
            (
                simple_storage_address,
                SimpleStorage::Event::ValueChanged(
                    SimpleStorage::ValueChanged { caller: caller, oldValue: oldValue, newValue: newValue }
                )
            )
        ]);
    }

    #[test]
    fn test_fuzz_should_set_right_value(x: u128) {

        let (simple_storage, _) = deploy_simple_storage();

        simple_storage.set(x);
        let newStoredValue = simple_storage.get();
        assert_eq!(newStoredValue, x, "new stored value incorrect");
    }

    #[test]
    fn test_fuzz_should_emit_event_after_setting_value(x: u128) {

        let (simple_storage, simple_storage_address) = deploy_simple_storage();

        let oldValue = simple_storage.get();

        let caller = 123.try_into().unwrap();

        let mut spy = spy_events(SpyOn::One(simple_storage_address));

        start_cheat_caller_address(simple_storage_address, caller.try_into().unwrap());
        
        simple_storage.set(x);

        spy.assert_emitted(@array![
            (
                simple_storage_address,
                SimpleStorage::Event::ValueChanged(
                    SimpleStorage::ValueChanged { caller: caller, oldValue: oldValue, newValue: x }
                )
            )
        ]);
    }
}