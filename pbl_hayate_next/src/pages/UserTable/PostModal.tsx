import {
  Button,
  FormControl, FormLabel,
  Input,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  useToast
} from "@chakra-ui/react";
  
import axios from "axios";
import { useState } from "react";
  
interface User {
    id: number;
    name: string;
    price: number;
  }
  
  export type { User };
  
  interface Props {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    setUsers: (users: User[]) => void;
  }
  
  export default function PostModal({ isOpen, onClose, users, setUsers }: Props) {
    const [name, setName] = useState("");
    const [id, setID] = useState(0);
    const [price, setPrice] = useState(0);
  
    const isError = name == "";
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
  
    async function handlePost() {
      setIsLoading(true);
      try {
        const url = "http://localhost:8000/fruits";
        const data = { id: id, name: name,  price: price};
        const res = await axios.post(url, data);
        if (res.status !== 200) {
          throw new Error("Failed to post user");
        }
        setUsers([...users, res.data as User]);
        toast({
          title: "User added !",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Failed to add user",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      onClose();
    }
  
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={isError}>
                <FormLabel>ID</FormLabel>
                <NumberInput
                value={id}
                onChange={(_, value) => setID(value)}
                step={1}
                min={1}
                max={10000}
              >
              <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                  </NumberInput>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Name</FormLabel>
                    <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </FormControl>
              <FormControl>
                <FormLabel mt={4}>Price</FormLabel>
                <NumberInput
                value={price}
                onChange={(_, value) => setPrice(value)}
                step={100}
                min={100}
                max={10000}
              >
              <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                  </NumberInput>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handlePost}
                isDisabled={isError}
                isLoading={isLoading}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
