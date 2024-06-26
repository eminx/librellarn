import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Requests from './Requests';
import Request from './Request';
import RequestMessages from './RequestMessages';
import { i18n } from '../../../i18n';
import HeaderRightMenu from '../../Components/HeaderRightMenu';

const Stack = createNativeStackNavigator();

export default function RequestsContainer({}) {
  return (
    <Stack.Navigator initialRouteName="Requests">
      <Stack.Screen
        name="Requests"
        component={Requests}
        options={{ title: i18n.t('requests.label') }}
      />
      <Stack.Screen
        name="Request"
        component={Request}
        options={({ route }) => ({
          headerRight: () => (
            <HeaderRightMenu contentId={route?.params?.request?._id} context="request" />
          ),
          title: i18n.t('requests.status') + ' | ' + route.params.request?.bookTitle,
          tabBarButton: (props) => null,
          tabBarVisible: false,
        })}
      />
      <Stack.Screen
        name="RequestMessages"
        component={RequestMessages}
        options={({ route }) => ({
          title: i18n.t('requests.messages') + ' | ' + route.params.request?.bookTitle,
          tabBarButton: (props) => null,
          tabBarVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}
