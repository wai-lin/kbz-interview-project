import React from "react";
import { useRouter } from "next/router";
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

const createUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Incorrect email format." })
    .min(1, { message: "Email is required." }),
  password: z.string().min(3, { message: "Must be at least 3 characters." }),
});

function CreateNewUser() {
  const router = useRouter();

  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const createUser = useMutation((user) =>
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(user),
    }).then((res) => res.json())
  );

  const submitHandler = (user) => {
    createUser
      .mutateAsync(user)
      .then(({ data, success }) => {
        if (success && data !== null) {
          router.replace(
            router.pathname,
            `${router.pathname}?create=emp&uid=${data.id}`,
            {
              shallow: true,
            }
          );
        }
      })
      .catch(console.log);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(submitHandler)}>
      <Stack direction="column" spacing="4">
        <FormControl id="email" isInvalid={formState.errors?.email?.message}>
          <FormLabel>Email</FormLabel>
          <FormHelperText>eg. harry@gmail.com</FormHelperText>
          <Input type="email" {...register("email")} autoFocus />
          <FormErrorMessage>
            {formState.errors?.email?.message || ""}
          </FormErrorMessage>
        </FormControl>

        <FormControl
          id="password"
          isInvalid={formState.errors?.password?.message}
        >
          <FormLabel>Password</FormLabel>
          <FormHelperText>New secure password.</FormHelperText>
          <Input type="password" {...register("password")} />
          <FormErrorMessage>
            {formState.errors?.password?.message || ""}
          </FormErrorMessage>
        </FormControl>

        <Button type="submit" isLoading={createUser.isLoading}>
          Create New User
        </Button>
      </Stack>
    </Box>
  );
}

export { CreateNewUser };
