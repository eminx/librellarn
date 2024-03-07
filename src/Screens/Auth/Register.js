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
import { policyEn, privacyEn } from '../../utils/policies';
import RenderHTML from 'react-native-render-html';

export default function Register({ setUser }) {
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
            I have read and accept the Terms of Service, End User Licence Agreement, and Privacy
            Policy
          </CheckboxLabel>
        </Checkbox>

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

      <Modal isOpen={isTermsOpen} maxHeight="75%" my="$24" size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>EULA & Privacy Policy</Heading>
          </ModalHeader>

          <ModalBody>
            <Heading mb="$2" size="sm">
              End User Licence Agreement
            </Heading>
            <Text size="sm">
              This End-User License Agreement ("EULA") is a legal agreement between you and Emin
              Durak. Our EULA was created by EULA Template for Librella. This EULA agreement governs
              your acquisition and use of our Librella software ("Software") directly from Emin
              Durak or indirectly through a Emin Durak authorized reseller or distributor (a
              "Reseller"). Please read this EULA agreement carefully before completing the
              installation process and using the Librella software. It provides a license to use the
              Librella software and contains warranty information and liability disclaimers. If you
              register for a free trial of the Librella software, this EULA agreement will also
              govern that trial. By clicking "accept" or installing and/or using the Librella
              software, you are confirming your acceptance of the Software and agreeing to become
              bound by the terms of this EULA agreement. If you are entering into this EULA
              agreement on behalf of a company or other legal entity, you represent that you have
              the authority to bind such entity and its affiliates to these terms and conditions. If
              you do not have such authority or if you do not agree with the terms and conditions of
              this EULA agreement, do not install or use the Software, and you must not accept this
              EULA agreement. This EULA agreement shall apply only to the Software supplied by Emin
              Durak herewith regardless of whether other software is referred to or described
              herein. The terms also apply to any Emin Durak updates, supplements, Internet-based
              services, and support services for the Software, unless other terms accompany those
              items on delivery. If so, those terms apply. License Grant Emin Durak hereby grants
              you a personal, non-transferable, non-exclusive licence to use the Librella software
              on your devices in accordance with the terms of this EULA agreement. You are permitted
              to load the Librella software (for example a PC, laptop, mobile or tablet) under your
              control. You are responsible for ensuring your device meets the minimum requirements
              of the Librella software. You are not permitted to: Edit, alter, modify, adapt,
              translate or otherwise change the whole or any part of the Software nor permit the
              whole or any part of the Software to be combined with or become incorporated in any
              other software, nor decompile, disassemble or reverse engineer the Software or attempt
              to do any such things Reproduce, copy, distribute, resell or otherwise use the
              Software for any commercial purpose Allow any third party to use the Software on
              behalf of or for the benefit of any third party Use the Software in any way which
              breaches any applicable local, national or international law use the Software for any
              purpose that Emin Durak considers is a breach of this EULA agreement Intellectual
              Property and Ownership Emin Durak shall at all times retain ownership of the Software
              as originally downloaded by you and all subsequent downloads of the Software by you.
              The Software (and the copyright, and other intellectual property rights of whatever
              nature in the Software, including any modifications made thereto) are and shall remain
              the property of Emin Durak. Emin Durak reserves the right to grant licences to use the
              Software to third parties. Termination This EULA agreement is effective from the date
              you first use the Software and shall continue until terminated. You may terminate it
              at any time upon written notice to Emin Durak. It will also terminate immediately if
              you fail to comply with any term of this EULA agreement. Upon such termination, the
              licenses granted by this EULA agreement will immediately terminate and you agree to
              stop all access and use of the Software. The provisions that by their nature continue
              and survive will survive any termination of this EULA agreement. Governing Law This
              EULA agreement, and any dispute arising out of or in connection with this EULA
              agreement, shall be governed by and construed in accordance with the laws of tr.
            </Text>

            <Heading mb="$2" mt="$4" size="sm">
              Privacy Policy
            </Heading>

            <Text size="sm">{policyEn}</Text>
            {/* <RenderHTML source={{ html: policyEn }} /> */}
          </ModalBody>

          <ModalFooter>
            <Button
              mr="$4"
              variant="outline"
              onPress={() => setState({ ...state, isTermsChecked: false, isTermsOpen: false })}
            >
              <ButtonText>Disagree</ButtonText>
            </Button>
            <Button
              onPress={() => setState({ ...state, isTermsChecked: true, isTermsOpen: false })}
            >
              <ButtonText>Agree</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
