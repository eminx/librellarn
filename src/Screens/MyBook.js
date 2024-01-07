import React from 'react';
import { Box, Button, ButtonText, ScrollView } from '@gluestack-ui/themed';

import BookCard from '../Components/BookCard';

export default function MyBook({ route, navigation }) {
  const { book } = route.params;

  return (
    <ScrollView>
      <BookCard book={book} navigation={navigation}>
        <Box bg="$amber100" p="$4">
          <Button
            type="submit"
            borderRadius="$full"
            onPress={() =>
              navigation.navigate('MyBookEdit', {
                book,
                name: 'Edit book',
              })
            }
          >
            <ButtonText>Edit Details</ButtonText>
          </Button>
        </Box>
      </BookCard>
    </ScrollView>
  );
}
