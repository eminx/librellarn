import Meteor from "@meteorrn/core";
import React from "react";
import {
  Box,
  Button,
  ButtonText,
  Input,
  InputField,
  Text,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";

import Toast from "../Components/Toast";

export default function Login() {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    const { username, password } = data;
    Meteor.loginWithPassword(
      username.toLowerCase(),
      password,
      (error, respond) => {
        if (error) {
          console.log(error);
          toast.show({
            placement: "top",
            render: ({ id }) => {
              return (
                <Toast
                  nativeId={id}
                  action="error"
                  title="Error"
                  message={error.reason}
                />
              );
            },
          });
          return;
        }
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast
                nativeId={id}
                title="Success!"
                message="You are logged in"
              />
            );
          },
        });
      }
    );
  };

  return (
    <Box p="$4">
      <VStack space="md">
        <Box>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text size="sm">Username or email address</Text>
                <Input bg="$white" variant="rounded">
                  <InputField
                    // placeholder="username or email address"
                    value={value?.toLowerCase()}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </Input>
              </Box>
            )}
            name="username"
          />
          {errors.username && (
            <Text mt="$1" size="sm">
              Username or email address is required
            </Text>
          )}
        </Box>

        <Box mb="$4">
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text size="sm">Password</Text>
                <Input bg="$white" variant="rounded">
                  <InputField
                    // placeholder="password"
                    value={value}
                    type="password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </Input>
              </Box>
            )}
            name="password"
          />
          {errors.password && (
            <Text mt="$1" size="sm">
              Password is required
            </Text>
          )}
        </Box>

        <Button onPress={handleSubmit(onSubmit)} type="submit">
          <ButtonText>Submit</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
