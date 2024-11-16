import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import supabase from "@/libs/supabase";

export function LogOutButton() {
  const router = useRouter();

  return (
    <>
      <Button
        w="100%"
        colorScheme="red"
        onClick={() => {
          supabase.auth.signOut();
          router.push("/");
        }}
      >
        Log Out
      </Button>
    </>
  );
}


