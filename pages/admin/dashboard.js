import React from "react";
import { useRouter } from "next/router";
import { Stat, StatLabel, StatNumber, StatGroup } from "@chakra-ui/react";

import AdminLayout from "../../layouts/Admin";
import { getAuth, isAdminLoggedIn } from "../../lib/authHelper";
import { useEmployeesCount } from "../../hooks/useEmployees";
import { useLeaveCount } from "../../hooks/useLeave";

export async function getServerSideProps({ req }) {
  const { isAdmin, isAuth } = getAuth(req.cookies);
  return { props: { isAuth, isAdmin } };
}

export default function Dashboard(props) {
  const router = useRouter();

  React.useEffect(() => {
    if (!isAdminLoggedIn(props)) router.replace("/");
  }, [props, router]);

  const { employeesCountQuery } = useEmployeesCount();
  const { leaveFormCountQuery } = useLeaveCount();

  return (
    <AdminLayout>
      <StatGroup w="50%">
        <Stat>
          <StatLabel>Total Employees</StatLabel>
          <StatNumber>{employeesCountQuery.data?.data}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>UnApproved Leave Forms</StatLabel>
          <StatNumber>{leaveFormCountQuery.data?.data}</StatNumber>
        </Stat>
      </StatGroup>
    </AdminLayout>
  );
}
