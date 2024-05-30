"use client";

import { useStoreWallet } from './walletContext';

import { Button, Center, Flex } from "@chakra-ui/react";
import { StarknetWindowObject, connect } from "get-starknet";
import { Account, encode, Provider, RpcProvider, constants as SNconstants } from "starknet";
import { AddressBorderStyle, MainButtonStyle, SecondButtonStyle } from '../style';
import { ToShortAddress } from '@/utils/utils';
import BalanceWallet from './BalanceWallet';
import ChainWallet from './ChainWallet';

export default function ConnectWallet() {
    const addressAccount = useStoreWallet(state => state.address);
    const wallet = useStoreWallet(state => state.wallet);
    const isConnected = useStoreWallet(state => state.isConnected);
    const accountW = useStoreWallet(state => state.account);
    const addrETH = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
    const addrSTRK = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

    const handleConnectClick = async () => {
        const getWallet = await connect({ modalMode: "alwaysAsk", modalTheme: "dark" });
        await getWallet?.enable({ starknetVersion: "v5" } as any);

        useStoreWallet.setState({ wallet: getWallet });
        useStoreWallet.setState({ walletProvider: getWallet?.provider });
        const addr = encode.addHexPrefix(encode.removeHexPrefix(getWallet?.selectedAddress ?? "0x").padStart(64, "0"));
        useStoreWallet.setState({ address: addr });
        useStoreWallet.setState({ isConnected: getWallet?.isConnected });

        console.log("Connected Wallet:");
        console.log(getWallet);

        if (getWallet?.account) {
            useStoreWallet.setState({ account: getWallet.account });
            !!(getWallet.chainId) ?
                useStoreWallet.setState({ chainId: getWallet.chainId }) :
                useStoreWallet.setState({ chainId: SNconstants.StarknetChainId.SN_SEPOLIA });
        }
        console.log("Stored Wallet:");
        console.log(useStoreWallet.getState());
    }
    return (

        <>
            {!isConnected ? (
                <>
                    <Button
                        sx={SecondButtonStyle}
                        onClick={() => {
                            handleConnectClick();
                        }}
                    >
                        Connect Wallet
                    </Button>
                </>
            ) : (
                <Flex>

                    <ChainWallet></ChainWallet>

                    <BalanceWallet tokenAddress={addrETH} ></BalanceWallet>

                    <Button
                        sx={AddressBorderStyle}
                        textDecoration="none !important"
                        outline="none !important"
                        boxShadow="none !important"
                        onClick={() => {
                            useStoreWallet.setState({ isConnected: false });
                        }}
                    >
                        {accountW
                            ? `${ToShortAddress(addressAccount)}`
                            : "No Account"}
                    </Button>

                </Flex>
            )
            }
        </>

    )
}
