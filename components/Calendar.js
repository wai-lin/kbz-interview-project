import React from "react";
import styled from "@emotion/styled";
import { useDatePicker, useDatePickerState } from "react-hook-pickers";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

const dateCellStyle = {
  flexDirection: "column",
  w: "full",
  h: "full",
  p: "2",
  alignItems: "flex-end",
  justifyContent: "flex-start",
  border: "1px",
  borderColor: "gray.100",
};

const DateCellEvent = styled(Box)({
  borderRadius: "0.2rem",
  padding: "0 4px",
  fontSize: "10px",
});

function Calendar(props) {
  const initialDate = new Date();
  const datePickerState = useDatePickerState(initialDate);
  const { getCalendarProps, getCalendarViewControllers } =
    useDatePicker(datePickerState);

  const {
    daysOfWeek,
    fillUpDatesOfPrevMonthBtnProps,
    datesOfMonthBtnProps,
    fillUpDatesOfNextMonthBtnProps,
  } = getCalendarProps();

  const { goToPrevMonth, goToToday, goToNextMonth } =
    getCalendarViewControllers();

  const leaveDayRenderer = (dateString) => {
    return props.leaveDates.map(
      ({ id, leaveStartDate, leaveEndDate, reason }) => {
        const cellDate = new Date(dateString);
        const startDate = new Date(leaveStartDate);
        const endDate = new Date(leaveEndDate);

        return isEqual(cellDate, startDate) ||
          (isAfter(cellDate, startDate) && isBefore(cellDate, endDate)) ||
          isEqual(cellDate, endDate) ? (
          <DateCellEvent key={id} bg="lightsalmon" w="full" isTruncated>
            {reason}
          </DateCellEvent>
        ) : null;
      }
    );
  };

  return (
    <Box w="700px" mt="4">
      <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h3" size="md">
          {format(datePickerState.viewDate, "MMMM, yyyy")}
        </Heading>
        <Stack direction="row" spacing="2">
          <IconButton icon={<CgChevronLeft />} onClick={goToPrevMonth} />
          <Button onClick={goToToday}>Today</Button>
          <IconButton icon={<CgChevronRight />} onClick={goToNextMonth} />
        </Stack>
      </Flex>
      <Grid
        templateColumns="repeat(7, 100px)"
        autoRows="100px"
        placeItems="stretch"
      >
        {/* Days */}
        {daysOfWeek.map((day) => (
          <Flex
            key={day.DDDD}
            {...dateCellStyle}
            alignItems="flex-end"
            justifyContent="flex-end"
            border="0 0 1px 0"
            color={day.D === "S" ? "red.500" : ""}
          >
            <Text>{day.DDD}</Text>
          </Flex>
        ))}
        {/* Prev Month */}
        {fillUpDatesOfPrevMonthBtnProps().map(
          ({ key, isToday, isSelected, dateString, children, ...date }) => (
            <Flex
              key={key}
              {...dateCellStyle}
              color="gray.400"
              borderColor={isToday ? "gray.400" : "gray.100"}
              {...date}
            >
              {children}
            </Flex>
          )
        )}
        {datesOfMonthBtnProps().map(
          ({
            key,
            day,
            isToday,
            isSelected,
            dateString,
            children,
            onClick,
            ...date
          }) => (
            <Flex
              key={key}
              {...dateCellStyle}
              experimental_spaceY="1px"
              color={day === 0 || day === 6 ? "red.500" : ""}
              borderColor={isToday ? "purple.400" : "gray.100"}
              {...date}
            >
              {children}
              {leaveDayRenderer(dateString)}
            </Flex>
          )
        )}
        {fillUpDatesOfNextMonthBtnProps().map(
          ({ key, isToday, isSelected, dateString, children, ...date }) => (
            <Flex
              key={key}
              {...dateCellStyle}
              color="gray.400"
              borderColor={isToday ? "gray.400" : "gray.100"}
              {...date}
            >
              {children}
            </Flex>
          )
        )}
      </Grid>
    </Box>
  );
}

export { Calendar };
