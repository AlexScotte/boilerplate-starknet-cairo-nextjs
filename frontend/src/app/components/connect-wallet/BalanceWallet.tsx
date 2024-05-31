"use client";

import { useEffect, useState } from 'react';
import { Contract, uint256, shortString } from "starknet";

import { Text, Center, Spinner, Flex } from "@chakra-ui/react";
import { erc20Abi } from "@/contracts/ERC20abi"
import { useStoreWallet } from "./walletContext";;
import { MainTextColor, BalanceBorderStyle } from "@/app/components/style";

type Props = { tokenAddress: string };

export default function BalanceWallet({ tokenAddress }: Props) {

    const accountAddress = useStoreWallet((state) => state.address);
    const chainId = useStoreWallet((state) => state.chainId);

    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [decimals, setDecimals] = useState<number>(18)
    const [symbol, setSymbol] = useState<string>("");

    const publicProvider = useStoreWallet(state => state.publicProvider);
    const contract = new Contract(erc20Abi, tokenAddress, publicProvider);

    useEffect(() => {
        contract.call("decimals")
            .then((resp: any) => {
                console.log("Get decimals=", resp);
                setDecimals(Number(resp));
            })
            .catch((e: any) => { console.log("error getDecimals=", e) });

        contract.symbol()
            .then((resp: any) => {
                const res2 = shortString.decodeShortString(resp);
                console.log("Get symbol=", res2);
                setSymbol(res2);
            })
            .catch((e: any) => { console.log("error getSymbol=", e) });
    }, [accountAddress]);

    useEffect(() => {
        contract.balanceOf(accountAddress)
            .then((resp: any) => {
                const res3 = Number(resp);
                console.log("Get balanceOf=", resp);
                setBalance(res3 / Math.pow(10, decimals));
            }
            )
            .catch((e: any) => { console.log("error balanceOf=", e) });
    }, [decimals, accountAddress]);

    return (
        <>
            <Flex sx={BalanceBorderStyle}>
                {
                    typeof balance == "undefined" ? (
                        <>
                            <Center>
                                <Spinner color={MainTextColor} size="sm" mr={4} />
                            </Center>
                        </>
                    ) : (
                        <>
                            <Text m={2}>{balance.toFixed(4)} {symbol}</Text>
                        </>
                    )
                }
            </Flex>
        </>

    )
}