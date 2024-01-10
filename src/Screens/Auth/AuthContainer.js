import React, { useState } from 'react';
import {
  Box,
  ButtonGroup,
  Button,
  ButtonText,
  Center,
  Image,
  ScrollView,
} from '@gluestack-ui/themed';

import Login from './Login';
import Register from './Register';
import { mainLogo } from '../../../assets';

export default function AuthContainer() {
  const [state, setState] = useState({
    selectedTab: 'Register',
  });

  const { selectedTab } = state;

  const buttonProps = {
    borderRadius: '$full',
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
      </Box>
    </ScrollView>
  );
}
