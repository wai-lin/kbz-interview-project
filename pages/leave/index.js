import React from "react";
import queryString from "query-string";
import { useRouter } from "next/router";
import { Box, Button } from "@chakra-ui/react";

import { getAuth, isUserLoggedIn, getUser } from "../../lib/authHelper";
import DefaultLayout from "../../layouts/Default";
import { Calendar } from "../../components/Calendar";
import { CreateLeave } from "../../components/CreateLeave";
import { useEmployeeLeaves } from "../../hooks/useEmployee";

export async function getServerSideProps({ req }) {
  const { isAdmin, isAuth } = getAuth(req.cookies);
  return { props: { isAdmin, isAuth } };
}

export default function Leave(props) {
  const router = useRouter();
  const loggedInUser = getUser();

  React.useEffect(() => {
    if (!isUserLoggedIn(props)) router.replace("/");
  }, [props, router]);

  const createQueryStr = queryString.parse(router.asPath.split("?")[1]).create;

  const { employeeLeavesQuery } = useEmployeeLeaves({
    employeeId: loggedInUser?.employee?.id,
    year: new Date().getFullYear(),
  });

  const { refetch } = employeeLeavesQuery;

  React.useEffect(() => {
    refetch();
  }, [createQueryStr, refetch]);

  const getLeaveDates = () => {
    if (employeeLeavesQuery.data?.success) {
      return employeeLeavesQuery.data?.data?.leaveForms;
    }
    return [];
  };

  return (
    <DefaultLayout>
      <Button
        onClick={() => {
          const query = createQueryStr === "leave" ? "" : "?create=leave";
          router.replace(`${router.pathname}${query}`);
        }}
      >
        Apply Leave
      </Button>
      {createQueryStr === "leave" && (
        <Box w="500px" my="4">
          <CreateLeave />
        </Box>
      )}
      <Calendar leaveDates={getLeaveDates()} />
    </DefaultLayout>
  );
}
