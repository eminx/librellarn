import React, { useContext, useState } from 'react';

import {
  Box,
  Button,
  ButtonText,
  Center,
  HStack,
  Heading,
  SearchIcon,
  Text,
  VStack,
} from '@gluestack-ui/themed';

import ActionSheet from './ActionSheet';
import BookList from './BookList';
import { BooksContext } from '../StateContext';
import Input from './Input';

const sortValueOptions = [
  {
    label: 'Last added',
    value: 'last added',
  },
  {
    label: 'Book title',
    value: 'book title',
  },
  {
    label: 'Book author',
    value: 'book author',
  },
  {
    label: 'Book language',
    value: 'book language',
  },
  {
    label: 'Request condition',
    value: 'request condition',
  },
];

export default function MyBooks({ navigation }) {
  const { books } = useContext(BooksContext);

  const [state, setState] = useState({
    filterInputValue: '',
    sortOptionVisible: false,
    sortValue: sortValueOptions[0],
  });

  const { filterInputValue, sortOptionVisible, sortValue } = state;

  const getBooksSorted = () => {
    if (!books || books.length === 0) {
      return;
    }
    switch (sortValue.value) {
      case 'book title':
        return books.sort((a, b) => a.title && a.title.localeCompare(b.title));
      case 'book author':
        return books.sort(
          (a, b) => a.authors && b.authors && a.authors[0].localeCompare(b.authors[0])
        );
      case 'request condition':
        return books.sort(
          (a, b) =>
            b.onRequest - a.onRequest || b.onAcceptance - a.onAcceptance || b.onLend - a.onLend
        );
      case 'language':
        return books.sort((a, b) => a.language.localeCompare(b.language));
      default:
        return books.sort((a, b) => b.dateAdded - a.dateAdded);
    }
  };

  const getBooksFiltered = (sortedBooks) => {
    return sortedBooks?.filter((book) => {
      return (
        (book.title && book.title.toLowerCase().indexOf(filterInputValue?.toLowerCase()) !== -1) ||
        (book.authors &&
          book.authors.find((author) => {
            return author && author.toLowerCase().indexOf(filterInputValue?.toLowerCase()) !== -1;
          })) ||
        (book.category &&
          book.category.toLowerCase().indexOf(filterInputValue?.toLowerCase()) !== -1)
      );
    });
  };

  const sortedBooks = getBooksSorted();
  const filteredSortedBooks = sortedBooks && getBooksFiltered(sortedBooks);

  return (
    <>
      <Heading size="md" textAlign="center" my="$2" mt="$4" fontWeight="light">
        Books
      </Heading>

      <HStack mb="$4" space="md">
        <VStack justifyContent="flex-start" ml="$4" w="60%">
          <Text size="sm">Filter: </Text>
          <Box>
            <Input
              leftIcon={SearchIcon}
              placeholder="Book title, author etc"
              size="sm"
              value={filterInputValue}
              onChangeText={(value) => setState({ ...state, filterInputValue: value })}
              onPressCloseIcon={() => setState({ ...state, filterInputValue: '' })}
            />
          </Box>
        </VStack>

        <VStack justifyContent="flex-end" mr="$4">
          <Text size="sm">Sort:</Text>
          <Button
            size="sm"
            variant="link"
            onPress={() => setState({ ...state, sortOptionVisible: true })}
          >
            <ButtonText>{sortValue?.label}</ButtonText>
          </Button>
          <ActionSheet
            isOpen={sortOptionVisible}
            options={sortValueOptions}
            onClose={() => setState({ ...state, sortOptionVisible: false })}
            onPress={(option) =>
              setState({
                ...state,
                sortOptionVisible: false,
                sortValue: option,
              })
            }
          />
        </VStack>
      </HStack>

      {/* <Center>
        {isLoading ? (
          <Spinner m="$2.5" />
        ) : (
          <Button variant="link" onPress={getUserBooks}>
            <ButtonText>Refresh</ButtonText>
          </Button>
        )}
      </Center> */}

      {filteredSortedBooks && (
        <BookList books={filteredSortedBooks} navigation={navigation} navigateTo="My Book" />
      )}

      {filteredSortedBooks?.length === 0 && (
        <Center>
          <Text textAlign="center">No books</Text>
        </Center>
      )}
    </>
  );
}
