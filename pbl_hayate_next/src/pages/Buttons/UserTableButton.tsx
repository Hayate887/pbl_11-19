import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export function UserTableButton() {
  const router = useRouter();

  return (
    <Button
      colorScheme="blue"
      onClick={() => router.push("/users")}
    >
      Users Table
    </Button>
  );
}


