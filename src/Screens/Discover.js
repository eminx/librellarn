import React, { useEffect, useState } from "react";
import Meteor from "@meteorrn/core";
import { ScrollView } from "react-native";

import BookList from "../Components/BookList";

export default function Discover({ navigation }) {
  const [state, setState] = useState({
    books: [],
    isLoading: true,
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Meteor.call("getDiscoverBooks", (error, respond) => {
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

  const { books } = state;

  return (
    <>
      <ScrollView>
        <BookList books={books} navigation={navigation} navigateTo="Book" />
      </ScrollView>
    </>
  );
}
