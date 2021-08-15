import React from "react";
import { useRouter } from "next/router";
import queryString from "query-string";
import { Box, Button } from "@chakra-ui/react";
import { CgMathPlus } from "react-icons/cg";

import AdminLayout from "../../layouts/Admin";
import { getAuth, isAdminLoggedIn } from "../../lib/authHelper";
import { CreateNewUser } from "../../components/CreateNewUser";
import { CreateNewEmployee } from "../../components/CreateNewEmployee";
import { EmployeeList } from "../../components/EmployeeList";

export async function getServerSideProps({ req }) {
  const { isAdmin, isAuth } = getAuth(req.cookies);
  return { props: { isAuth, isAdmin } };
}

export default function Dashboard(props) {
  const router = useRouter();

  React.useEffect(() => {
    if (!isAdminLoggedIn(props)) router.replace("/");
  }, [props, router]);

  const createQueryStr = queryString.parse(router.asPath.split("?")[1]).create;

  return (
    <AdminLayout>
      <Button
        rightIcon={<CgMathPlus />}
        onClick={() =>
          router.replace(
            router.pathname,
            `${router.pathname}${
              createQueryStr === "user" ? "" : "?create=user"
            }`,
            {
              shallow: true,
            }
          )
        }
      >
        Register New Employee
      </Button>
      <Box py="4" w="400px">
        {createQueryStr === "user" ? (
          <CreateNewUser />
        ) : createQueryStr === "emp" ? (
          <CreateNewEmployee />
        ) : null}
      </Box>
      <EmployeeList />
    </AdminLayout>
  );
}
