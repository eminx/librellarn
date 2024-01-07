import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Box,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import { StateContext } from '../StateContext';
import AvatarWithUsername from './AvatarWithUsername';

export default function BookList({ books, navigateTo }) {
  const { currentUser } = useContext(StateContext);
  const navigation = useNavigation();

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => {
        const { dateAdded, dateUpdatedLast, ...book } = item;
        const isMyBook = item?.ownerUsername === currentUser?.username;
        return (
          <Pressable
            key={book._id || book.canonicalVolumeLink}
            bg="$white"
            sx={{ ':active': { bg: '$amber100' } }}
            onPress={() =>
              navigation.navigate(isMyBook ? 'MyBook' : 'Book', {
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

                <AvatarWithUsername image={book.ownerImage} username={book.ownerUsername} />
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
