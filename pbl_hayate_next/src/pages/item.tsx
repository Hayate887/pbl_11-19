import { Center } from "@chakra-ui/react";
import Head from "next/head";

import { ItemsTable } from "./ItemTable/ItemsTable";

export default function Home() {
  return (
    <>
      <Head>
        <title>Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center h="100vh">
        <ItemsTable />
      </Center>
    </>
  );
}