import React, { useEffect, useState } from 'react';
import { Box, Spinner } from '@gluestack-ui/themed';

import About from '../../Components/About';
import BookShelf from '../../Components/BookShelf';
import { call } from '../../utils/functions';

export default function User({ route }) {
  const [state, setState] = useState({
    books: [],
    user: null,
    isLoading: true,
  });

  const { username } = route.params;
  const { books, isLoading, user } = state;

  useEffect(() => {
    getData();
  }, [username]);

  const getData = async () => {
    try {
      const respondProfile = await call('getUserProfile', username);
      const respondBooks = await call('getUserBooks', username);
      setState({
        ...state,
        user: respondProfile,
        books: respondBooks,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <Box p="$4">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box>
      <About user={user} />
      <BookShelf books={books} mb={118} navigateTo="DiscoverBook" />
    </Box>
  );
}
