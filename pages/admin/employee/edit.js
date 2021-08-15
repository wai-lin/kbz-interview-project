import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Stack,
} from "@chakra-ui/react";

import AdminLayout from "../../../layouts/Admin";
import { getAuth, isAdminLoggedIn } from "../../../lib/authHelper";
import { useEmployee } from "../../../hooks/useEmployee";
import { UpdateUser } from "../../../components/UpdateUser";
import { UpdateEmployee } from "../../../components/UpdateEmployee";

export async function getServerSideProps({ req, query }) {
  const { isAdmin, isAuth } = getAuth(req.cookies);
  return { props: { isAuth, isAdmin, query } };
}

export default function Edit(props) {
  const router = useRouter();

  React.useEffect(() => {
    if (!isAdminLoggedIn(props)) router.replace("/");
  }, [props, router]);

  const { employeeQuery } = useEmployee({ userId: props.query.uid });

  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/admin/employee" passHref>
            <BreadcrumbLink>employees</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="#">edit</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">{props.query?.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading as="h3" size="md" my="6">
        Editing Employee {props.query?.name || ""}
      </Heading>

      <Stack direction="column" spacing="4">
        <UpdateUser user={employeeQuery.data?.data} />
        <UpdateEmployee user={employeeQuery.data?.data} />
      </Stack>
    </AdminLayout>
  );
}
