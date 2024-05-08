import Meteor from '@meteorrn/core';
import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonText,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  CheckIcon,
  Heading,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import { policyEn, termsEn } from '../../utils/policies';

export default function Register() {
  const [state, setState] = useState({
    isLoading: false,
    isTermsOpen: false,
    isTermsChecked: false,
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
      Meteor.loginWithPassword(username, password, (err, respond) => {
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

  const { isLoading, isTermsChecked, isTermsOpen } = state;

  return (
    <>
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

        <Box>
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

        <Checkbox
          aria-label={i18n.t('auth.termsAndConditions')}
          isChecked={isTermsChecked}
          mb="$2"
          pr="$4"
          size="md"
          onChange={(isChecked) =>
            isChecked
              ? setState({ ...state, isTermsOpen: true })
              : setState({ ...state, isTermsChecked: false })
          }
        >
          <CheckboxIndicator borderColor="$coolGray600" mr="$2">
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
          <CheckboxLabel color="$coolGray900" size="sm">
            {i18n.t('auth.termsAndConditions')}
          </CheckboxLabel>
        </Checkbox>

        <Button
          bg="$green500"
          borderRadius="$full"
          isDisabled={!isTermsChecked}
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
          type="submit"
        >
          <ButtonText>{i18n.t('generic.submit')}</ButtonText>
        </Button>
      </VStack>

      <Modal isOpen={isTermsOpen} maxHeight="75%" my="$24" size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>{i18n.t('auth.termsAndConditionsTitle')}</Heading>
          </ModalHeader>

          <ModalBody>
            <Heading mb="$2" size="sm">
              {i18n.t('auth.termsTitle')}
            </Heading>
            <Text size="sm">{termsEn}</Text>

            <Heading mb="$2" mt="$4" size="sm">
              {i18n.t('auth.privacyPolicy')}
            </Heading>

            <Text size="sm">{policyEn}</Text>
          </ModalBody>

          <ModalFooter>
            <Button
              mr="$4"
              size="sm"
              variant="outline"
              onPress={() => setState({ ...state, isTermsChecked: false, isTermsOpen: false })}
            >
              <ButtonText>{i18n.t('generic.disagree')}</ButtonText>
            </Button>
            <Button
              size="sm"
              onPress={() => setState({ ...state, isTermsChecked: true, isTermsOpen: false })}
            >
              <ButtonText>{i18n.t('generic.agree')}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
