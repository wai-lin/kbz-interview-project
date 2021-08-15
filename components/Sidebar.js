import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { CgBoard, CgWorkAlt, CgBox, CgCalendarToday } from "react-icons/cg";

const btnConfig = {
  as: "a",
  variant: "solid",
  justifyContent: "flex-start",
};

function Sidebar() {
  const router = useRouter();

  const highlight = (path) => {
    if (router.pathname.includes(path)) return "purple";
    return "gray";
  };

  return (
    <Box px="2" py="4" w="full" h="full" bg="gray.100">
      <Heading as="h4" size="md" mb="4">
        Employee Leave Form WebApp
      </Heading>

      <Stack direction="column" spacing="2">
        <Link href="/leave" passHref>
          <Button
            {...btnConfig}
            leftIcon={<CgBox />}
            colorScheme={highlight("/leave")}
          >
            Leave Forms
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}

export { Sidebar };
