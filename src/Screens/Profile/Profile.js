import React, { useContext } from 'react';

import { BooksContext, StateContext } from '../../StateContext';
import About from '../../Components/About';
import BookShelf from '../../Components/BookShelf';

export default function Profile() {
  const { currentUser } = useContext(StateContext);
  const { books } = useContext(BooksContext);

  return (
    <>
      <About user={currentUser} />
      <BookShelf books={books} isMyShelf navigateTo="MyBook" />
    </>
  );
}
