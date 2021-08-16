import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

import { useCreateHoliday } from "../hooks/useHolidays";

const createHolidaySchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty." }),
  startDate: z.string().min(1, { message: "Start date cannot be empty." }),
  endDate: z.string().min(1, { message: "End date cannot be empty." }),
});

function CreateHoliday() {
  const router = useRouter();

  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(createHolidaySchema),
  });

  const { createHolidayMutation } = useCreateHoliday();

  const [endDateMin, setEndDateMin] = React.useState("");

  const submitHandler = (data) => {
    createHolidayMutation
      .mutateAsync(data)
      .then(() => {
        router.replace(router.pathname, router.pathname, { shallow: true });
      })
      .catch(console.log);
  };

  return (
    <Stack
      as="form"
      direction="column"
      spacing="4"
      onSubmit={handleSubmit(submitHandler)}
    >
      <FormControl id="name" isInvalid={formState.errors?.name?.message}>
        <FormLabel>Name</FormLabel>
        <FormHelperText>eg. Thingyan</FormHelperText>
        <Input {...register("name")} />
        <FormErrorMessage>
          {formState.errors?.name?.message || ""}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="start-date"
        isInvalid={formState.errors?.startDate?.message}
      >
        <FormLabel>Start Date</FormLabel>
        <FormHelperText>Holiday start date.</FormHelperText>
        <Input
          type="date"
          {...register("startDate")}
          onChange={(e) => {
            register("startDate").onChange(e);
            setEndDateMin(e.target.value);
          }}
        />
        <FormErrorMessage>
          {formState.errors?.startDate?.message || ""}
        </FormErrorMessage>
      </FormControl>

      <FormControl id="end-date" isInvalid={formState.errors?.endDate?.message}>
        <FormLabel>End Date</FormLabel>
        <FormHelperText>Holiday end date.</FormHelperText>
        <Input type="date" min={endDateMin} {...register("endDate")} />
        <FormErrorMessage>
          {formState.errors?.endDate?.message || ""}
        </FormErrorMessage>
      </FormControl>

      <Button type="submit" isLoading={createHolidayMutation.isLoading}>
        Register Holiday
      </Button>
    </Stack>
  );
}

export { CreateHoliday };
