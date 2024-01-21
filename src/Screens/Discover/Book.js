import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Button, ButtonText, Text, useToast } from '@gluestack-ui/themed';

import BookCard from '../../Components/BookCard';
import ConfirmDialog from '../../Components/ConfirmDialog';
import Toast from '../../Components/Toast';
import { call } from '../../utils/functions';

export default function Book({ route, navigation }) {
  const [state, setState] = useState({
    isRequestModalOpen: false,
  });
  const toast = useToast();

  const { book } = route.params;
  const { isRequestModalOpen } = state;

  const makeRequest = async () => {
    try {
      await call('makeRequest', book._id);
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message="The book is requested from the owner" />,
      });
      setState({
        ...state,
        isRequestModalOpen: false,
      });
    } catch (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast action="error" nativeId={id} message={error?.message} title="Error" />
        ),
      });
    }
  };

  return (
    <ScrollView>
      <BookCard book={book} navigation={navigation}>
        <Box bg="$lime100" p="$4">
          <Button
            bg="$lime500"
            borderRadius="$full"
            type="submit"
            onPress={() => setState({ ...state, isRequestModalOpen: true })}
          >
            <ButtonText>{`Borrow from ${book.ownerUsername}`}</ButtonText>
          </Button>
        </Box>
      </BookCard>

      <ConfirmDialog
        isOpen={isRequestModalOpen}
        header="Are you sure?"
        onClose={() => setState({ ...state, isRequestModalOpen: false })}
        onConfirm={() => makeRequest()}
      >
        <Text>{`Please confirm that you want to borrow this book. When you confirm, there will be a new message section opening a new dialogue with ${book.ownerUsername}. So you can communicate with them about the details of receiving the book.`}</Text>
      </ConfirmDialog>
    </ScrollView>
  );
}
