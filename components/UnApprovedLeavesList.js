import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { format, differenceInDays } from "date-fns";
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
import { CgTrashEmpty, CgSoftwareDownload, CgCheck } from "react-icons/cg";

import { useLeaves, useUpdateLeave, useDeleteLeave } from "../hooks/useLeave";

const dateFormatStr = "yyyy-MM-dd";

function UnApprovedLeavesList() {
  const router = useRouter();
  const toast = useToast();

  const { leaveFormsQuery } = useLeaves();
  const { leaveFormUpdateMutation } = useUpdateLeave();
  const { leaveFormDeleteMutation } = useDeleteLeave();

  const [toDelete, setToDelete] = React.useState("");
  const onClose = () => setToDelete("");
  const cancelRef = React.useRef();

  // React.useEffect(() => {
  //   refetch();
  // }, [refetch, router.asPath, query]);

  const leaveForms = () => {
    if (leaveFormsQuery.data?.success) {
      return leaveFormsQuery.data.data.map((leaveForms) => ({ ...leaveForms }));
    }
    return [];
  };

  const approveLeaveForm = (id) => {
    leaveFormUpdateMutation
      .mutateAsync({ id, isApproved: true })
      .then(() => {
        toast({
          title: "Leave From approved!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        leaveFormsQuery.refetch();
      })
      .catch(() => {
        toast({
          title: "Error in approving Leave From!",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const deleteLeaveForm = () => {
    leaveFormDeleteMutation
      .mutateAsync(toDelete)
      .then(() => {
        toast({
          title: "Leave From deleted!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        leaveFormsQuery.refetch();
        onClose();
      })
      .catch(() => {
        toast({
          title: "Error in deleting Leave From!",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      });
  };

  return (
    <>
      {/* <Flex
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
            console.log("submit");
            dispatchQuery({
              limit: 10,
              search,
            });
          }}
        >
          <FormControl id="emp-name">
            <FormLabel>Search with employee name</FormLabel>
            <Input
              placeholder="employee name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              w="500px"
            />
          </FormControl>
        </Box>
        <Button
          as="a"
          href="/api/users/download-csv"
          leftIcon={<CgSoftwareDownload />}
        >
          Export Employees List
        </Button>
      </Flex> */}

      <Table>
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Code</Th>
            <Th>Employee Name</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
            <Th>Total Leave Days Count</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {leaveForms().map((leaveForm, idx) => (
            <Tr key={leaveForm.id}>
              <Td>{idx + 1}</Td>
              <Td>{leaveForm.code}</Td>
              <Td>{leaveForm.employee.name}</Td>
              <Td>
                {leaveForm.leaveStartDate
                  ? format(new Date(leaveForm.leaveStartDate), dateFormatStr)
                  : ""}
              </Td>
              <Td>
                {leaveForm.leaveEndDate
                  ? format(new Date(leaveForm.leaveEndDate), dateFormatStr)
                  : ""}
              </Td>
              <Td>
                {differenceInDays(
                  new Date(leaveForm.leaveEndDate),
                  new Date(leaveForm.leaveStartDate)
                ) + 1}
              </Td>
              <Td>
                <Stack>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="green"
                    leftIcon={<CgCheck />}
                    onClick={() => approveLeaveForm(leaveForm.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    leftIcon={<CgTrashEmpty />}
                    onClick={() => setToDelete(leaveForm.id || "")}
                  >
                    Delete
                  </Button>
                </Stack>
              </Td>
            </Tr>
          ))}
          {!leaveFormsQuery.data?.success && (
            <Tr>
              <Td>No leave forms found.</Td>
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
              Delete Leave Form
            </AlertDialogHeader>

            <AlertDialogBody>
              {"Are you sure? You can't undo this action afterwards."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteLeaveForm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export { UnApprovedLeavesList };
