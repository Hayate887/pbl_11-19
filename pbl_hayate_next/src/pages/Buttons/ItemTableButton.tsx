import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export function ItemTableButton() {
  const router = useRouter();

  return (
    <Button
      colorScheme="blue"
      onClick={() => router.push("/item")}
    >
      Items Table
    </Button>
  );
}