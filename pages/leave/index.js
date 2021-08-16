import React from "react";
import styled from "@emotion/styled";
import queryString from "query-string";
import { DatePickerProvider, useDatePickerState } from "react-hook-pickers";
import { isAfter, isBefore, isEqual } from "date-fns";
import { useRouter } from "next/router";
import { Box, Button, Text, Tooltip } from "@chakra-ui/react";

import { getAuth, isUserLoggedIn, getUser } from "../../lib/authHelper";
import { useEmployeeLeaves } from "../../hooks/useEmployee";
import { useHolidays } from "../../hooks/useHolidays";
import DefaultLayout from "../../layouts/Default";
import { Calendar } from "../../components/Calendar";
import { CreateLeave } from "../../components/CreateLeave";

const DateCellEvent = styled(Tooltip)({
  borderRadius: "0.2rem",
  padding: "0 4px",
  fontSize: "10px",
  width: "100%",
});

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

  const initialDate = new Date();
  const datePickerState = useDatePickerState(initialDate);

  const { holidaysQuery } = useHolidays({
    year: datePickerState.viewDate.getFullYear(),
    month: datePickerState.viewDate.getMonth(),
  });

  const getLeaveDates = () => {
    if (employeeLeavesQuery.data?.success) {
      return employeeLeavesQuery.data?.data?.leaveForms;
    }
    return [];
  };

  const leaveDayRenderer = (dateString) => {
    return getLeaveDates().map(
      ({ id, code, leaveStartDate, leaveEndDate, reason, isApproved }) => {
        const cellDate = new Date(dateString);
        const startDate = new Date(leaveStartDate);
        const endDate = new Date(leaveEndDate);

        return isEqual(cellDate, startDate) ||
          (isAfter(cellDate, startDate) && isBefore(cellDate, endDate)) ||
          isEqual(cellDate, endDate) ? (
          <DateCellEvent
            key={id}
            isTruncated
            label={code}
            aria-label={`Leave Form code is ${code}.`}
          >
            <Text
              fontSize="10px"
              w="full"
              px="2px"
              rounded="sm"
              bg={isApproved ? "lightsalmon" : "salmon"}
              isTruncated
            >
              {reason}
            </Text>
          </DateCellEvent>
        ) : null;
      }
    );
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

      <DatePickerProvider datePickerState={datePickerState}>
        <Calendar
          eventRenderer={(dateString) => {
            const holidays = holidaysQuery.data?.data.map((holiday) => {
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
            const leaveDays = leaveDayRenderer(dateString);
            return holidays ? [...holidays, ...leaveDays] : [...leaveDays];
          }}
          isHoliday={(dateString) => {
            return holidaysQuery.data?.data
              .map((holiday) => {
                const cellDate = new Date(dateString);
                const startDate = new Date(holiday.startDate);
                const endDate = new Date(holiday.endDate);

                return isEqual(cellDate, startDate) ||
                  isEqual(cellDate, endDate) ||
                  (isAfter(cellDate, startDate) && isBefore(cellDate, endDate))
                  ? true
                  : false;
              })
              .reduce((curr, acc) => curr || acc, false);
          }}
        />
      </DatePickerProvider>
    </DefaultLayout>
  );
}
