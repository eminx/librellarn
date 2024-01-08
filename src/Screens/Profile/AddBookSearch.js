import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Center,
  HStack,
  SearchIcon,
  Text,
} from '@gluestack-ui/themed';

import BookList from '../../Components/BookList';
import Input from '../../Components/Input';

const apiKey = '808034619888-91df5q015u8ahrjnov41d9isn3juknuv.apps.googleusercontent.com';

const googleApi = `https://www.googleapis.com/books/v1/volumes?q=`;

export default function AddBookSearch({ navigation }) {
  const [state, setState] = useState({
    searchResults: [],
    searchBarInput: '',
    isLoading: false,
  });

  const { searchResults, searchBarInput, isLoading } = state;

  const searchBarSearch = () => {
    setState({ ...state, isLoading: true });
    fetch(googleApi + searchBarInput)
      .then((results) => {
        return results.json();
      })
      .then((parsedResults) => {
        if (!parsedResults?.items) {
          setState({
            ...state,
            isLoading: false,
          });
        }
        setState({
          ...state,
          searchResults: parsedResults?.items?.map((item) => item.volumeInfo),
          isLoading: false,
        });
      });
  };

  const isSearchBarFull = searchBarInput && searchBarInput.length > 2;

  return (
    <Box mb={72}>
      <HStack p="$4">
        <Box flexGrow={1}>
          <Input
            borderTopRightRadius={isSearchBarFull ? '0' : '100%'}
            borderBottomRightRadius={isSearchBarFull ? '0' : '100%'}
            height={42}
            leftIcon={SearchIcon}
            placeholder="Book title, author etc"
            size="lg"
            value={searchBarInput}
            onChangeText={(value) => setState({ ...state, searchBarInput: value })}
            onPressCloseIcon={() => setState({ ...state, searchBarInput: '', searchResults: [] })}
          />
        </Box>

        {isSearchBarFull && (
          <Center flexGrow={0}>
            <Button
              borderRadius={0}
              borderBottomRightRadius="50%"
              borderTopRightRadius="50%"
              height={42}
              isDisabled={isLoading}
              type="submit"
              onPress={() => searchBarSearch()}
            >
              {isLoading && <ButtonSpinner mr="$1" />}
              <ButtonText>{isLoading ? 'Search' : 'Search'}</ButtonText>
            </Button>
          </Center>
        )}
      </HStack>

      {!isLoading && searchResults && searchResults.length > 0 && (
        <BookList navigation={navigation} navigateTo="AddBookItem" books={searchResults} />
      )}

      <Center mb={200} p="$4">
        <Box>
          <Center>
            <Text>Can't find the book?</Text>
          </Center>
          <Button
            borderRadius="$full"
            size="lg"
            variant="link"
            onPress={() => navigation.navigate('AddBookManually')}
          >
            <ButtonText>Manually Add Book</ButtonText>
          </Button>
        </Box>
      </Center>
    </Box>
  );
}
