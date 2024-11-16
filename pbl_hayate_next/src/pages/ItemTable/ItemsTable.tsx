import { sessionState } from "@/libs/states";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { DeleteModal } from "./DeleteModal";
import { PostModal } from "./PostModal";
interface Item {
    id: number;
    name: string;
    price: number;
  }
  
  export type { Item };

  
export function ItemsTable() {
  const [session] = useRecoilState<Session | null>(sessionState);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [isLoading, setIsLoading] = useState(true);


  async function handleGet() { 
    console.log(session?.access_token)   
    try{ 
        const url = "http://localhost:8000/select/users";
        const config = {
        headers: {
          // FIXME: Need to use 〇〇〇
          Authorization: `Bearer ${session?.access_token}`,

        },
      };
      
      const res = await axios.get(url, config);
      
      if (res.status !== 200) {
        throw new Error("Failed to fetch items");
      }
      setItems(res.data as Item[]);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const init = async () => {
      await handleGet();
      setIsLoading(false);
    };
    init();
  }, [session]);

  const {
    isOpen: isPostOpen,
    onOpen: onPostOpen,
    onClose: onPostClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  function onDeleteOpenWithItem(item: Item) {
    setSelectedItem(item);
    onDeleteOpen();
  }

  return (
    <>
      <PostModal
        isOpen={isPostOpen}
        onClose={onPostClose}
        items={items}
        setItems={setItems}
      />
      {selectedItem && (
        <DeleteModal
          item={selectedItem}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          items={items}
          setItems={setItems}
        />
      )}
      <VStack>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.price}</Td>
                  <Td>
                    <IconButton
                      onClick={() => onDeleteOpenWithItem(item)}
                      variant="outline"
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Spinner size="xl" hidden={!isLoading} />
        <IconButton
          onClick={onPostOpen}
          variant="outline"
          aria-label="Add"
          icon={<AddIcon />}
          hidden={isLoading}
        />
      </VStack>
    </>
  );
}