import supabase from "@/libs/supabase";
import { Button, Center, HStack, VStack } from "@chakra-ui/react";
import { LogInButton } from "./Buttons/LogInButton";

export default function SetButton(){
  async function getsession()
    {
        try{
        const {data,error}=await supabase.auth.getSession()
        console.log(data)
        }
        catch(err)
        {
            console.error(err);
        }
    }

  return(
  <Center h="100vh">
    <VStack>
    <HStack h={10}>
    </HStack>
    <Button onClick={getsession}>Session</Button>
    <Button onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}>GitHub</Button>
    <VStack>
      <LogInButton />
    </VStack>
    </VStack>
  </Center>
  );
}


