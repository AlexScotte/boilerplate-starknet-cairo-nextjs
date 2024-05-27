import Layout from "@/app/components/Layout";
import { MainTextStyle, MainTextColor } from "@/app/components/style";
import { Center, Text } from "@chakra-ui/react";

export default function Home() {
    return (
        <Layout>
            <Text sx={MainTextStyle}
                textColor={MainTextColor}
                fontSize={"3xl"}>
                WELCOME !
            </Text>
        </Layout>
    );
}

