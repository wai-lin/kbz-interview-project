import React from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { format, add } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

import { useCreateLeave } from "../hooks/useLeave";

const leaveFormCreateSchema = z.object({
  leaveStartDate: z
    .string()
    .min(1, { message: "Start date must not be empty!" }),
  leaveEndDate: z.string().min(1, { message: "End date must not be empty!" }),
  reason: z.string().min(1, { message: "Reason must not be empty!" }),
});

const dateFormatStr = "yyyy-MM-dd";

function CreateLeave() {
  const router = useRouter();
  const { leaveFormCreateMutation } = useCreateLeave();

  const { handleSubmit, register, formState, reset } = useForm({
    resolver: zodResolver(leaveFormCreateSchema),
  });

  const startDateMin = add(new Date(), { days: 3 });
  const [endDateMin, setEndDateMin] = React.useState(() =>
    format(startDateMin, dateFormatStr)
  );

  const submitHandler = (data) => {
    const auth = JSON.parse(Cookies.get("auth"));
    const formData = {
      employeeId: auth.employee.id,
      ...data,
    };
    leaveFormCreateMutation
      .mutateAsync(formData)
      .then(() => {
        reset();
        router.replace(router.pathname, router.pathname, { shallow: true });
      })
      .catch(console.log);
  };

  return (
    <Stack as="form" spacing="4" onSubmit={handleSubmit(submitHandler)}>
      <FormControl
        id="start-date"
        isInvalid={formState.errors?.leaveStartDate?.message}
      >
        <FormLabel>Start Date</FormLabel>
        <FormHelperText>eg. 20th May, 2021</FormHelperText>
        <Input
          type="date"
          min={format(startDateMin, dateFormatStr)}
          {...register("leaveStartDate")}
          onChange={(e) => {
            register("leaveStartDate").onChange(e);
            setEndDateMin(e.target.value);
          }}
        />
        <FormErrorMessage>
          {formState.errors?.leaveStartDate?.message || ""}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="end-date"
        isInvalid={formState.errors?.leaveEndDate?.message}
      >
        <FormLabel>End Date</FormLabel>
        <FormHelperText>eg. 20th May, 2021</FormHelperText>
        <Input type="date" min={endDateMin} {...register("leaveEndDate")} />
        <FormErrorMessage>
          {formState.errors?.leaveEndDate?.message || ""}
        </FormErrorMessage>
      </FormControl>

      <FormControl id="reason" isInvalid={formState.errors?.reason?.message}>
        <FormLabel>Reason</FormLabel>
        <FormHelperText>Your reason for applying the leave.</FormHelperText>
        <Input {...register("reason")} />
        <FormErrorMessage>
          {formState.errors?.reason?.message || ""}
        </FormErrorMessage>
      </FormControl>

      <Button type="submit" isLoading={leaveFormCreateMutation.isLoading}>
        Apply Leave Form
      </Button>
    </Stack>
  );
}

export { CreateLeave };
