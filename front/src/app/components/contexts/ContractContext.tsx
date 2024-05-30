import React, { createContext, useEffect, useState } from "react";
import { GetChainIdFromName, GetExpectedChainNameWithEnv } from "@/utils/utils";
import { useErrorStore } from "@/app/components/errors/ErrorStore";
import { Contract } from "@/types/contract";

export const ContractContext = createContext<Contract>({} as Contract);

const ContractProvider = ({ children }: { children: React.ReactNode }) => {

    const { inError } = useErrorStore();

    const [contracts, setContracts] = useState<Contract>({ "simpleStorageDeployedBlockNumber": 0, "simpleStorageAddress": "", "simpleStorageAbi": "" });

    const expectedChainName = GetExpectedChainNameWithEnv();
    const expectedChainId = GetChainIdFromName(expectedChainName);

    useEffect(() => {
        console.log(`Loading contract provider on chain : ${expectedChainName} with id ${expectedChainId}`);
        getContractAbi();
    }, [inError]);


    const getContractAbi = async () => {

        let simpleStorageAddress;
        let simpleStorageAbi;
        let simpleStorageDeployedBlockNumber;

        try {
            // Try to get the contract artifact
            const simpleStorageArtifact = require("@/contracts/SimpleStorage.json");
            if (!simpleStorageArtifact.networks[expectedChainId]) {

                const error = `SimpleStorage contract not deployed on chaind id ${expectedChainId}`;
                console.log(error);
                useErrorStore.setState({ inError: true, errorMessage: error });
            }

            simpleStorageDeployedBlockNumber = simpleStorageArtifact.networks[expectedChainId].blockNumber;
            simpleStorageAddress = simpleStorageArtifact.networks[expectedChainId].address;
            simpleStorageAbi = simpleStorageArtifact.abi;
            console.log("SimpleStorage contract loaded");
        }
        catch (error) {
            console.log(error);
        }

        /*************************************
         ** Get abi of other contracts here **
         *************************************/


        setContracts({ simpleStorageDeployedBlockNumber, simpleStorageAddress, simpleStorageAbi });
    };


    return (
        <ContractContext.Provider value={contracts}>
            {children}
        </ContractContext.Provider>
    );
}

export default ContractProvider;