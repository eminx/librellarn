import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Box, Spinner } from '@gluestack-ui/themed';
import { GiftedChat } from 'react-native-gifted-chat';

import { call } from '../utils/functions';

const MessagesCollection = new Mongo.Collection('messages');

function RequestMessages({ currentUser, discussion, isLoading, isOwner, navigation, request }) {
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

  if (isLoading) {
    return <Spinner />;
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     const unsubscribe = API.subscribe(userId, user => setUser(user));

  //     return () => unsubscribe();
  //   }, [currentUser._id])
  // );

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

  const onViewableItemsChanged = ({ viewableItems }) => {
    console.log(viewableItems, 'lkds');
  };

  return (
    <Box style={styles.container}>
      <GiftedChat
        inverted={false}
        messages={messages}
        renderUsernameOnMessage
        scrollToBottom
        style={styles.chatbox}
        user={{
          _id: currentUser?._id,
          name: currentUser?.username,
        }}
        onSend={(msgs) => sendMessage(msgs[0])}
        onViewableItemsChanged={onViewableItemsChanged}
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

const RequestMessagesContainer = withTracker(({ navigation, route }) => {
  const { currentUser, isOwner, request } = route.params;
  const chatSubscription = Meteor.subscribe('chat', request._id);
  const chat = MessagesCollection.findOne({ requestId: request._id });
  const discussion = chat?.messages?.map((message) => ({
    ...message,
    isFromMe: currentUser && message && message.senderId === currentUser._id,
    createdDate: message.createdDate.toString(),
  }));

  return {
    currentUser,
    discussion,
    isLoading: !chatSubscription.ready(),
    isOwner,
    navigation,
    request,
  };
})(RequestMessages);

export default RequestMessagesContainer;
