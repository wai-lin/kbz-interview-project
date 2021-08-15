import React from "react";
import { useRouter } from "next/router";
import { Box, Heading } from "@chakra-ui/react";

import { getAuth, isAdminLoggedIn } from "../../lib/authHelper";
import AdminLayout from "../../layouts/Admin";
import { UnApprovedLeavesList } from "../../components/UnApprovedLeavesList";

export async function getServerSideProps({ req }) {
  const { isAdmin, isAuth } = getAuth(req.cookies);
  return { props: { isAuth, isAdmin } };
}

export default function Leave(props) {
  const router = useRouter();

  React.useEffect(() => {
    if (!isAdminLoggedIn(props)) router.replace("/");
  }, [props, router]);

  return (
    <AdminLayout>
      <UnApprovedLeavesList />
    </AdminLayout>
  );
}
