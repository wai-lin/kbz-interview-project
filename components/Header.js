import React from "react";
import { useRouter } from "next/router";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { CgLogOut } from "react-icons/cg";

import { logout, getUser } from "../lib/authHelper";

function Header() {
  const router = useRouter();

  const loggedInUser = getUser();

  const title = () => {
    if (router.pathname.includes("/admin/dashboard")) return "Dashboard";
    if (router.pathname.includes("/admin/employee")) return "Employees";
    if (router.pathname.includes("/admin/leave")) return "Leave Forms";
    if (router.pathname.includes("/admin/holidays")) return "Holidays";
    if (router.pathname.includes("/leave")) return loggedInUser?.employee?.name;
    return null;
  };

  return (
    <Flex
      h="full"
      bg="white"
      justifyContent="space-between"
      alignItems="center"
    >
      <Heading as="h4" size="md">
        {title()}
      </Heading>
      <Button
        rightIcon={<CgLogOut />}
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        Logout
      </Button>
    </Flex>
  );
}

export default Header;
