import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Box,
  Spinner,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsText,
  TabsContents,
  TabsContent,
  Text,
} from '@gluestack-ui/themed';
import { GiftedChat } from 'react-native-gifted-chat';

import { call } from '../utils/functions';

const MessagesCollection = new Mongo.Collection('messages');

const steps = [
  {
    title: 'Requested',
    description: 'Request sent',
  },
  {
    title: 'Accepted',
    description: 'Request is accepted',
  },
  {
    title: 'Handed',
    description: 'The borrower received the book to read',
  },
  {
    title: 'Returned',
    description: 'The borrower has returned the book to the owner',
  },
];

const myImg = (src) => <img src={src} alt="book image" height={64} />;

function Request({ currentUser, discussion, isChatLoading, isOwner, navigation, request }) {
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: 'block',
        },
      });
  }, [navigation]);

  if (isChatLoading) {
    return <Spinner />;
  }

  const messages =
    discussion &&
    discussion.map((message) => ({
      _id: message.createdDate.toString(),
      text: message.content,
      createdAt: message.createdDate.toString(),
      user: {
        _id: message.senderId,
        name: message.senderUsername,
        avatar: isOwner ? request.requesterImage : request.ownerImage,
      },
    }));

  const sendMessage = async (message) => {
    try {
      await call('addMessage', request._id, message.text);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('acceptRequest', id);
      await getRequest();
    } catch (error) {
      console.log(error);
    }
  };

  const denyRequest = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('denyRequest', id);
      await getRequest();
      // successDialog(
      //   "Request denied. We are sorry to have you deny this request"
      // );
    } catch (error) {
      console.log(error);
      // errorDialog(error.reason);
    }
  };

  const setIsHanded = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('setIsHanded', id);
      await getRequest();
      // successDialog("Great that you have handed over the book!");
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  const setIsReturned = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('setIsReturned', id);
      await getRequest();
      // successDialog("Your book is back and available at your shelf <3");
    } catch (error) {
      console.log(error);
      errorDialog(error.reason);
    }
  };

  const getCurrentStatus = () => {
    if (request?.isReturned) {
      return 3;
    } else if (request?.isHanded) {
      return 2;
    } else if (request?.isConfirmed) {
      return 1;
    } else {
      return 0;
    }
  };

  const getNotificationsCount = () => {
    if (!currentUser) {
      return null;
    }
    const currentItem = currentUser.notifications?.find((notification) => {
      return notification.contextId === request._id;
    });

    return currentItem && currentItem.count;
  };

  const removeNotification = async (messageIndex) => {
    const shouldRun = currentUser?.notifications?.find((notification) => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification?.unSeenIndexes?.some((unSeenIndex) => unSeenIndex === messageIndex);
    });
    if (!shouldRun) {
      return;
    }
    try {
      await call('removeNotification', request._id, messageIndex);
    } catch (error) {
      // errorDialog(error.reason || error.error);
      console.log('error', error);
    }
  };

  const getOthersName = () => {
    if (request.requesterUsername === currentUser.username) {
      return request.ownerUsername;
    } else {
      return request.requesterUsername;
    }
  };

  // const requestedNotResponded = !request.isConfirmed && !request.isDenied;
  // const isOwner = currentUser._id === request.ownerId;
  // const currentStatus = getCurrentStatus();

  return (
    <Box style={styles.container}>
      <GiftedChat
        inverted={false}
        messages={messages}
        renderUsernameOnMessage
        scrollToBottom
        style={styles.chatbox}
        user={{
          _id: currentUser._id,
          name: currentUser.username,
        }}
        onSend={(msgs) => sendMessage(msgs[0])}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  chatbox: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});

const RequestContainer = withTracker(({ navigation, route }) => {
  const { currentUser, isOwner, request } = route.params;
  const subscription = Meteor.subscribe('chat', request._id);
  const chat = MessagesCollection.findOne({ requestId: request._id });
  const discussion = chat?.messages?.map((message) => ({
    ...message,
    isFromMe: currentUser && message && message.senderId === currentUser._id,
    createdDate: message.createdDate.toString(),
  }));
  return {
    currentUser,
    discussion,
    isChatLoading: !subscription.ready(),
    isOwner,
    navigation,
    request,
  };
})(Request);

export default RequestContainer;
