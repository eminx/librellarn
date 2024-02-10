import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { GiftedChat } from 'react-native-gifted-chat';

import { call } from '../../utils/functions';

const RequestsCollection = new Mongo.Collection('requests');

function RequestMessages({ currentUser, discussion, isOwner, request }) {
  useEffect(() => {
    Meteor.call('removeAllNotifications', request._id);
  }, [discussion?.length]);

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

  const removeNotification = async () => {
    try {
      await call('removeAllNotifications', request._id);
    } catch (error) {
      // errorDialog(error.reason || error.error);
      console.log('error', error);
    }
  };

  return (
    <Box style={styles.container}>
      <GiftedChat
        inverted={false}
        messages={messages || []}
        renderAvatarOnTop
        renderUsernameOnMessage
        scrollToBottom
        style={styles.chatbox}
        user={{
          _id: currentUser?._id,
          name: currentUser?.username,
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

const RequestMessagesContainer = withTracker(({ navigation, route }) => {
  const { isOwner, request } = route.params;
  const requestSubscription = Meteor.subscribe('request', request._id);
  const currentUser = Meteor.user();
  const theRequest = RequestsCollection.findOne({ _id: request._id });
  const discussion = theRequest?.messages?.map((message) => ({
    ...message,
    isFromMe: currentUser && message && message.senderId === currentUser._id,
    createdDate: message.createdDate.toString(),
  }));

  return {
    currentUser,
    discussion,
    // isLoading: !chatSubscription.ready(),
    isOwner,
    navigation,
    request,
  };
})(RequestMessages);

export default RequestMessagesContainer;
