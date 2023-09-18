import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  Center,
  SearchIcon,
  Text,
  ButtonIcon,
  LoaderIcon,
} from '@gluestack-ui/themed';

import BookList from '../Components/BookList';
import Input from '../Components/Input';

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

  return (
    <ScrollView>
      <Box m="$4">
        <Input
          leftIcon={SearchIcon}
          placeholder="Book title, author etc"
          size="lg"
          value={searchBarInput}
          onChangeText={(value) => setState({ ...state, searchBarInput: value })}
          onPressCloseIcon={() => setState({ ...state, searchBarInput: '' })}
        />
      </Box>

      <Center mb="$4">
        {searchBarInput && searchBarInput.length > 2 && (
          <Button isDisabled={isLoading} size="lg" type="submit" onPress={() => searchBarSearch()}>
            <ButtonText>{isLoading ? 'Searching' : 'Search'}</ButtonText>
            {isLoading && <ButtonIcon as={LoaderIcon} ml="$4" />}
          </Button>
        )}
      </Center>

      {!isLoading && searchResults && (
        <BookList navigation={navigation} navigateTo="Book to Add" books={searchResults} />
      )}

      <Center mb={200}>
        <Box>
          <Center>
            <Text>Can't find the book?</Text>
          </Center>
          <Button
            // bg="$white"
            borderRadius="$full"
            size="lg"
            variant="link"
            onPress={() => navigation.navigate('Add Book Manually')}
          >
            <ButtonText>Manually Add Book</ButtonText>
          </Button>
        </Box>
      </Center>
    </ScrollView>
  );
}
