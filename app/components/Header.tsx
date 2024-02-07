import { AppBar, Box, Toolbar, Stack, Typography } from "@mui/material";
import Link from 'next/link'
import Wallet from "./Wallet/Wallet";

export default function Header() {
    return (
        <AppBar position="static" sx={{ bgcolor: "black" }}>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                    >
                        <Box component="div" sx={{ width: "200px" }}>
                            {/* <img
                                src="https://nodeguardians.io/assets/logo-white.svg"
                                alt="logo"
                                color="black"
                            /> */}
                            {/* sx={{ maxWidth: "100%" }} */}
                        </Box>
                    </Stack>

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={4}
                        width="100%"
                        marginLeft="100px"
                    >
                        <Link
                            href="/Counter"
                        >
                            {/* className={
                  "item-menu " +
                  (currentRoute === "/Quests"
                    ? "item-menu-active"
                    : "item-menu-non-active")
                } */}
                            Set
                        </Link>
                        <Link
                            href="/Get"
                        >
                            {/* className={
                  "item-menu " +
                  (currentRoute === "/Inventory"
                    ? "item-menu-active"
                    : "item-menu-non-active")
                } */}
                            Get
                        </Link>
                    </Stack>

                    <Stack
                        direction={"row"}
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{ cursor: "pointer" }}
                    >
                        <Wallet />
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}