import React, { useEffect, useState } from 'react';
import { Box, Button, ButtonText, Center, Spinner, Text, useToast } from '@gluestack-ui/themed';

import About from '../../Components/About';
import BookShelf from '../../Components/BookShelf';
import { call } from '../../utils/functions';
import { i18n } from '../../../i18n';
import Toast from '../../Components/Toast';
import ConfirmDialog from '../../Components/ConfirmDialog';

export default function User({ route }) {
  const [state, setState] = useState({
    books: [],
    user: null,
    isBlockModalOn: false,
    isLoading: true,
  });
  const toast = useToast();

  const { username } = route.params;
  const { books, isBlockModalOn, isLoading, user } = state;

  useEffect(() => {
    getData();
  }, [username]);

  const getData = async () => {
    try {
      const respondProfile = await call('getUserProfile', username);
      const respondBooks = await call('getUserBooks', username);
      setState({
        ...state,
        user: respondProfile,
        books: respondBooks,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const blockUser = async () => {
    try {
      await call('blockUser', user._id);
      setState({
        ...state,
        isBlockModalOn: false,
      });
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message={`${username} is blocked`} />,
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
      <About user={user} />
      <Center>
        <Button variant="link" onPress={() => setState({ ...state, isBlockModalOn: true })}>
          <ButtonText color="$red" size="sm">
            {i18n.t('generic.blockUser', { username })}
          </ButtonText>
        </Button>
      </Center>
      <BookShelf books={books} mb={118} navigateTo="DiscoverBook" refresher={getData} />

      <ConfirmDialog
        isOpen={isBlockModalOn}
        header={i18n.t('generic.blockHeader')}
        onClose={() => setState({ ...state, isBlockModalOn: false })}
        onConfirm={() => blockUser()}
      >
        <Text>{i18n.t('generic.blockDescription')}</Text>
      </ConfirmDialog>
    </>
  );
}
