'use client';
import Layout from "@/app/components/Layout";
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "@/app/components/contexts/ContractContext";
import { Contract, ValueChangedEventType } from "@/types/contract";
import { events, CallData, Account, Abi, Contract as StrkContract, InvokeFunctionResponse, hash, num } from "starknet";

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

import { GetExpectedChainNameWithEnv, ToShortAddress, GetFriendlyChainName } from "@/utils/utils";
import { DescriptionSmallTextStyle, DescriptionTextStyle, MainButtonStyle, MainCardStyle, MainInputFieldStyle, MainInputStyle, MainListStyle, MainNumberIncrementStepperStyle, MainTextStyle, ToastErrorStyle, ToastInfoStyle, ToastSuccessStyle, ToastWarningStyle } from "@/app/components/style";

import { useStoreWallet } from "@/app/components/connect-wallet/walletContext";
import {
  GetTransactionReceiptResponse,
  json,
  type RejectedTransactionReceiptResponse,
  type RevertedTransactionReceiptResponse,
  type SuccessfulTransactionReceiptResponse
} from "starknet";

const Set = () => {
  const toast = useToast();
  const isConnected = useStoreWallet(state => state.isConnected);
  const chainId = useStoreWallet(state => state.chainId);
  const expectedChainName = GetExpectedChainNameWithEnv();
  const { simpleStorageAddress, simpleStorageAbi } = useContext<Contract>(ContractContext);

  const [newValue, setNewValue] = useState<number>(0);
  const [valueChangedEventList, setValueChangedEventList] = useState<ValueChangedEventType[]>([]);
  const accountWallet = useStoreWallet(state => state.account);
  const publicProvider = useStoreWallet(state => state.publicProvider);
  const walletProvider = useStoreWallet(state => state.walletProvider);
  const [transactionHash, setTransactionHash] = useState<string>("");

  const [writeContract, setWriteContract] = useState<StrkContract>();

  useEffect(() => {

    const createContract = async () => {

      setWriteContract(new StrkContract(
        simpleStorageAbi,
        simpleStorageAddress,
        walletProvider
      ))
    };

    if (simpleStorageAddress) {
      createContract();
    }
  }, [simpleStorageAbi]);


  /********************
   * Event management *
   ********************/


  /**
   * Get the history of the valueChanged event
   */
  useEffect(() => {

    const getEventHistory = async () => {

      const lastBlock = await publicProvider.getBlock('latest');
      const keyFilter = [num.toHex(hash.starknetKeccak('ValueChanged')), '0x8'];
      const eventsList = await publicProvider.getEvents({
        address: simpleStorageAddress,
        from_block: { block_number: lastBlock.block_number - 800 },
        to_block: { block_number: lastBlock.block_number },
        keys: [keyFilter],
        chunk_size: 800,
      });

      console.log("rawEvents =", eventsList.events);
      const sierra = await publicProvider.getClassAt(simpleStorageAddress);
      const abiEvents = events.getAbiEvents(sierra.abi);
      const abiStructs = CallData.getAbiStruct(sierra.abi);
      const abiEnums = CallData.getAbiEnum(sierra.abi);
      const parsedEvents = events.parseEvents(eventsList.events, abiEvents, abiStructs, abiEnums)
      console.log("parsed events =", parsedEvents);

      let oldEventList: ValueChangedEventType[] = [];
      parsedEvents.forEach(event => {
        const valueChangedEvent = createEvent(event);
        oldEventList.push(valueChangedEvent);
      });

      setValueChangedEventList(oldEventList.reverse());
    };

    if (simpleStorageAddress) {
      getEventHistory();
    }



  }, [simpleStorageAddress]);

  /**
  * Add incoming event to the events list
  */
  const manageValueChangedEvent = (event: any) => {

    const valueChangedEvent = createEvent(event);
    setValueChangedEventList([valueChangedEvent, ...valueChangedEventList]);
  }



  const createEvent = (event: any): ValueChangedEventType => {
    const valueChangedEvent: ValueChangedEventType = {
      oldValue: event.ValueChanged.oldValue,
      newValue: event.ValueChanged.newValue,
      from: num.toHexString(event.ValueChanged.caller)
    }
    return valueChangedEvent;
  }
  /********************* */



  /*******************************
   * Validation/Error management *
   *******************************/

  useEffect(() => {

    if (!writeContract)
      return;

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

        const parsedEvents = writeContract.parseEvents(txR);
        parsedEvents.forEach((event: any) => {
          manageValueChangedEvent(event);
        });
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

    if (!writeContract)
      return;

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

      console.log(walletProvider)

      const call = writeContract.populate("set", [newValue]);
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