import React, { useState } from 'react';
import {
  Box,
  ButtonGroup,
  Button,
  ButtonText,
  Center,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  useToast,
} from '@gluestack-ui/themed';

import Login from './Login';
import Register from './Register';
import { mainLogo } from '../../../assets';
import Input from '../../Components/Input';
import ConfirmDialog from '../../Components/ConfirmDialog';
import Toast from '../../Components/Toast';
import { call } from '../../utils/functions';

export default function AuthContainer() {
  const [state, setState] = useState({
    emailForReset: '',
    forgotPasswordModal: false,
    selectedTab: 'Register',
    emailSent: false,
  });
  const toast = useToast();

  const { emailForReset, emailSent, forgotPasswordModal, selectedTab } = state;

  const buttonProps = {
    borderRadius: '$full',
  };

  const handleForgotPassword = async () => {
    try {
      await call('resetUserPassword', emailForReset);
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast nativeId={id} message="You will now receive a link to reset your password" />
        ),
      });
      setState({
        ...state,
        emailSent: true,
        forgotPasswordModal: false,
      });
    } catch (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast
            action="error"
            nativeId={id}
            message="You will now receive a link to reset your password"
          />
        ),
      });
    }
  };

  return (
    <ScrollView bg="$coolGray900">
      <Center pt="$8">
        <Image source={mainLogo} alt="logo" w={100} h={120} resizeMode="contain" />
      </Center>
      <Box h="100%" px="$4" pb={200}>
        <Center py="$4">
          <ButtonGroup size="sm">
            <Button
              {...buttonProps}
              variant={selectedTab === 'Register' ? 'solid' : 'outline'}
              onPress={() => setState({ ...state, selectedTab: 'Register' })}
            >
              <ButtonText color="$white">Register</ButtonText>
            </Button>
            <Button
              {...buttonProps}
              variant={selectedTab === 'Login' ? 'solid' : 'outline'}
              onPress={() => setState({ ...state, selectedTab: 'Login' })}
            >
              <ButtonText color="$white">Login</ButtonText>
            </Button>
          </ButtonGroup>
        </Center>

        <Box bg="#B3E8FF" rounded="$md" px="$4">
          <Box>{selectedTab === 'Register' && <Register />}</Box>
          <Box>{selectedTab === 'Login' && <Login />}</Box>
        </Box>

        <Box p="$4">
          <Button variant="link" onPress={() => setState({ ...state, forgotPasswordModal: true })}>
            <ButtonText color="$blue300">Forgot Password?</ButtonText>
          </Button>
        </Box>
        <ConfirmDialog
          isOpen={forgotPasswordModal}
          header="Enter your email"
          onClose={() => setState({ ...state, forgotPasswordModal: false })}
          onConfirm={() => handleForgotPassword()}
        >
          <Text mb="$4">You will receive an email with a link to reset your password.</Text>
          <Input
            type="email"
            value={emailForReset}
            onChangeText={(value) => setState({ ...state, emailForReset: value?.toLowerCase() })}
            onPressCloseIcon={() => setState({ ...state, emailForReset: '' })}
          />
        </ConfirmDialog>
      </Box>
    </ScrollView>
  );
}
