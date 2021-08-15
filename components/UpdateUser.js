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
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { CgEye, CgEyeAlt } from "react-icons/cg";

const updateUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Incorrect email format." })
    .min(1, { message: "Email is required." }),
  password: z.string().min(3, { message: "Must be at least 3 characters." }),
});

function UpdateUser(props) {
  const toast = useToast();

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const { handleSubmit, register, formState, setValue } = useForm({
    resolver: zodResolver(updateUserSchema),
  });

  React.useEffect(() => {
    if (props.user) {
      setValue("email", props.user.email);
      setValue("password", props.user.password);
    }
  }, [props.user, setValue]);

  const updateUser = useMutation((user) =>
    fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(user),
    }).then((res) => res.json())
  );

  const submitHandler = (user) => {
    updateUser
      .mutateAsync({ ...user, id: props.user.id })
      .then(({ data, success }) => {
        if (success && data !== null) {
          toast({
            title: "User updated.",
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
          <FormHelperText>Your secure password.</FormHelperText>

          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              {...register("password")}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                variant="ghost"
                onClick={handleClick}
              >
                {show ? <CgEyeAlt /> : <CgEye />}
              </Button>
            </InputRightElement>
          </InputGroup>

          <FormErrorMessage>
            {formState.errors?.password?.message || ""}
          </FormErrorMessage>
        </FormControl>

        <Button type="submit" isLoading={updateUser.isLoading}>
          Update User
        </Button>
      </Stack>
    </Box>
  );
}

export { UpdateUser };
