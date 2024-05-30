'use client';

import { Flex, Text, Stack, Card, CardBody, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { HeaderBorderStyle, MainTextStyle, NavItemActiveStyle, NavItemNonActiveStyle, ToastWarningStyle } from "@/app/components/style";
import { useToast } from "@chakra-ui/react";
import { GetExpectedChainNameWithEnv, GetFriendlyChainName } from "@/utils/utils";
import ConnectWallet from "./connect-wallet/ConnectWallet";
import { useStoreWallet } from "./connect-wallet/walletContext";

const Header = () => {

    const currentRoute = usePathname();
    const toast = useToast();
    const expectedChainName = GetExpectedChainNameWithEnv();
    const chainId = useStoreWallet(state => state.chainId);
    const publicProvider = useStoreWallet(state => state.publicProvider);

    useEffect(() => {

        if (!chainId) {
            console.log("undefined chain return");
            return;
        }

        if (GetFriendlyChainName(chainId) !== expectedChainName) {
            toast.closeAll();
            toast({
                title: "Wrong network",
                description: `Please switch to ${expectedChainName} network`,
                status: "warning",
                duration: 9000000000,
                containerStyle: ToastWarningStyle
            })

        }
        else {
            toast.closeAll();
        }
    }, [chainId])

    return (
        <Flex justifyContent="space-between"
            alignItems="center"
            p="2rem"
            sx={HeaderBorderStyle}
        >

            <Image src="/logo.png" width={"10%"} />

            <Stack
                direction="row"
                alignItems="center"
                spacing={100}>

                <Link href="/get">
                    <Card sx={(currentRoute === "/get"
                        ? NavItemActiveStyle
                        : NavItemNonActiveStyle)}>
                        <CardBody>
                            <Text sx={MainTextStyle}>
                                GET
                            </Text>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/set">
                    <Card sx={(currentRoute === "/set"
                        ? NavItemActiveStyle
                        : NavItemNonActiveStyle)}>
                        <CardBody>
                            <Text sx={MainTextStyle}>
                                SET
                            </Text>
                        </CardBody>
                    </Card>
                </Link>
            </Stack>

            <ConnectWallet />
        </Flex>
    )
}

export default Header
