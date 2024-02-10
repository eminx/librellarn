import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from './Profile';
import MyBook from './MyBook';
import MyBookEdit from './MyBookEdit';
import { BooksContext } from '../../StateContext';
import { call } from '../../utils/functions';
import AddBookSearch from './AddBookSearch';
import AddBookItem from './AddBookItem';
import AddBookManually from './AddBookManually';
import { i18n } from '../../../i18n';

const Stack = createNativeStackNavigator();

export default function ProfileContainer() {
  const [state, setState] = useState({
    books: [],
    booksLoading: true,
  });
  const { books, booksLoading } = state;

  useEffect(() => {
    getMyBooks();
  }, []);

  const getMyBooks = async () => {
    try {
      const respond = await call('getMyBooks');
      setState({ ...state, books: respond, booksLoading: false });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BooksContext.Provider value={{ books, getMyBooks, booksLoading }}>
      <Stack.Navigator initialRouteName="My Profile">
        <Stack.Screen
          component={Profile}
          name="Profile"
          options={({ route }) => ({
            title: i18n.t('profile.label'),
          })}
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
          options={({ route }) => ({
            title: i18n.t('profile.addBook'),
          })}
          // options={(route) => ({
          //   headerShown: false,
          //   tabBarIcon: ({ color, size }) => <Icon as={PlusSquare} color={color} size="xl" />,
          // })}
        />

        <Stack.Screen
          component={AddBookItem}
          name="AddBookItem"
          options={({ route }) => ({
            title: i18n.t('profile.ownBook'),
          })}
        />
        <Stack.Screen
          component={AddBookManually}
          name="AddBookManually"
          options={({ route }) => ({
            title: i18n.t('profile.addManually'),
          })}
        />
      </Stack.Navigator>
    </BooksContext.Provider>
  );
}

// function SettingsMenu() {
//   const [open, setOpen] = useState(false);
//   const navigation = useNavigation();

//   const gotoEdit = () => {
//     navigation.navigate('ProfileEdit');
//     setOpen(false);
//   };

//   return (
//     <Menu
//       isOpen={open}
//       placement="bottom left"
//       trigger={({ ...triggerProps }) => {
//         return (
//           <Button variant="link" {...triggerProps} onPress={() => setOpen(!open)}>
//             <ButtonIcon as={SettingsIcon} />
//           </Button>
//         );
//       }}
//     >
//       <MenuItem key="edit" textValue="Edit profile" onPress={() => gotoEdit()}>
//         <MenuItemLabel>Edit Profile</MenuItemLabel>
//       </MenuItem>
//       <MenuItem key="logout" textValue="Log out" onPress={() => Meteor.logout()}>
//         <MenuItemLabel>Log out</MenuItemLabel>
//       </MenuItem>
//     </Menu>
//   );
// }
