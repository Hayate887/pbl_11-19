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
  VStack,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";

import DeleteModal from "./DeleteModal";
import PostModal from "./PostModal";

interface User {
    id: number;
    name: string;
    price: number;
  }
  
  export type { User };

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  async function handleGet() {
    try {
      const url = "http://localhost:8000/users";
      const res = await axios.get(url);
      if (res.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      setUsers(res.data as User[]);
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
  }, []);

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

  function onDeleteOpenWithUser(user: User) {
    setSelectedUser(user);
    onDeleteOpen();
  }

  return (
    <>
      <PostModal
        isOpen={isPostOpen}
        onClose={onPostClose}
        users={users}
        setUsers={setUsers}
      />
      {selectedUser && (
        <DeleteModal
          user={selectedUser}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          users={users}
          setUsers={setUsers}
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
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.price}</Td>
                  <Td>
                    <IconButton
                      onClick={() => onDeleteOpenWithUser(user)}
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