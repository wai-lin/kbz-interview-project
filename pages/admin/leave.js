import React from "react";
import { useRouter } from "next/router";

import { getAuth, isAdminLoggedIn } from "../../lib/authHelper";
import AdminLayout from "../../layouts/Admin";
import { LeavesFormList } from "../../components/LeaveFormsList";

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
      <LeavesFormList />
    </AdminLayout>
  );
}
