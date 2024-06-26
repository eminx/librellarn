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
import { i18n } from '../../../i18n';

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
            borderTopRightRadius={isSearchBarFull ? 0 : 100}
            borderBottomRightRadius={isSearchBarFull ? 0 : 100}
            leftIcon={SearchIcon}
            height={42}
            placeholder={i18n.t('profile.searchPlaceholder')}
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
              borderBottomRightRadius={20}
              borderTopRightRadius={20}
              height={42}
              isDisabled={isLoading}
              type="submit"
              onPress={() => searchBarSearch()}
            >
              {isLoading && <ButtonSpinner mr="$1" />}
              <ButtonText>
                {isLoading ? i18n.t('profile.searching') : i18n.t('profile.search')}
              </ButtonText>
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
            <Text>{i18n.t('profile.bookNotFound')}</Text>
          </Center>
          <Button
            borderRadius="$full"
            size="lg"
            variant="link"
            onPress={() => navigation.navigate('AddBookManually')}
          >
            <ButtonText>{i18n.t('profile.manualAdd')}</ButtonText>
          </Button>
        </Box>
      </Center>
    </Box>
  );
}
