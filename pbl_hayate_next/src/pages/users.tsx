import { Center } from "@chakra-ui/react";
import Head from "next/head";

import UsersTable from "./UserTable/UsersTable";

export default function Home() {
  return (
    <>
      <Head>
        <title>Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center h="100vh">
        <UsersTable />
      </Center>
    </>
  );
}


