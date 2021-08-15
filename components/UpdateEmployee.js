import React from "react";
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
  useToast,
} from "@chakra-ui/react";

const updateEmployeeSchema = z.object({
  name: z.string(),
  nrc: z
    .string()
    .max(30, { message: "No more than 30 characters." })
    .optional(),
  dob: z.string().optional(),
});

function UpdateEmployee(props) {
  const toast = useToast();

  const { handleSubmit, register, formState, setValue } = useForm({
    resolver: zodResolver(updateEmployeeSchema),
  });

  React.useEffect(() => {
    if (props.user) {
      setValue("name", props.user?.employee?.name);
      setValue("nrc", props.user?.employee?.nrc || "");
      setValue("dob", props.user?.employee?.dob || "");
    }
  }, [props.user, setValue]);

  const updateEmployee = useMutation((employee) =>
    fetch("/api/employee", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(employee),
    }).then((res) => res.json())
  );

  const submitHandler = (employee) => {
    updateEmployee
      .mutateAsync({ ...employee, id: props.user?.employee?.id })
      .then(({ data, success }) => {
        if (success && data !== null) {
          toast({
            title: "Updated employee data.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
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
          <Input {...register("name")} />
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

        <Button type="submit" isLoading={updateEmployee.isLoading}>
          Update Employee
        </Button>
      </Stack>
    </Box>
  );
}

export { UpdateEmployee };
