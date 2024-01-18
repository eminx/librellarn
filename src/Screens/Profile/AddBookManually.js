import React from 'react';
import { ScrollView } from 'react-native';

import BookForm from '../../Components/BookForm';

export default function AddBookManually() {
  return (
    <ScrollView>
      <BookForm />
    </ScrollView>
  );
}
