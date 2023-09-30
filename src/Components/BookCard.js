import React, { useState } from 'react';
import { ScrollView } from 'react-native';

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
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

export default function BookCard({ book, children }) {
  const [state, setState] = useState({
    isInfoModalOpen: false,
  });

  const { isInfoModalOpen } = state;

  return (
    <>
      <ScrollView>
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
                <Image
                  alt={book.title}
                  h={160}
                  size="lg"
                  fit="contain"
                  source={{
                    uri:
                      book.imageUrl ||
                      book.imageLinks?.thumbnail ||
                      book.imageLinks?.smallThumbnail,
                  }}
                />
              </Center>
            </Box>
            <Box>
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
                    <Pressable>
                      <VStack alignItems="center">
                        <Avatar
                          bgColor="$amber400"
                          borderRadius="$full"
                          source={{ uri: book.ownerImage }}
                        >
                          <AvatarFallbackText>
                            {book.ownerUsername && book.ownerUsername[0]?.toUpperCase()}
                          </AvatarFallbackText>
                          <AvatarImage source={{ uri: book.ownerImage }} />
                        </Avatar>
                        <Center>
                          <Text>{book.ownerUsername}</Text>
                        </Center>
                      </VStack>
                    </Pressable>
                  )}
                </Box>
              </HStack>
              {children}
              <Box p="$4" w="100%">
                <Text mb="$2" size="sm">
                  Description
                </Text>
                <Text>{book.description}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>

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
  const bookLang = allLanguages.find((l) => {
    return l.value === book.language;
  });

  return (
    <VStack mb="$4">
      <Cell label="title" value={book.title} />
      <Cell label="authors" value={parseAuthors(book.authors)} />
      <Cell label="category" value={book.category || book.categories[0]} />
      <Cell label="language" value={bookLang?.label} />
      <Cell
        label="ISBN"
        value={book.ISBN || (book.industryIdentifiers && book.industryIdentifiers[1]?.identifier)}
      />
      <Cell label="pages" value={book.pageCount} />
      <Cell label="publisher" value={book.publisher} />
      <Cell label="publish date" value={book.publishedDate} />
    </VStack>
  );
}

function Cell({ label, value }) {
  return (
    <HStack mb="$2">
      <Text color="$gray500" mr="$2" w={120}>
        {label}
      </Text>
      <Text color="$gray800" flex={1} noOfLines={2}>
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
    return <Text color="$gray800">unknown authors</Text>;
  }
  return authors.map((author, index) => (
    <Text key={author}>{author + (authors.length !== index + 1 ? ', ' : '')}</Text>
  ));
};
