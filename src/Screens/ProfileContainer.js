import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Profile from "./Profile";
import ProfileEdit from "./ProfileEdit";
import MyBook from "./MyBook";
import MyBookEdit from "./MyBookEdit";
import { BooksContext, StateContext } from "../StateContext";
import { call } from "../utils/functions";

const Stack = createNativeStackNavigator();

export default function ProfileContainer() {
  const [state, setState] = useState({
    books: [],
    isLoading: false,
  });
  const { currentUser } = useContext(StateContext);
  const { books, isLoading } = state;

  useEffect(() => {
    getUserBooks();
  }, [currentUser?.username]);

  const getUserBooks = async () => {
    setState({ ...state, isLoading: true });
    try {
      const respond = await call("getUserBooks", currentUser?.username);
      setState({ ...state, books: respond, isLoading: false });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BooksContext.Provider value={{ books, getUserBooks }}>
      <Stack.Navigator initialRouteName="My Profile">
        <Stack.Screen
          component={Profile}
          name="My Profile"
          // options={(route) => ({ headerShown: false })}
        />
        <Stack.Screen
          component={ProfileEdit}
          name="Edit Profile"
          // options={(route) => ({ headerShown: false })}
        />
        <Stack.Screen
          component={MyBook}
          name="My Book"
          options={({ route }) => ({ title: route.params.name })}
        />
        <Stack.Screen
          component={MyBookEdit}
          name="Edit My Book"
          options={({ route }) => ({ title: route.params.name })}
        />
        {/* <Stack.Screen
        component={EditBook}
        name="Edit Book"
        options={({ route }) => ({ title: route.params.name })}
      /> */}
      </Stack.Navigator>
    </BooksContext.Provider>
  );
}
