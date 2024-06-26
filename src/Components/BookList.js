import React, { useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
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

export default function BookList({ books, navigateTo, refresher }) {
  const [state, setState] = useState({ refreshing: false });
  const navigation = useNavigation();

  if (!books || books.length === 0) {
    return null;
  }

  const onRefresh = async () => {
    setState({ ...state, refreshing: true });
    await refresher();
    setState({ ...state, refreshing: false });
  };

  const { refreshing } = state;

  return (
    <FlatList
      data={books}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => {
        const { dateAdded, dateUpdatedLast, ...book } = item;
        const bookImageSrc =
          book.imageUrl || book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail;
        return (
          <Pressable
            key={book._id || book.canonicalVolumeLink}
            bg="$white"
            sx={{ ':active': { bg: '$lime50' } }}
            onPress={() =>
              navigation?.navigate(navigateTo, {
                book,
                name: book.title,
              })
            }
          >
            <Box borderBottomColor="$coolGray200" borderBottomWidth={1} p="$2">
              <HStack flexWrap="wrap">
                <Box>
                  {bookImageSrc ? (
                    <Image
                      alt={book.title}
                      height={72}
                      resizeMode="contain"
                      style={styles.thumbImage}
                      source={{
                        uri:
                          book.imageUrl ||
                          book.imageLinks?.thumbnail ||
                          book.imageLinks?.smallThumbnail,
                      }}
                      width={48}
                    />
                  ) : (
                    <Box bg="$blueGray200" w={48} h={72} />
                  )}
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
