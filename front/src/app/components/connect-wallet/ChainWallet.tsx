"use client";

import { Text, Flex } from "@chakra-ui/react";
import { useStoreWallet } from "./walletContext";;
import { ChainBorderStyle } from "@/app/components/style";
import { GetFriendlyChainName } from '@/utils/utils';
import { useEffect } from "react";

export default function ChainWallet() {

    const accountAddress = useStoreWallet((state) => state.address);
    const chainId = useStoreWallet(state => state.chainId);
    const publicProvider = useStoreWallet(state => state.publicProvider);

    return (
        <>
            {
                <>
                    <Flex sx={ChainBorderStyle}>
                        <Text m={2}>{GetFriendlyChainName(chainId)}</Text>
                    </Flex>
                </>

            }
        </>

    )
}