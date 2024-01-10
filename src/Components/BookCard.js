import React, { useContext, useState } from 'react';

import {
  Box,
  Center,
  HStack,
  Heading,
  Image,
  Link,
  LinkText,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Pressable,
  VStack,
  Text,
} from '@gluestack-ui/themed';

import allLanguages from '../utils/langs/allLanguages';
import AvatarWithUsername from './AvatarWithUsername';
import { StateContext } from '../StateContext';

export default function BookCard({ book, navigation, children }) {
  const { currentUser } = useContext(StateContext);
  const [state, setState] = useState({
    isInfoModalOpen: false,
  });

  const { isInfoModalOpen } = state;

  const isMyBook = currentUser.username === book.ownerUsername;
  const bookImageSrc =
    book.imageUrl || book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail;

  return (
    <>
      <Box alignItems="center">
        <Box
          width="100%"
          overflow="hidden"
          _dark={{
            backgroundColor: '$gray700',
          }}
          _light={{
            backgroundColor: '$gray50',
          }}
        >
          <Box>
            <Center bg="$warmGray800" py="$2" w="100%">
              {bookImageSrc ? (
                <Image
                  alt={book.title}
                  h={160}
                  resizeMode="contain"
                  size="lg"
                  source={{
                    uri: bookImageSrc,
                  }}
                  w={100}
                />
              ) : (
                <Box bg="$amber900" w={100} h={160} />
              )}
            </Center>
          </Box>
          <Box bg="$amber50" h="100%">
            <HStack justifyContent="space-between" p="$4" space="md">
              <Box flex={1}>
                <Heading size="md">{book.title}</Heading>
                <Text _light={lightTextStyle} _dark={darkTextStyle} size="md" fontWeight="500">
                  {book.authors && parseAuthors(book.authors)}
                </Text>
                <HStack alignItems="center" flex={1} flexWrap="wrap" mt="$2">
                  <Text fontWeight={700} mr="$2" size="xs">
                    {book.category?.toUpperCase() ||
                      (book.categories && book.categories[0]?.toUpperCase())}
                  </Text>
                  <Link
                    _text={{
                      color: '$blue400',
                    }}
                    onPress={() => setState({ isInfoModalOpen: true })}
                  >
                    <LinkText size="sm">more info</LinkText>
                  </Link>
                </HStack>
              </Box>
              <Box>
                {book.ownerUsername && (
                  <Pressable
                    onPress={() => {
                      !isMyBook
                        ? navigation.navigate('DiscoverUser', {
                            username: book.ownerUsername,
                          })
                        : null;
                    }}
                  >
                    <AvatarWithUsername image={book.ownerImage} username={book.ownerUsername} />
                  </Pressable>
                )}
              </Box>
            </HStack>
            {children}
            <Box bg="$white" p="$4" w="100%">
              <Text mb="$2" size="sm">
                Description
              </Text>
              <Text>{book.description}</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal
        isOpen={isInfoModalOpen}
        safeAreaTop={true}
        size="full"
        onClose={() => setState({ ...state, isInfoModalOpen: false })}
      >
        <ModalBackdrop />
        <ModalContent maxWidth={350}>
          <ModalHeader>
            <Heading>Info</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table book={book} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function Table({ book }) {
  if (!book) {
    return null;
  }

  const bookLang = allLanguages.find((l) => {
    return l.value === book.language;
  });

  const ISBN = book.ISBN || (book.industryIdentifiers && book.industryIdentifiers[1]?.identifier);
  const category = book.category || (book.categories && book.categories[0]);

  return (
    <VStack mb="$4">
      <Cell label="title" value={book.title} />
      <Cell label="authors" value={parseAuthors(book.authors)} />
      {category && <Cell label="category" value={book.category || book.categories[0]} />}
      {bookLang && <Cell label="language" value={bookLang?.label} />}
      {ISBN && <Cell label="ISBN" value={ISBN} />}
      <Cell label="pages" value={book.pageCount} />
      <Cell label="publisher" value={book.publisher} />
      <Cell label="publish date" value={book.publishedDate} />
    </VStack>
  );
}

function Cell({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <HStack mb="$2">
      <Text color="$coolGray500" mr="$2" w={120}>
        {label}
      </Text>
      <Text color="$coolGray800" flex={1} noOfLines={2}>
        {value}
      </Text>
    </HStack>
  );
}

const lightTextStyle = {
  color: '$coolGray600',
};

const darkTextStyle = {
  color: '$warmGray200',
};

const parseAuthors = (authors) => {
  if (!authors) {
    return <Text color="$coolGray800">unknown authors</Text>;
  }
  return authors.map((author, index) => (
    <Text key={author}>{author + (authors.length !== index + 1 ? ', ' : '')}</Text>
  ));
};
