import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, ButtonText, Text, useToast } from '@gluestack-ui/themed';

import BookForm from '../../Components/BookForm';
import ConfirmDialog from '../../Components/ConfirmDialog';
import Toast from '../../Components/Toast';
import { call } from '../../utils/functions';
import { BooksContext } from '../../StateContext';

export default function MyBookEdit({ route, navigation }) {
  const { book } = route.params;
  const [state, setState] = useState({
    deleteDialogOpen: false,
  });
  const { getMyBooks } = useContext(BooksContext);
  const toast = useToast();

  const { deleteDialogOpen } = state;

  const handleDelete = async () => {
    try {
      await call('removeBook', book._id);
      await getMyBooks();
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast nativeId={id} message="Book is deleted from you virtual shelf" />
        ),
      });
      navigation.navigate('Profile');
    } catch (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast action="error" nativeId={id} message={error.message} title="Error" />
        ),
      });
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <BookForm book={book} navigation={navigation} />
      <Button
        action="negative"
        mt={-180}
        size="sm"
        variant="link"
        onPress={() => setState({ ...state, deleteDialogOpen: true })}
      >
        <ButtonText>Delete this book</ButtonText>
      </Button>

      <ConfirmDialog
        header="Are you sure?"
        isOpen={deleteDialogOpen}
        onClose={() => setState({ ...state, deleteDialogOpen: false })}
        onConfirm={() => handleDelete()}
      >
        <Text>Please confirm that you want to delete this book from your shelf.</Text>
      </ConfirmDialog>
    </ScrollView>
  );
}
