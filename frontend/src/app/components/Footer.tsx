'use client';

import React from 'react'
import { Flex, Text, Center, Image, Link } from '@chakra-ui/react'
import { FooterBorderStyle, FooterTextStyle, MainTextStyle } from './style';

const Footer = () => {
    return (
        <Flex justifyContent="space-between"
            alignItems="center"
            p="2rem"
            sx={FooterBorderStyle}>
            <Flex direction={"column"} >
                <Text sx={FooterTextStyle} >
                    Powered by:
                </Text>
                <Flex direction={"row"} >

                    <Link href={'https://docs.starknet.io/documentation/'}>
                        <Image
                            padding={1}
                            width={10}
                            src="https://www.starknet.io/wp-content/themes/Starknet/assets/img/starknet-log-sm.svg"
                        />
                    </Link>

                    <Link href={'https://book.cairo-lang.org/'}>
                        <Image
                            padding={1}
                            width={10}
                            src="https://avatars.githubusercontent.com/u/59333826?s=48&v=4"
                        />
                    </Link>

                    <Link href={'https://www.starknetjs.com/'}>
                        <Image
                            padding={1}
                            width={10}
                            src="https://www.starknetjs.com/img/Starknet-JS_navbar.png"
                        />
                    </Link>

                    <Link href={'https://nextjs.org/docs'}>
                        <Image
                            padding={1}
                            width={10}
                            src="https://camo.githubusercontent.com/39791c3e4c4387b8b913628a8f258768ea3a4a71fc815ced2219f81c22c71f6a/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6c696768745f6261636b67726f756e642e706e67"
                        />
                    </Link>
                    <Link href={'https://vercel.com/docs'}>
                        <Image
                            padding={1}
                            width={10}
                            src="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png"
                        />
                    </Link>

                </Flex>
            </Flex>

            <Center sx={FooterTextStyle} marginTop={6}>
                All right reserved &copy; ASC Solutions {new Date().getFullYear()}
            </Center>

            <Flex />
            <Flex />
        </Flex>
    )
}

export default Footer
