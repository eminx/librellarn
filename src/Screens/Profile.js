import Meteor from '@meteorrn/core';
import React, { useContext } from 'react';
import { Button, ButtonText, Center, HStack } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';

import MyBooks from '../Components/MyBooks';
import About from '../Components/About';
import { StateContext } from '../StateContext';

export default function Profile({ navigation }) {
  const { currentUser } = useContext(StateContext);
  const logout = () => {
    Meteor.logout();
  };

  return (
    <ScrollView>
      <Center m="$2">
        <HStack space="lg">
          <Button
            variant="link"
            onPress={() => navigation.navigate('Edit Profile', { currentUser })}
          >
            <ButtonText>Edit</ButtonText>
          </Button>

          <Button variant="link" onPress={logout}>
            <ButtonText>Log out</ButtonText>
          </Button>
        </HStack>
      </Center>

      <About user={currentUser} />

      <MyBooks navigation={navigation} />
    </ScrollView>
  );
}
