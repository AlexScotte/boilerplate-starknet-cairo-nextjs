'use client';
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "@/app/components/contexts/ContractContext";
import { Account, Abi, Contract as StrkContract } from "starknet";

import { Contract as Ctrct } from "@/types/contract";
import Layout from "@/app/components/Layout";
import { Button, Text, Flex, Center } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

import { DescriptionTextStyle, MainButtonStyle, MainCardStyle, ToastErrorStyle, ToastWarningStyle } from "@/app/components/style";

import { useStoreWallet } from "@/app/components/connect-wallet/walletContext";

import { test1Abi } from "@/app/test1";
import { addrTESTCONTRACT } from '@/type/constants';

const contractAddress = addrTESTCONTRACT;
const Get = () => {

  const toast = useToast();
  const { simpleStorageAddress, simpleStorageAbi } = useContext<Ctrct>(ContractContext);
  const [storedValue, setStoredValue] = useState<string>('');
  const [storedValueLoading, setstoredValueLoading] = useState<boolean>(false);

  const isConnected = useStoreWallet(state => state.isConnected);
  const chainId = useStoreWallet(state => state.chainId);
  const publicProvider = useStoreWallet(state => state.publicProvider);

  const [readContract] = useState<StrkContract>(
    new StrkContract(
      test1Abi,
      contractAddress,
      publicProvider
    )
  );

  /**
   * Get the stored value from the contract
   */
  const getStoredValue = async () => {

    setstoredValueLoading(true);
    readContract.get()
      .then((result: any) => {
        console.log(`Stored value: ${result}`)
        const resultBigInt = result as BigInt;
        setStoredValue(resultBigInt.toString());
      })
      .catch((e: any) => {

        console.log("error get stored value =", e);

        toast({
          title: "Error",
          description: "Error when getting stored value",
          status: "error",
          containerStyle: ToastErrorStyle
        })
      })
      .finally(() => {
        setstoredValueLoading(false);
      });
  }

  return (
    <Layout>

      <Card
        sx={MainCardStyle}>
        <CardBody>

          <Flex
            direction={"column"}
            rowGap={5}>

            <Text textAlign={"center"}
              sx={DescriptionTextStyle}>
              Stored value: <Text sx={DescriptionTextStyle} as='b'>{storedValue}</Text>
            </Text>

            <Button
              sx={MainButtonStyle}
              onClick={() => getStoredValue()}
              mt="1rem"
              isLoading={storedValueLoading}
            >
              Get
            </Button>

          </Flex>
        </CardBody>
      </Card>


    </Layout>
  );
}

export default Get;