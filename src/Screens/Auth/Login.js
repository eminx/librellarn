import Meteor from '@meteorrn/core';
import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Heading,
  Input,
  InputField,
  Text,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import { useForm, Controller } from 'react-hook-form';

import Toast from '../../Components/Toast';
import { i18n } from '../../../i18n';

export default function Login() {
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

  const onSubmit = (data) => {
    setState({ ...state, isLoading: true });
    const { username, password } = data;
    Meteor.loginWithPassword(username.toLowerCase(), password, (error, respond) => {
      if (error) {
        console.log(error);
        toast.show({
          placement: 'top',
          render: ({ id }) => {
            return <Toast nativeId={id} action="error" title="Error" message={error.reason} />;
          },
        });
        setState({ ...state, isLoading: false });
        return;
      }
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return <Toast nativeId={id} title="Success!" message={i18n.t('auth.loggedIn')} />;
        },
      });
    });
  };

  const { isLoading } = state;

  return (
    <>
      <Heading textAlign="center">{i18n.t('auth.loginTitle')}</Heading>
      <VStack space="md" py="$2">
        <Box>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text size="sm">{i18n.t('auth.usernameOrEmail')}</Text>
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
          isDisabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          type="submit"
        >
          {isLoading && <ButtonSpinner mr="$1" />}
          <ButtonText>{i18n.t('generic.submit')}</ButtonText>
        </Button>
      </VStack>
    </>
  );
}
