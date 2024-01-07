import Meteor from '@meteorrn/core';
import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Box,
  Button,
  ButtonIcon,
  Menu,
  MenuItem,
  MenuItemLabel,
  Spinner,
} from '@gluestack-ui/themed';
import { SettingsIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import Profile from './Profile';
import ProfileEdit from './ProfileEdit';
import MyBook from './MyBook';
import MyBookEdit from './MyBookEdit';
import { BooksContext, StateContext } from '../StateContext';
import { call } from '../utils/functions';
import AddBookSearch from './AddBookSearch';
import AddBookItem from './AddBookItem';
import AddBookManually from './AddBookManually';

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
      const respond = await call('getUserBooks', currentUser?.username);
      setState({ ...state, books: respond, isLoading: false });
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
    <BooksContext.Provider value={{ books, getUserBooks }}>
      <Stack.Navigator initialRouteName="My Profile">
        <Stack.Screen
          component={Profile}
          name="Profile"
          options={{
            headerRight: () => <SettingsMenu />,
          }}
        />
        <Stack.Screen
          component={ProfileEdit}
          name="ProfileEdit"
          // options={(route) => ({ headerShown: false })}
        />
        <Stack.Screen
          component={MyBook}
          name="MyBook"
          options={({ route }) => ({ title: route.params.name })}
        />
        <Stack.Screen
          component={MyBookEdit}
          name="MyBookEdit"
          options={({ route }) => ({ title: route.params.name })}
        />
        <Stack.Screen
          component={AddBookSearch}
          name="AddBookSearch"
          options={(route) => ({
            // headerShown: false,
            // tabBarIcon: ({ color, size }) => <Icon as={PlusSquare} color={color} size="xl" />,
          })}
        />
        <Stack.Screen component={AddBookItem} name="AddBookItem" />
        <Stack.Screen component={AddBookManually} name="AddBookManually" />
      </Stack.Navigator>
    </BooksContext.Provider>
  );
}

function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  const gotoEdit = () => {
    navigation.navigate('ProfileEdit');
    setOpen(false);
  };

  return (
    <Menu
      isOpen={open}
      placement="bottom left"
      trigger={({ ...triggerProps }) => {
        return (
          <Button variant="link" {...triggerProps} onPress={() => setOpen(!open)}>
            <ButtonIcon as={SettingsIcon} />
          </Button>
        );
      }}
    >
      <MenuItem key="edit" textValue="Edit profile" onPress={() => gotoEdit()}>
        <MenuItemLabel>Edit Profile</MenuItemLabel>
      </MenuItem>
      <MenuItem key="logout" textValue="Log out" onPress={() => Meteor.logout()}>
        <MenuItemLabel>Log out</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}
