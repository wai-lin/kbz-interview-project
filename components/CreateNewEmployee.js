import React from "react";
import { useRouter } from "next/router";
import queryString from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "react-query";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

const createEmployeeSchema = z.object({
  name: z.string(),
  nrc: z
    .string()
    .max(30, { message: "No more than 30 characters." })
    .optional(),
  dob: z.string().optional(),
});

function CreateNewEmployee() {
  const router = useRouter();

  const { handleSubmit, register, formState, getValues } = useForm({
    resolver: zodResolver(createEmployeeSchema),
  });

  const createEmployee = useMutation((employee) =>
    fetch("/api/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(employee),
    }).then((res) => res.json())
  );

  const submitHandler = (employee) => {
    const userId = queryString.parse(router.asPath.split("?")[1]).uid;

    createEmployee
      .mutateAsync({ ...employee, userId })
      .then(({ data, success }) => {
        if (success && data !== null) {
          router.replace(router.pathname, router.pathname);
        }
      })
      .catch(console.log);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(submitHandler)}>
      <Stack direction="column" spacing="4">
        <FormControl id="name" isInvalid={formState.errors?.name?.message}>
          <FormLabel>Name</FormLabel>
          <FormHelperText>eg. Harry</FormHelperText>
          <Input {...register("name")} autoFocus />
          <FormErrorMessage>
            {formState.errors?.name?.message || ""}
          </FormErrorMessage>
        </FormControl>

        <FormControl id="nrc" isInvalid={formState.errors?.nrc?.message}>
          <FormLabel>NRC</FormLabel>
          <FormHelperText>eg. 12/TaMaNa(Naing)123456</FormHelperText>
          <Input {...register("nrc")} />
          <FormErrorMessage>
            {formState.errors?.nrc?.message || ""}
          </FormErrorMessage>
        </FormControl>

        <FormControl id="dob" isInvalid={formState.errors?.dob?.message}>
          <FormLabel>Date of Birth</FormLabel>
          <FormHelperText>eg. May 20th, 1980</FormHelperText>
          <Input type="date" {...register("dob")} />
          <FormErrorMessage>
            {formState.errors?.dob?.message || ""}
          </FormErrorMessage>
        </FormControl>

        <Button type="submit" isLoading={createEmployee.isLoading}>
          Create Employee
        </Button>
      </Stack>
    </Box>
  );
}

export { CreateNewEmployee };
