import React, { useEffect, useState } from 'react';
import Meteor from '@meteorrn/core';
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

import BookList from '../Components/BookList';
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

  const { books, isLoading, usersNearBy } = state;

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
    if (usersNearBy && usersNearBy.length > 0) {
      return;
    }
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {usersNearBy?.length === 0 && (
        <Button m="$2" size="sm" onPress={() => getUsersNearBy()}>
          <ButtonText>See users around</ButtonText>
        </Button>
      )}
      <UsersNearBy usersNearBy={usersNearBy} />
      <BookList books={books} navigation={navigation} navigateTo="Book" />
    </>
  );
}

function UsersNearBy({ usersNearBy }) {
  if (usersNearBy?.length === 0) {
    return null;
  }
  return (
    <Box bg="$amber50">
      <ScrollView horizontal>
        <HStack p="$2">
          {usersNearBy.map((u) => (
            <Box key={u.userId} p="$2">
              <VStack>
                <Center>
                  <Avatar bgColor="$amber400" borderRadius="$full">
                    <AvatarImage alt={u.username} source={{ uri: u.userImage }} />
                  </Avatar>
                </Center>
                <Center>
                  <Text size="xs" textAlign="center">
                    {u.username}
                  </Text>
                </Center>
                <Center>
                  <Text size="2xs" textAlign="center">
                    {u.distance.toFixed(2) + ' km'}
                  </Text>
                </Center>
              </VStack>
            </Box>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
}
