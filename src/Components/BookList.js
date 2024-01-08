import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Box,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import AvatarWithUsername from './AvatarWithUsername';

export default function BookList({ books, navigateTo }) {
  const navigation = useNavigation();

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => {
        const { dateAdded, dateUpdatedLast, ...book } = item;
        return (
          <Pressable
            key={book._id || book.canonicalVolumeLink}
            bg="$white"
            sx={{ ':active': { bg: '$lime50' } }}
            onPress={() =>
              navigation.navigate(navigateTo, {
                book,
                name: book.title,
              })
            }
          >
            <Box borderBottomColor="$coolGray200" borderBottomWidth={1} p="$2">
              <HStack flexWrap="wrap">
                <Box>
                  <Image
                    alt={book.title}
                    style={styles.thumbImage}
                    source={{
                      uri:
                        book.imageUrl ||
                        book.imageLinks?.thumbnail ||
                        book.imageLinks?.smallThumbnail,
                    }}
                  />
                </Box>
                <Box flex={1}>
                  <Box px="$4">
                    <Heading size="sm">{book.title}</Heading>
                  </Box>
                  <Box px="$4">
                    {book.authors?.map((author) => (
                      <Text key={author} size="sm">
                        {author}
                      </Text>
                    ))}
                  </Box>
                  <Box px="$4" mt="$2">
                    <Text fontWeight={700} size="xs">
                      {book.category?.toUpperCase() || (book.categories && book.categories[0])}
                    </Text>
                  </Box>
                </Box>
                <VStack>
                  {(book.ownerImage || book.ownerUsername) && (
                    <AvatarWithUsername image={book.ownerImage} username={book.ownerUsername} />
                  )}
                  {book.distance ? (
                    <Text size="2xs" textAlign="center">
                      {book.distance.toFixed(2) + ' km'}
                    </Text>
                  ) : null}
                </VStack>
              </HStack>
            </Box>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: 48,
    height: 72,
  },
});
