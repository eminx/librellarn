import React, { useState } from 'react';
import {
  Box,
  ButtonGroup,
  Button,
  ButtonText,
  Center,
  Image,
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
import { i18n } from '../../../i18n';

export default function AuthContainer() {
  const [state, setState] = useState({
    emailForReset: '',
    forgotPasswordModal: false,
    selectedTab: 'Register',
    isConfirmResetPasswordButtonLoading: false,
  });
  const toast = useToast();

  const { emailForReset, isConfirmResetPasswordButtonLoading, forgotPasswordModal, selectedTab } =
    state;

  const buttonProps = {
    borderRadius: '$full',
  };

  const handleForgotPassword = async () => {
    setState({
      ...state,
      isConfirmResetPasswordButtonLoading: true,
    });
    try {
      await call('resetUserPassword', emailForReset);
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message={i18n.t('auth.resetPasswordMessage')} />,
      });
      setState({
        ...state,
        isConfirmResetPasswordButtonLoading: false,
        forgotPasswordModal: false,
      });
    } catch (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast action="error" nativeId={id} />,
      });
      setState({
        ...state,
        isConfirmResetPasswordButtonLoading: false,
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
              <ButtonText color="$white">{i18n.t('auth.register')}</ButtonText>
            </Button>
            <Button
              {...buttonProps}
              variant={selectedTab === 'Login' ? 'solid' : 'outline'}
              onPress={() => setState({ ...state, selectedTab: 'Login' })}
            >
              <ButtonText color="$white">{i18n.t('auth.login')}</ButtonText>
            </Button>
          </ButtonGroup>
        </Center>

        <Box bg="#B3E8FF" rounded="$md" px="$4">
          <Box>{selectedTab === 'Register' && <Register />}</Box>
          <Box>{selectedTab === 'Login' && <Login />}</Box>
        </Box>

        <Box p="$4">
          <Button variant="link" onPress={() => setState({ ...state, forgotPasswordModal: true })}>
            <ButtonText color="$blue300">{i18n.t('auth.forgotPassword')}</ButtonText>
          </Button>
        </Box>
        <ConfirmDialog
          isOpen={forgotPasswordModal}
          isConfirmButtonLoading={isConfirmResetPasswordButtonLoading}
          header={i18n.t('auth.resetPassword')}
          onClose={() => setState({ ...state, forgotPasswordModal: false })}
          onConfirm={() => handleForgotPassword()}
        >
          <Text mb="$4">{i18n.t('auth.forgotPasswordMessage')}</Text>
          <Text fontWeight="bold" mb="$2">
            {i18n.t('auth.typeEmail')}
          </Text>
          <Input
            placeholder={i18n.t('auth.email')}
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
