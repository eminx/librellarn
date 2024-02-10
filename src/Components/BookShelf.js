import React, { useState } from 'react';

import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
  SearchIcon,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import BookList from './BookList';
import Input from './Input';
import Select from './Select';
import { i18n } from '../../i18n';

const sortValueOptions = [
  {
    label: i18n.t('generic.lastAdded'),
    value: 'last added',
  },
  {
    label: i18n.t('generic.bookTitle'),
    value: 'book title',
  },
  {
    label: i18n.t('generic.bookAuthor'),
    value: 'book author',
  },
  {
    label: i18n.t('generic.bookLanguage'),
    value: 'book language',
  },
  {
    label: i18n.t('generic.requestCondition'),
    value: 'request condition',
  },
];

export default function BookShelf({
  books,
  loading,
  navigateTo,
  isMyShelf = false,
  refresher,
  ...otherProps
}) {
  const navigation = useNavigation();
  const [state, setState] = useState({
    filterInputValue: '',
    sortValue: sortValueOptions[0],
  });

  const { filterInputValue, sortValue } = state;

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

  const handleSortValueChange = (value) => {
    const selectedValue = sortValueOptions.find((o) => o.value === value);
    setState({
      ...state,
      sortValue: selectedValue,
    });
  };

  const sortedBooks = getBooksSorted();
  const filteredSortedBooks = sortedBooks && getBooksFiltered(sortedBooks);

  return (
    <Box {...otherProps}>
      <HStack py="$2" space="md">
        <VStack justifyContent="flex-start" ml="$4" w="60%">
          <Text size="sm">{i18n.t('generic.filter')}</Text>
          <Box>
            <Input
              leftIcon={SearchIcon}
              placeholder={i18n.t('generic.bookPlaceholder')}
              size="sm"
              value={filterInputValue}
              onChangeText={(value) => setState({ ...state, filterInputValue: value })}
              onPressCloseIcon={() => setState({ ...state, filterInputValue: '' })}
            />
          </Box>
        </VStack>

        <VStack justifyContent="flex-end" px="$4" w="100%">
          <Text size="sm">{i18n.t('generic.sort')}</Text>
          <Select
            mr="$4"
            options={sortValueOptions}
            placeholder={sortValue?.label}
            size="sm"
            variant="underlined"
            onValueChange={(option) => handleSortValueChange(option)}
          />
        </VStack>
      </HStack>
      {isMyShelf && (
        <Box bg="$blue100" p="$2">
          <Button
            borderRadius="$full"
            onPress={() => {
              navigation.navigate('AddBookSearch');
            }}
          >
            <ButtonText>{i18n.t('discover.addToMyShelf')}</ButtonText>
            <ButtonIcon as={Plus} ml="$2" size="xl" />
          </Button>
        </Box>
      )}

      {loading && <Spinner />}

      {filteredSortedBooks?.length > 0 ? (
        <BookList books={filteredSortedBooks} refresher={refresher} navigateTo={navigateTo} />
      ) : (
        <Center>
          <Text textAlign="center">{i18n.t('generic.noBooks')}</Text>
        </Center>
      )}
    </Box>
  );
}
