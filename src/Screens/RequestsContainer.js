import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Requests from './Requests';
import Request from './Request';
import RequestMessages from './RequestMessages';

const Stack = createNativeStackNavigator();

export default function RequestsContainer({}) {
  return (
    <Stack.Navigator initialRouteName="Requests">
      <Stack.Screen name="Requests" component={Requests} />
      <Stack.Screen
        name="Request"
        component={Request}
        options={({ route }) => ({
          title: 'Status | ' + route.params.request?.bookTitle,
          tabBarButton: (props) => null,
          tabBarVisible: false,
        })}
      />
      <Stack.Screen
        name="RequestMessages"
        component={RequestMessages}
        options={({ route }) => ({
          title: 'Messages | ' + route.params.request?.bookTitle,
          tabBarButton: (props) => null,
          tabBarVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}
