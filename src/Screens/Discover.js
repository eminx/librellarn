import React, { useEffect, useState } from 'react';
import Meteor from '@meteorrn/core';

import BookList from '../Components/BookList';
import {
  Avatar,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { call } from '../utils/functions';

export default function Discover({ navigation }) {
  const [state, setState] = useState({
    books: [],
    isLoading: true,
    usersNearBy: [],
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Meteor.call('getDiscoverBooks', (error, respond) => {
      if (error) {
        setState({
          ...state,
          isLoading: false,
        });
      }
      setState({
        ...state,
        books: respond,
        isLoading: false,
      });
    });
  };

  const getUsersNearBy = async () => {
    try {
      const respond = await call('getUsersNearBy');
      setState({
        ...state,
        usersNearBy: respond,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { books, isLoading, usersNearBy } = state;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Button m="$4" onPress={() => getUsersNearBy()}>
        <ButtonText>Get users around</ButtonText>
      </Button>
      <ScrollView horizontal>
        <HStack pb="$8" px="$2">
          {usersNearBy?.length > 0 &&
            usersNearBy.map((u) => (
              <Box key={u.userId} p="$2">
                <VStack>
                  <Center>
                    <Avatar bgColor="$amber400" borderRadius="$full">
                      <AvatarImage alt={u.username} source={{ uri: u.userImage }} />
                    </Avatar>
                  </Center>
                  <Center>
                    <Text textAlign="center">{u.username}</Text>
                  </Center>
                </VStack>
              </Box>
            ))}
        </HStack>
      </ScrollView>
      <BookList books={books} navigation={navigation} navigateTo="Book" />
    </Box>
  );
}
