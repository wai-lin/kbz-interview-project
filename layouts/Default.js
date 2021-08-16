import dynamic from "next/dynamic";
import { Grid, GridItem } from "@chakra-ui/react";

import { Sidebar } from "../components/Sidebar";

const HeaderWithNoSsr = dynamic(() => import("../components/Header"), {
  ssr: false,
});

export default function DefaultLayout({ children }) {
  return (
    <Grid
      h="100vh"
      templateRows="60px 1fr 1fr 1fr"
      templateColumns="repeat(5, 1fr)"
    >
      <GridItem
        rowSpan={4}
        colSpan={1}
        bg="lightcoral"
        overflowX="hidden"
        overflowY="auto"
      >
        <Sidebar />
      </GridItem>
      <GridItem
        rowSpan={1}
        colSpan={4}
        bg="white"
        px="4"
        borderBottom="1px"
        borderColor="gray.100"
      >
        <HeaderWithNoSsr />
      </GridItem>
      <GridItem rowSpan={3} colSpan={4} bg="gray.50" p="4" overflow="auto">
        {children}
      </GridItem>
    </Grid>
  );
}
