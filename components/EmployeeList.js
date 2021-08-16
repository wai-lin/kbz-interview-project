import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import {
  CgPen,
  CgTrashEmpty,
  CgSoftwareDownload,
  CgChevronLeft,
  CgChevronRight,
} from "react-icons/cg";

import { useEmployees, useEmployeesCount } from "../hooks/useEmployees";
import { useDeleteUser } from "../hooks/useUser";

const initialQuery = {
  skip: 0,
  limit: 2,
  search: "",
};

function queryReducer(state, action) {
  state.skip = action.skip || 0;
  state.limit = action.limit || 10;
  state.search = action.search || "";

  return { ...state };
}

function EmployeeList() {
  const router = useRouter();
  const toast = useToast();

  const [query, dispatchQuery] = React.useReducer(queryReducer, initialQuery);

  const { employeesCountQuery } = useEmployeesCount();
  const { employeesQuery } = useEmployees(query);
  const { deleteUserMutation } = useDeleteUser();

  const { refetch } = employeesQuery;

  const [toDelete, setToDelete] = React.useState("");
  const onClose = () => setToDelete("");
  const cancelRef = React.useRef();
  const deleteUser = () => {
    deleteUserMutation
      .mutateAsync(toDelete)
      .then((d) => {
        onClose();
        toast({
          title: "Employee deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to delete employee.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      });
  };

  React.useEffect(() => {
    refetch();
  }, [refetch, router.asPath, query]);

  const users = () => {
    if (employeesQuery.data?.success) {
      return employeesQuery.data.data.map((user) => ({ ...user }));
    }
    return [];
  };

  const [search, setSearch] = React.useState("");
  const totalPages =
    Math.floor(employeesCountQuery.data?.data / query.limit) || 0;

  return (
    <>
      <Flex
        alignItems="flex-end"
        justifyContent="space-between"
        p="4"
        borderBottom="1px"
        borderColor="gray.200"
        mb="4"
      >
        <Box
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            dispatchQuery({
              ...query,
              search,
            });
          }}
        >
          <FormControl id="emp-name">
            <FormLabel>Search with email, employee name, nrc</FormLabel>
            <Input
              placeholder="email, employee name, nrc"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              w="500px"
            />
          </FormControl>
        </Box>

        <Stack direction="row">
          <IconButton
            disabled={query.skip === 0}
            onClick={() => {
              dispatchQuery({
                limit: query.limit,
                skip: query.skip - query.limit,
                search: query.search,
              });
            }}
          >
            <CgChevronLeft />
          </IconButton>
          <IconButton
            disabled={totalPages === 0 || query.skip > totalPages}
            onClick={() => {
              dispatchQuery({
                limit: query.limit,
                skip: query.skip + query.limit,
                search: query.search,
              });
            }}
          >
            <CgChevronRight />
          </IconButton>
          <Button
            as="a"
            href="/api/users/download-csv"
            leftIcon={<CgSoftwareDownload />}
          >
            Export Employees List
          </Button>
        </Stack>
      </Flex>

      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>NRC</Th>
            <Th>DoB</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {users().map((user) => (
            <Tr key={user.id}>
              <Td>{user?.employee?.name || ""}</Td>
              <Td>{user?.email || ""}</Td>
              <Td>{user?.employee?.nrc || ""}</Td>
              <Td>
                {user?.employee?.dob
                  ? format(new Date(user?.employee?.dob), "MMM dd, yyyy")
                  : ""}
              </Td>
              <Td>
                <Link
                  href={`/admin/employee/edit?uid=${user.id}&name=${user.employee?.name}`}
                  passHref
                >
                  <Button
                    as="a"
                    size="sm"
                    colorScheme="purple"
                    leftIcon={<CgPen />}
                    variant="outline"
                  >
                    Edit
                  </Button>
                </Link>
                <Button
                  as="a"
                  ml="1"
                  size="sm"
                  cursor="pointer"
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<CgTrashEmpty />}
                  onClick={() => setToDelete(user.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
          {(!employeesQuery.data?.success ||
            employeesQuery.data?.data === null ||
            employeesQuery.data?.data.length === 0) && (
            <Tr>
              <Td>No employee found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={toDelete}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Employee
            </AlertDialogHeader>

            <AlertDialogBody>
              {"Are you sure? You can't undo this action afterwards."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteUser}
                ml={3}
                isLoading={deleteUserMutation.isLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export { EmployeeList };
