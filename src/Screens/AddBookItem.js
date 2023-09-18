import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Alert,
  AlertIcon,
  AlertText,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  InfoIcon,
  LoaderIcon,
  Text,
  useToast,
} from '@gluestack-ui/themed';

import BookCard from '../Components/BookCard';
import ConfirmDialog from '../Components/ConfirmDialog';
import { call } from '../utils/functions';
import Toast from '../Components/Toast';

export default function AddBookItem({ route }) {
  const [state, setState] = useState({
    isAddModalOpen: false,
    isLoading: false,
  });
  const { book } = route.params;
  const toast = useToast();

  const { isAddModalOpen, isBookAdded, isLoading } = state;

  const insertBook = async () => {
    setState({
      ...state,
      isLoading: true,
      isBookAdded: false,
    });
    try {
      await call('insertBook', book);
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message="Book is added to your virtual shelf" />,
      });
      setState({
        ...state,
        isBookAdded: true,
        isLoading: false,
        isAddModalOpen: false,
      });
    } catch (error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast action="error" nativeId={id} message={error.message} title="Error" />
        ),
      });
      setState({
        ...state,
        isLoading: false,
        isAddModalOpen: false,
      });
    }
  };

  return (
    <ScrollView>
      <BookCard book={book}>
        <Box bg="#fff" p="$4">
          {isBookAdded ? (
            <Alert mx="$2.5" action="info" variant="solid">
              <AlertIcon as={InfoIcon} mr="$3" />
              <AlertText>Book is added to your virtual shelf</AlertText>
            </Alert>
          ) : (
            <Button type="submit" onPress={() => setState({ ...state, isAddModalOpen: true })}>
              <ButtonText isLoading={isLoading}>Add to your shelf</ButtonText>
              {isLoading && <ButtonIcon as={LoaderIcon} />}
            </Button>
          )}
        </Box>
      </BookCard>

      <ConfirmDialog
        header="Are you sure?"
        isOpen={isAddModalOpen}
        isConfirmButtonDisabled={isLoading}
        onClose={() => setState({ ...state, isAddModalOpen: false })}
        onConfirm={() => insertBook()}
      >
        <Text>
          Please confirm that you own this book and want to add to your virtual shelf here
        </Text>
      </ConfirmDialog>
    </ScrollView>
  );
}
