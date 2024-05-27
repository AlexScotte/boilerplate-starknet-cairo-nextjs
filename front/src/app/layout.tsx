'use client';
import '@/../index.css';

import { ChakraProvider } from "@chakra-ui/react";
import ContractProvider from './components/contexts/ContractContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider
          toastOptions={{
            defaultOptions: {
              duration: 5000,
              position: "bottom-right",
              isClosable: true,
            }
          }}>
          <ContractProvider >
            {children}
          </ContractProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
