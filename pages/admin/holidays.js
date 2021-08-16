import React from "react";
import { isEqual, isAfter, isBefore } from "date-fns";
import queryString from "query-string";
import { DatePickerProvider, useDatePickerState } from "react-hook-pickers";
import { useRouter } from "next/router";
import { CgMathPlus } from "react-icons/cg";
import { Box, Button } from "@chakra-ui/react";

import { getAuth, isAdminLoggedIn } from "../../lib/authHelper";
import { useHolidays } from "../../hooks/useHolidays";
import AdminLayout from "../../layouts/Admin";
import { CreateHoliday } from "../../components/CreateHoliday";
import { Calendar } from "../../components/Calendar";

export async function getServerSideProps({ req }) {
  const { isAdmin, isAuth } = getAuth(req.cookies);
  return { props: { isAuth, isAdmin } };
}

export default function Holidays(props) {
  const router = useRouter();

  React.useEffect(() => {
    if (!isAdminLoggedIn(props)) router.replace("/");
  }, [props, router]);

  const createQueryStr = queryString.parse(router.asPath.split("?")[1]).create;

  const initialDate = new Date();
  const datePickerState = useDatePickerState(initialDate);

  const { holidaysQuery } = useHolidays({
    year: datePickerState.viewDate.getFullYear(),
    month: datePickerState.viewDate.getMonth(),
  });

  const { refetch } = holidaysQuery;
  React.useEffect(() => {
    refetch();
  }, [createQueryStr, refetch]);

  return (
    <AdminLayout>
      <Button
        rightIcon={<CgMathPlus />}
        onClick={() => {
          const query = createQueryStr === "holiday" ? "" : "?create=holiday";
          router.replace(router.pathname, `${router.pathname}${query}`, {
            shallow: true,
          });
        }}
      >
        Create New Holiday
      </Button>

      {createQueryStr === "holiday" ? (
        <Box my="4" w="50%">
          <CreateHoliday />
        </Box>
      ) : null}

      <DatePickerProvider datePickerState={datePickerState}>
        <Calendar
          eventRenderer={(dateString) => {
            return holidaysQuery.data?.data.map((holiday) => {
              const cellDate = new Date(dateString);
              const startDate = new Date(holiday.startDate);
              const endDate = new Date(holiday.endDate);

              return isEqual(cellDate, startDate) ||
                isEqual(cellDate, endDate) ||
                (isAfter(cellDate, startDate) &&
                  isBefore(cellDate, endDate)) ? (
                <Box key={holiday.id} fontSize="10px">
                  {holiday.name}
                </Box>
              ) : null;
            });
          }}
          isHoliday={(dateString) => {
            return holidaysQuery.data?.data.map((holiday) => {
              const cellDate = new Date(dateString);
              const startDate = new Date(holiday.startDate);
              const endDate = new Date(holiday.endDate);

              return (
                isEqual(cellDate, startDate) ||
                isEqual(cellDate, endDate) ||
                (isAfter(cellDate, startDate) && isBefore(cellDate, endDate))
              );
            })[0];
          }}
        />
      </DatePickerProvider>
    </AdminLayout>
  );
}
