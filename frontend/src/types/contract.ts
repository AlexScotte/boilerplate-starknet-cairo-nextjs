import { Account, Abi, Contract as StrkContract } from "starknet";

export type Contract = {
    simpleStorageDeployedBlockNumber: number;
    simpleStorageAddress: string;
    simpleStorageAbi: any;

    // TODO: Add other contracts props here
};

export type ValueChangedEventType = {
    oldValue: bigint | undefined;
    newValue: bigint | undefined;
    from: string,
}