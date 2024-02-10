import Meteor from '@meteorrn/core';
import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonText,
  Heading,
  Input,
  InputField,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import { useForm, Controller } from 'react-hook-form';

import { call } from '../../utils/functions';
import { i18n } from '../../../i18n';

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
      username: '',
      password: '',
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
      await call('registerUser', values);
      Meteor.loginWithPassword(username, password, (error, respond) => {
        toast.show({
          placement: 'top',
          render: ({ id }) => {
            return (
              <Toast nativeId={id} action="success" variant="solid">
                <VStack space="xs">
                  <ToastTitle>{i18n.t('generic.success')}</ToastTitle>
                  <ToastDescription>{i18n.t('auth.accountCreated')}</ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
      });
    } catch (error) {
      console.log(error);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast nativeId={id} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>{i18n.t('generic.error')}</ToastTitle>
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

  const { isLoading } = state;

  return (
    <Box p="$4">
      <Heading textAlign="center">{i18n.t('auth.registerTitle')}</Heading>
      <VStack space="md" py="$2">
        <Box>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text size="sm">{i18n.t('auth.username')}</Text>
                <Input bg="$white" variant="rounded">
                  <InputField
                    mb="$1"
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
            <Text color="$red500" mt="$1" size="sm">
              {i18n.t('auth.usernameRequiredMessage')}
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
                <Text size="sm">{i18n.t('auth.email')}</Text>
                <Input bg="$white" variant="rounded">
                  <InputField
                    mb="$1"
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
              {i18n.t('auth.usernameRequiredMessage')}
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
                <Text size="sm">{i18n.t('auth.password')}</Text>
                <Input bg="$white" variant="rounded">
                  <InputField
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
              {i18n.t('auth.passwordRequiredMessage')}
            </Text>
          )}
        </Box>

        <Button
          bg="$green500"
          borderRadius="$full"
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
          type="submit"
        >
          <ButtonText>{i18n.t('generic.submit')}</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
