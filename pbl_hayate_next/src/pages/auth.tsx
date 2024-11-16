import { Center, HStack, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { ItemTableButton } from "./Buttons/ItemTableButton";
import { LogOutButton } from "./Buttons/LogOutButton";
import { UserTableButton } from "./Buttons/UserTableButton";
import { HelloUserMessage } from "./HelloUserMessage";
export default function Home() {
  return (
    <>
      <Head>
        <title>Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center h="100vh">
        <VStack>
          <HelloUserMessage />
          <LogOutButton />
          <HStack>
            <UserTableButton />
            <ItemTableButton />
          </HStack>
        </VStack>
      </Center>
    </>
  );
}
