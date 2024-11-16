import { sessionState } from "@/libs/states";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import axios from "axios";
import { useState } from "react";
import { useRecoilState } from "recoil";

interface Item {
  id: number;
  name: string;
  price: number;
}

export type { Item };

interface Props {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  setItems: (items: Item[]) => void;
}

export function DeleteModal({ item, isOpen, onClose, items, setItems }: Props) {
  const [session] = useRecoilState<Session | null>(sessionState);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  async function handleDelete() {
    setIsLoading(true);
    try {
      const url = "http://localhost:8000/select/delete/" + item.id;
      const config = {
        headers: {
          // FIXME: Need to use 〇〇〇
          Authorization: `Bearer ${session?.access_token}`,

        },
      };
      const res = await axios.delete(url, config);
      if (res.status !== 200) {
        throw new Error("Failed to delete item");
      }
      const newItems = items.filter((i) => i.id !== item.id);
      setItems(newItems);
      toast({
        title: "Item deleted !",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete item",
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
          <ModalHeader>Delete Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack spacing={1}>
              <Text>
                Are you sure you want to delete <b>{item.name}</b> ?
              </Text>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDelete}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}