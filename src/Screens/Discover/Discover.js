import React, { useContext, useEffect, useState } from 'react';
import { Box, Center, FlatList, Pressable, Spinner, Text, VStack } from '@gluestack-ui/themed';

import BookList from '../../Components/BookList';
import { call } from '../../utils/functions';
import AvatarWithUsername from '../../Components/AvatarWithUsername';
import { StateContext } from '../../StateContext';

export default function Discover({ navigation }) {
  const [state, setState] = useState({
    books: [],
    users: [],
    isLoading: true,
  });

  const { currentUser } = useContext(StateContext);

  useEffect(() => {
    getData();
  }, [currentUser]);

  const { books, users, isLoading } = state;

  const getData = async () => {
    try {
      const respondBooks = await call('getBooksNearBy');
      const respondUsers = await call('getUsersNearBy');

      respondBooks &&
        respondUsers &&
        setState({
          ...state,
          books: respondBooks,
          users: respondUsers,
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
      <FlatList
        data={users}
        horizontal
        px="$2"
        py="$1"
        renderItem={({ item }) => {
          const u = item;
          return (
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
          );
        }}
      />
    </Box>
  );
}
