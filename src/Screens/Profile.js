import React, { useContext } from 'react';
import { ScrollView } from 'react-native';

import { BooksContext, StateContext } from '../StateContext';
import About from '../Components/About';
import BookShelf from '../Components/BookShelf';

export default function Profile({ navigation }) {
  const { currentUser } = useContext(StateContext);
  const { books } = useContext(BooksContext);

  return (
    <>
      <About user={currentUser} />
      <BookShelf books={books} isMyShelf />
    </>
  );
}
