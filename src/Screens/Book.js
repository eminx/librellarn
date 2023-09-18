import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Button, ButtonText, Text } from '@gluestack-ui/themed';

import BookCard from '../Components/BookCard';
import ConfirmDialog from '../Components/ConfirmDialog';

export default function Book({ route, navigation }) {
  const [state, setState] = useState({
    isRequestModalOpen: false,
  });
  const { book } = route.params;

  const makeRequest = async () => {
    if (!currentUser) {
      errorDialog('Please create an account');
    }

    try {
      await call('makeRequest', book._id);
      successDialog('Your request is successfully sent!');
      setRequestId(respond);
    } catch (error) {
      errorDialog(error.reason || error.error);
    }
  };

  const { isRequestModalOpen } = state;

  return (
    <ScrollView>
      <BookCard book={book}>
        <Box bg="#fff" p="$4">
          <Button type="submit" onPress={() => setState({ ...state, isRequestModalOpen: true })}>
            <ButtonText>Request to Borrow</ButtonText>
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
