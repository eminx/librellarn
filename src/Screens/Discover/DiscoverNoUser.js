import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonText,
  FlatList,
  Pressable,
  Spinner,
  VStack,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import BookList from '../../Components/BookList';
import { call } from '../../utils/functions';
import AvatarWithUsername from '../../Components/AvatarWithUsername';
import { i18n } from '../../../i18n';

export default function DiscoverNoUser() {
  const [state, setState] = useState({
    books: [],
    users: [],
    isLoading: true,
  });

  const navigation = useNavigation();

  useEffect(() => {
    getData();
  }, []);

  const { books, users, isLoading } = state;

  const getData = async () => {
    try {
      const respondBooks = await call('getAllBooks');
      const respondUsers = await call('getAllUsers');

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

  const authTitle = i18n.t('auth.register') + ' | ' + i18n.t('auth.login');

  return (
    <>
      <AllUsers users={users} />
      <BookList books={books} refresher={getData} />
      <Box bg="$coolGray900" p="$4">
        <Button onPress={() => navigation.navigate('Auth')}>
          <ButtonText>{authTitle}</ButtonText>
        </Button>
      </Box>
    </>
  );
}

function AllUsers({ users }) {
  if (!users || users.length === 0) {
    return null;
  }
  return (
    <Box bg="$amber50" pt="$4">
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
                alert('Please create an account to view this user');
              }}
            >
              <VStack>
                <AvatarWithUsername image={u.userImage} username={u.username} />
              </VStack>
            </Pressable>
          );
        }}
      />
    </Box>
  );
}
