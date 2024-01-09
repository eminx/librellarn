import React, { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarImage,
  Box,
  Center,
  HStack,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';

import BookList from '../../Components/BookList';
import { call } from '../../utils/functions';
import AvatarWithUsername from '../../Components/AvatarWithUsername';

export default function Discover({ navigation }) {
  const [state, setState] = useState({
    books: [],
    users: [],
    isLoading: true,
  });

  useEffect(() => {
    getData();
  }, []);

  const { books, users, isLoading } = state;

  const getData = async () => {
    try {
      const respondUsers = await call('getUsersNearBy');
      const respondBooks = await call('getBooksNearBy');

      setState({
        ...state,
        users: respondUsers,
        books: respondBooks,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <Box p="$4">
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      <UsersNearBy navigation={navigation} users={users} />
      <BookList books={books} navigateTo="DiscoverBook" />
    </>
  );
}

function UsersNearBy({ navigation, users }) {
  if (!users || users.length === 0) {
    return null;
  }
  return (
    <Box bg="$amber50">
      <ScrollView horizontal>
        <HStack p="$2">
          {users.map((u) => (
            <Pressable
              key={u.userId}
              p="$2"
              sx={{ ':active': { bg: '$amber100' } }}
              onPress={() => {
                navigation.navigate('DiscoverUser', {
                  username: u.username,
                });
              }}
            >
              <VStack>
                <AvatarWithUsername image={u.userImage} username={u.username} />
                <Center mt="-$1">
                  <Text size="2xs" textAlign="center">
                    {u.distance.toFixed(2) + ' km'}
                  </Text>
                </Center>
              </VStack>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
}
