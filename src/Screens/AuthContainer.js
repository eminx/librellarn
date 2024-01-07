import React, { useState } from 'react';
import { View } from 'react-native';
import { Box, ButtonGroup, Button, ButtonText, Center } from '@gluestack-ui/themed';

import Login from './Login';
import Register from './Register';

const tabs = ['Register', 'Login'];

export default function AuthContainer() {
  const [state, setState] = useState({
    selectedTab: 'Register',
  });

  const { selectedTab } = state;

  const buttonProps = {
    borderBottomWidth: '2px',
    borderRadius: '0',
    px: '$2',
    variant: 'link',
  };

  return (
    <View>
      <Box bg="$gray200" h="100%">
        <Center mt="$8">
          <ButtonGroup>
            <Button
              {...buttonProps}
              borderBottomColor={selectedTab === 'Register' ? '$blue600' : '$white'}
              onPress={() => setState({ ...state, selectedTab: 'Register' })}
            >
              <ButtonText>Register</ButtonText>
            </Button>
            <Button
              {...buttonProps}
              borderBottomColor={selectedTab === 'Login' ? '$blue600' : '$white'}
              onPress={() => setState({ ...state, selectedTab: 'Login' })}
            >
              <ButtonText>Login</ButtonText>
            </Button>
          </ButtonGroup>
        </Center>

        <Box>{selectedTab === 'Register' && <Register />}</Box>

        <Box>{selectedTab === 'Login' && <Login />}</Box>
      </Box>
    </View>
  );
}
