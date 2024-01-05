import React, { useEffect, useState } from 'react';
import Meteor from '@meteorrn/core';

import BookList from '../Components/BookList';
import { Spinner } from '@gluestack-ui/themed';

export default function Discover({ navigation }) {
  const [state, setState] = useState({
    books: [],
    isLoading: true,
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Meteor.call('getDiscoverBooks', (error, respond) => {
      if (error) {
        setState({
          ...state,
          isLoading: false,
        });
      }
      setState({
        ...state,
        books: respond,
        isLoading: false,
      });
    });
  };

  const { books, isLoading } = state;

  if (isLoading) {
    return <Spinner />;
  }

  return <BookList books={books} navigation={navigation} navigateTo="Book" />;
}
