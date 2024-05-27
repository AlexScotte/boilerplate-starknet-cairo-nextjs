'use client';
import Layout from "@/app/components/Layout";
import { useContext, useEffect, useState } from "react";
// import { ContractContext } from "@/components/contexts/contractContext";
import { Contract as Ctrct, ValueChangedEventType, LogWithArgs } from "@/types/contract";
import { Account, Abi, Contract as StrkContract, DeclareContractResponse, InvokeFunctionResponse, RPC, constants, hash, num } from "starknet";

import {
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  List,
  ListItem,
  Card,
  CardBody,
  useToast,
  Center,
  Toast
} from "@chakra-ui/react";

// import {
//   useAccount,
//   useWriteContract,
//   useWaitForTransactionReceipt,
//   useWatchContractEvent,
//   useBlockNumber,
// } from "wagmi";
// import {
//   type Abi,
// } from 'abitype'

// import { createPublicClient, http, Log, parseAbiItem, Chain } from "viem";
import { GetExpectedChainIdWithEnv, ToShortAddress, GetFriendlyChainName } from "@/utils/utils";
import { DescriptionSmallTextStyle, DescriptionTextStyle, MainButtonStyle, MainCardStyle, MainInputFieldStyle, MainInputStyle, MainListStyle, MainNumberIncrementStepperStyle, MainTextStyle, ToastErrorStyle, ToastInfoStyle, ToastSuccessStyle, ToastWarningStyle } from "@/app/components/style";

import { test1Abi } from "@/app/test1";
import { addrTESTCONTRACT } from '@/type/constants';
import { useStoreWallet } from "@/app/components/connect-wallet/walletContext";
import { GetTransactionReceiptResponse, json, type RejectedTransactionReceiptResponse, type RevertedTransactionReceiptResponse, type SuccessfulTransactionReceiptResponse } from "starknet";

const contractAddress = addrTESTCONTRACT;
const Set = () => {
  const toast = useToast();
  const isConnected = useStoreWallet(state => state.isConnected);
  const chainId = useStoreWallet(state => state.chainId);
  const expectedChainName = GetExpectedChainIdWithEnv();
  // const { simpleStorageDeployedBlockNumber, simpleStorageAddress, simpleStorageAbi } = useContext<Contract>(ContractContext);
  const [newValue, setNewValue] = useState<number>(0);
  const [valueChangedEventList, setValueChangedEventList] = useState<ValueChangedEventType[]>([]);
  // const { data } = useBlockNumber();
  const accountWallet = useStoreWallet(state => state.account);
  const publicProvider = useStoreWallet(state => state.publicProvider);
  const [transactionHash, setTransactionHash] = useState<string>("");
  // const {
  //   data: hash,
  //   error: setStoredValueError,
  //   isPending: isStoredValuePending,
  //   writeContract } = useWriteContract()

  const [cairo1WriteContract, setcairo1WriteContract] = useState<StrkContract>(
    new StrkContract(
      test1Abi,
      contractAddress,
      publicProvider
    )
  );



  /********************
   * Event management *
   ********************/


  /**
   * Get the history of the valueChanged event
   */
  useEffect(() => {

    const getEventHistory = async () => {

      //     let publicNode = http();
      //     if (expectedChainId === ChainID.Sepolia) {
      //       publicNode = http("https://gateway.tenderly.co/public/sepolia");
      //     }

      //     const publicClient = createPublicClient({
      //       chain: expectedChainViem as Chain,
      //       transport: publicNode,
      //     })

      //     const logs = await publicClient.getLogs({
      //       address: simpleStorageAddress as `0x${string}`,
      //       event: parseAbiItem('event valueChanged(uint256 oldValue, uint256 newValue, address who)'),
      //       // fromBlock: simpleStorageDeployedBlockNumber ? BigInt(simpleStorageDeployedBlockNumber) : undefined,
      //       fromBlock: BigInt(0),
      //       toBlock: 'latest',
      //     });

      //     let oldEventList: ValueChangedEventType[] = [];
      //     logs.forEach(log => {
      //       const valueChangedEvent = createEvent(log as LogWithArgs);
      //       oldEventList.push(valueChangedEvent);
      //     });

      //     setValueChangedEventList(oldEventList.reverse());

      const lastBlock = await publicProvider.getBlock('latest');
      const keyFilter = [num.toHex(hash.starknetKeccak('EventPanic')), '0x8'];
      const eventsList = await publicProvider.getEvents({
        address: addrTESTCONTRACT,
        from_block: { block_number: lastBlock.block_number - 800 },
        to_block: { block_number: lastBlock.block_number },
        keys: [keyFilter],
        chunk_size: 800,
      });
      console.log(eventsList);
    };

    if (addrTESTCONTRACT) {
      getEventHistory();
    }



  }, [addrTESTCONTRACT]);


  /**
   * Manage the valueChanged event of the contract
   */
  // useWatchContractEvent({
  //   address: simpleStorageAddress as `0x${string}`,
  //   abi: simpleStorageAbi as unknown as Abi,
  //   eventName: 'valueChanged',
  //   onLogs(logs: Log[]) {
  //     manageValueChangedEvent(logs[0] as LogWithArgs);
  //   }
  // })

  /**
  * Build list event data
  */
  const manageValueChangedEvent = (log: LogWithArgs) => {

    // const valueChangedEvent = createEvent(log);

    // if (!valueChangedEventList.some(v => v.txHash === valueChangedEvent.txHash)) {
    //   setValueChangedEventList([valueChangedEvent, ...valueChangedEventList]);
    // }
  }



  // const createEvent = (log: LogWithArgs): ValueChangedEventType => {
  //   const valueChangedEvent: ValueChangedEventType = {
  //     txHash: log.transactionHash?.toString(),
  //     oldValue: log.args.oldValue,
  //     newValue: log.args.newValue,
  //     from: log.args.who
  //   }
  //   return valueChangedEvent;
  // }
  /********************* */



  /*******************************
   * Validation/Error management *
   *******************************/

  useEffect(() => {
    publicProvider?.waitForTransaction(transactionHash)
      .then((txR: GetTransactionReceiptResponse) => {
        console.log("TxStatus =", txR.statusReceipt);

        let finality: string = "";
        let status: "error" | "success" = "error";
        let title: string = "";
        let description: string = "";
        let style: any;

        txR.match({
          success: (txR: SuccessfulTransactionReceiptResponse) => {
            finality = txR.finality_status;
            status = "success";
            title = "Transaction confirmed !";
            description = `Tx: ${transactionHash}`;
            style = ToastSuccessStyle;
          },
          rejected: (txR: RejectedTransactionReceiptResponse) => {
            finality = json.stringify(txR.transaction_failure_reason);
            title = "Transaction rejected !";
            description = `Reason: ${finality}`;
            style = ToastErrorStyle;
          },
          reverted: (txR: RevertedTransactionReceiptResponse) => {
            finality = txR.finality_status;
            title = "Transaction reverted !";
            description = `Reason: ${finality}`;
            style = ToastErrorStyle;
          },
          error: (err: Error) => {
            console.log("aaaaaaa", err.message)
            finality = err.message;
            title = "Transaction error !";
            description = `Reason: ${finality}`;
            style = ToastErrorStyle;
          },
          _: () => {
            console.log('Unsuccess');
            title = "Transaction error !";
            description = `Reason: Unsuccess`;
            style = ToastErrorStyle;
          },
        });
        console.log("TxFinality =", finality);
        toast.closeAll();

        const events = cairo1WriteContract.parseEvents(txR);
        console.log(events);

        toast({
          title: title,
          description: description,
          status: status,
          containerStyle: style,
        })
      })
      .catch((e: any) => {
        console.log("error getTransactionStatus=", e)

        // TODO: Desactivated for now because random timeout error occures after a transaction is confirmed without issue

        // toast.closeAll();
        // toast({
        //   title: "Transaction error",
        //   description: `An error occurred during the transaction`,
        //   status: "error",
        //   containerStyle: ToastErrorStyle
        // })
      });
    return () => { }
  }
    // , [blockFromContext.block_number]);
    , [transactionHash]);


  /********************* */



  /**
   * Modify the value in the contract
   */
  const setStoredValue = async () => {

    if (!isConnected) {

      toast({
        title: "Not connected",
        description: "Please connect your wallet",
        status: "warning",
        containerStyle: ToastWarningStyle
      })
    }
    else {

      if (GetFriendlyChainName(chainId) !== expectedChainName) {

        toast.closeAll();
        toast({
          title: "Wrong network",
          description: `Please switch to ${expectedChainName} network`,
          status: "warning",
          duration: 9999999,
          containerStyle: ToastWarningStyle
        })
        return;
      }

      const call = cairo1WriteContract.populate("set", [newValue]);
      console.log("Call=", call);
      accountWallet?.execute(call, undefined, { version: 3 })
        .then((resp: InvokeFunctionResponse) => {

          const title = "Waiting for confirmation ...";
          const description = `Transaction hash: ${resp.transaction_hash}`;
          console.log(title);
          console.log(description);

          toast({
            title: title,
            description: description,
            status: "loading",
            containerStyle: ToastInfoStyle,
            duration: 9999999
          })
          setTransactionHash(resp.transaction_hash);
        })
        .catch((e: any) => {

          toast({
            title: "Transaction error",
            description: `Error when setting stored value`,
            status: "error",
            containerStyle: ToastErrorStyle
          })
          console.log("error when setting stored value =", e)
        });
    }
  }

  return (
    <Layout>
      <Card
        sx={MainCardStyle}
        p={5}
      >
        <CardBody>
          <Flex
            direction={"column"}
            rowGap={5}>
            <NumberInput
              sx={MainInputStyle}
              onChange={(_, valueAsNumber) => setNewValue(valueAsNumber)}
              value={newValue}
              min={0}>
              <NumberInputField
                textAlign={"end"}
                sx={MainInputFieldStyle} />
              <NumberInputStepper border={0}>
                <NumberIncrementStepper sx={MainNumberIncrementStepperStyle} />
                <NumberDecrementStepper sx={MainNumberIncrementStepperStyle} />
              </NumberInputStepper>
            </NumberInput>

            <Button
              sx={MainButtonStyle}
              onClick={() => setStoredValue()}>
              {/* // isLoading={isStoredValuePending} */}
              Set
            </Button>

            <List
              sx={MainListStyle}>
              {
                valueChangedEventList.length === 0 ?
                  (
                    <Center sx={DescriptionTextStyle}>No event</Center>
                  ) :
                  (
                    valueChangedEventList.map((item, index) => (
                      <ListItem
                        key={index}>
                        {
                          item.oldValue !== undefined && item.newValue !== undefined ?
                            (

                              <Center sx={DescriptionSmallTextStyle}>
                                Value changed from {item.oldValue.toString()} to {item.newValue.toString()} by {ToShortAddress(item.from)}
                              </Center>
                            ) :
                            <></>
                        }
                      </ListItem>
                    ))
                  )
              }
            </List>
          </Flex>
        </CardBody>
      </Card>
    </Layout>
  );
}

export default Set;