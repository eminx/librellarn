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

  const { deleteDialogOpen } = state;

  const handleDelete = async () => {
    try {
      await call('removeBook', book._id);
      getMyBooks();
      navigation.navigate('Profile');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <BookForm book={book} navigation={navigation} />
      <Button variant="link" onPress={() => setState({ ...state, deleteDialogOpen: true })}>
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
