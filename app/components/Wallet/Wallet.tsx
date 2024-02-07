"use client";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useMemo } from "react";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";


function WalletConnected() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();

    const shortenedAddress = useMemo(() => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }, [address]);

    return (
        <div>
            <span>Connected: {shortenedAddress}</span>
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
    );
}

function ConnectWallet() {
    const { connectors, connect } = useConnect();

    return (
        <Stack direction={"row"}>
            <span>Choose a wallet: </span>
            {connectors.map((connector) => {
                return (
                    <Button
                        key={connector.id}
                        onClick={() => {
                            console.log(connector);
                            connect({ connector })
                        }
                        }
                        className="gap-x-2 mr-2"
                    >
                        {connector.id}
                    </Button>
                );
            })}

        </Stack>
    );
}

export default function Wallet() {
    const { address } = useAccount();

    return address ? <WalletConnected /> : <ConnectWallet />;
}
