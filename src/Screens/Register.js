import Meteor from "@meteorrn/core";
import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonText,
  Input,
  InputField,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";

import { call } from "../utils/functions";

export default function Register({ setUser }) {
  const [state, setState] = useState({
    isLoading: false,
  });
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

  const onSubmit = async (data) => {
    const { email, username, password } = data;
    const values = {
      email: email?.toLowerCase(),
      username: username?.toLowerCase(),
      password,
    };

    setState({ ...state, isLoading: true });

    try {
      await call("registerUser", values);
      Meteor.loginWithPassword(username, password, (error, respond) => {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeId={id} action="success" variant="solid">
                <VStack space="xs">
                  <ToastTitle>Success!</ToastTitle>
                  <ToastDescription>Your account is created</ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      });
    } catch (error) {
      console.log(error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeId={id} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>{error.reason}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    } finally {
      setState({ ...state, isLoading: false });
    }
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
                <Text size="sm">Username</Text>
                <Input bg="$white" variant="rounded">
                  <InputField
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

        <Box>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text size="sm">Email address</Text>
                <Input bg="$white" variant="rounded">
                  <InputField
                    value={value?.toLowerCase()}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </Input>
              </Box>
            )}
            name="email"
          />
          {errors.username && (
            <Text color="$red500" mt="$1" size="sm">
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
            <Text color="$red500" mt="$1" size="sm">
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
