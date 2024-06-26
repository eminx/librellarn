import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, ButtonText, Text, useToast } from '@gluestack-ui/themed';

import BookForm from '../../Components/BookForm';
import ConfirmDialog from '../../Components/ConfirmDialog';
import Toast from '../../Components/Toast';
import { call } from '../../utils/functions';
import { BooksContext } from '../../StateContext';
import { i18n } from '../../../i18n';

export default function MyBookEdit({ route, navigation }) {
  const { book } = route.params;
  const [state, setState] = useState({
    deleteDialogOpen: false,
    isDeleting: false,
  });
  const { getMyBooks } = useContext(BooksContext);
  const toast = useToast();

  const { deleteDialogOpen } = state;

  const handleDelete = async () => {
    try {
      setState({ ...state, isDeleting: true });
      await call('removeBook', book._id);
      await getMyBooks();
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message={i18n.t('profile.bookDeleted')} />,
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
    } finally {
      setState({ ...state, isDeleting: false });
    }
  };

  const { isDeleting } = state;

  return (
    <ScrollView>
      <BookForm book={book} navigation={navigation} />
      <Button
        action="negative"
        isDisabled={isDeleting}
        mt={-180}
        size="sm"
        variant="link"
        onPress={() => setState({ ...state, deleteDialogOpen: true })}
      >
        <ButtonText>{i18n.t('profile.deleteBook')}</ButtonText>
      </Button>

      <ConfirmDialog
        header="Are you sure?"
        isOpen={deleteDialogOpen}
        onClose={() => setState({ ...state, deleteDialogOpen: false })}
        onConfirm={() => handleDelete()}
      >
        <Text>{i18n.t('profile.confirmDelete')}</Text>
      </ConfirmDialog>
    </ScrollView>
  );
}
