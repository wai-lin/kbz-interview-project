import React from "react";
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
  Heading,
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
  CgTrashEmpty,
  CgCheck,
  CgChevronLeft,
  CgChevronRight,
  CgSoftwareDownload,
} from "react-icons/cg";

import {
  useLeaveCount,
  useLeaves,
  useUpdateLeave,
  useDeleteLeave,
} from "../hooks/useLeave";

const dateFormatStr = "yyyy-MM-dd";
const initialQuery = {
  skip: 0,
  limit: 10,
  search: "",
};

function queryReducer(state, action) {
  state.skip = action.skip || 0;
  state.limit = action.limit || 10;
  state.search = action.search || "";

  return { ...state };
}

function LeavesFormList() {
  const toast = useToast();

  const [query, dispatchQuery] = React.useReducer(queryReducer, initialQuery);

  const { leaveFormCountQuery } = useLeaveCount({ isApproved: null });
  const { leaveFormsQuery } = useLeaves(query);
  const { leaveFormUpdateMutation } = useUpdateLeave();
  const { leaveFormDeleteMutation } = useDeleteLeave();

  const [toDelete, setToDelete] = React.useState("");
  const onClose = () => setToDelete("");
  const cancelRef = React.useRef();

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

  const [search, setSearch] = React.useState("");
  const totalPages =
    Math.floor(leaveFormCountQuery.data?.data / query.limit) || 0;

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
            <FormLabel>
              Search with code, reason, email, employee name, nrc
            </FormLabel>
            <Input
              placeholder="code, reason, email, employee name, nrc"
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
            href="/api/leave/download-csv"
            leftIcon={<CgSoftwareDownload />}
          >
            Download Leave Report
          </Button>
        </Stack>
      </Flex>

      <Table>
        <Thead>
          <Tr>
            <Th>Code</Th>
            <Th>Employee Name</Th>
            <Th>Reason</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
            <Th>Total Leave Days Count</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {leaveForms().map((leaveForm) => (
            <Tr key={leaveForm.id}>
              <Td>{leaveForm.code}</Td>
              <Td>{leaveForm.employee.name}</Td>
              <Td>{leaveForm.reason}</Td>
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
                  {!leaveForm.isApproved && (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="green"
                      leftIcon={<CgCheck />}
                      onClick={() => approveLeaveForm(leaveForm.id)}
                    >
                      Approve
                    </Button>
                  )}
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
          {(!leaveFormsQuery.data?.success ||
            leaveFormsQuery.data?.data === null ||
            leaveFormsQuery.data?.data.length === 0) && (
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

export { LeavesFormList };
