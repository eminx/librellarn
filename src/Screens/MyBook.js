import React from 'react';
import { Box, Button, ButtonText } from '@gluestack-ui/themed';

import BookCard from '../Components/BookCard';

export default function MyBook({ route, navigation }) {
  const { book } = route.params;

  return (
    <Box width="100%">
      <BookCard book={book}>
        <Box bg="#fff" p="$4">
          <Button
            type="submit"
            onPress={() =>
              navigation.navigate('Edit My Book', {
                book,
                name: 'Edit book',
              })
            }
          >
            <ButtonText>Edit</ButtonText>
          </Button>
        </Box>
      </BookCard>
    </Box>
  );
}
