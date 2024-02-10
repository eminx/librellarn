import React from 'react';
import { Box, Button, ButtonText, ScrollView } from '@gluestack-ui/themed';

import BookCard from '../../Components/BookCard';
import { i18n } from '../../../i18n';

export default function MyBook({ route, navigation }) {
  const { book } = route.params;

  return (
    <ScrollView>
      <BookCard book={book} navigation={navigation}>
        <Box bg="$blue100" p="$4">
          <Button
            type="submit"
            borderRadius="$full"
            onPress={() =>
              navigation.navigate('MyBookEdit', {
                book,
                name: i18n.t('profile.editBook'),
              })
            }
          >
            <ButtonText>{i18n.t('profile.editDetails')}</ButtonText>
          </Button>
        </Box>
      </BookCard>
    </ScrollView>
  );
}
