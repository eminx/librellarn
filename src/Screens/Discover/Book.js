import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, Button, ButtonText, Text, useToast } from '@gluestack-ui/themed';

import BookCard from '../../Components/BookCard';
import ConfirmDialog from '../../Components/ConfirmDialog';
import Toast from '../../Components/Toast';
import { call } from '../../utils/functions';
import { i18n } from '../../../i18n';

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
        render: ({ id }) => <Toast nativeId={id} message={i18n.t('discover.requestSent')} />,
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
            <ButtonText>{i18n.t('discover.borrow')}</ButtonText>
          </Button>
        </Box>
      </BookCard>

      <ConfirmDialog
        isOpen={isRequestModalOpen}
        header={i18n.t('generic.requestModalTitle')}
        onClose={() => setState({ ...state, isRequestModalOpen: false })}
        onConfirm={() => makeRequest()}
      >
        <Text>{i18n.t('discover.confirmRequest')}</Text>
      </ConfirmDialog>
    </ScrollView>
  );
}
