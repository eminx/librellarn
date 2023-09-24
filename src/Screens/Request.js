import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Center,
  HStack,
  Heading,
  Image,
  Link,
  LinkText,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { CheckSquare, MinusSquare } from 'lucide-react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import { call, parseAuthors } from '../utils/functions';

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
      await call('acceptRequest', request._id);
      // await getRequest();
    } catch (error) {
      console.log(error);
    }
  };

  const denyRequest = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('denyRequest', request._id);
      // await getRequest();
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
      await call('setIsHanded', request._id);
      // await getRequest();
      // successDialog("Great that you have handed over the book!");
    } catch (error) {
      console.log(error);
      // errorDialog(error.reason);
    }
  };

  const setIsReturned = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('setIsReturned', request._id);
      // await getRequest();
      // successDialog("Your book is back and available at your shelf <3");
    } catch (error) {
      console.log(error);
      // errorDialog(error.reason);
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

  const requestedNotResponded = !request.isConfirmed && !request.isDenied;
  const currentStatus = getCurrentStatus();

  const {
    bookAuthors,
    bookImage,
    bookTitle,
    isConfirmed,
    isHanded,
    isReturned,
    ownerImage,
    ownerUsername,
    requesterUsername,
    requesterImage,
  } = request;

  return (
    <ScrollView>
      <Box bg="$white" pb="$4">
        <HStack>
          <Box flex={1}>
            <Center>
              <Avatar bgColor="$amber400" borderRadius="$full">
                <AvatarFallbackText>{requesterUsername}</AvatarFallbackText>
                <AvatarImage source={{ uri: requesterImage }} />
              </Avatar>
            </Center>
            <Center>
              <Link>
                <LinkText>{requesterUsername}</LinkText>
              </Link>
            </Center>
          </Box>

          <Center>
            <Box flex={2} pl="$4">
              <Image
                alt={bookTitle}
                h={80}
                w={50}
                size="lg"
                // fit="contain"
                source={{
                  uri: bookImage,
                }}
              />
            </Box>
          </Center>

          <Box flex={1}>
            <Center>
              <Avatar bgColor="$amber400" borderRadius="$full">
                <AvatarFallbackText>{ownerUsername}</AvatarFallbackText>
                <AvatarImage source={{ uri: ownerImage }} />
              </Avatar>
            </Center>
            <Center>
              <Link>
                <LinkText>{ownerUsername}</LinkText>
              </Link>
            </Center>
          </Box>
        </HStack>

        <Center>
          <Text>
            {requesterUsername} requests {bookTitle} from {ownerUsername}
          </Text>
        </Center>
      </Box>

      {requestedNotResponded && isOwner ? (
        <Center>
          <ButtonGroup space="$4">
            <Button onPress={() => acceptRequest()}>
              <ButtonText>Accept</ButtonText>
            </Button>
            <Button variant="outline" onPress={() => denyRequest()}>
              <ButtonText>Deny</ButtonText>
            </Button>
          </ButtonGroup>
        </Center>
      ) : (
        <Center>
          <VStack p="$4" space="lg">
            {steps.map((step, index) => (
              <Box key={step.title} bg="$white" p="$2">
                <HStack>
                  <Box pl="$1" pt="$1">
                    {currentStatus >= index ? (
                      <CheckSquare color="green" size="36" />
                    ) : (
                      <MinusSquare color="gray" size="36" />
                    )}
                  </Box>
                  <Box ml="$4">
                    <Heading fontColor={currentStatus >= index ? '$gray800' : '$gray300'} size="sm">
                      {step.title}
                    </Heading>
                    <Text w={240} size="sm">
                      {step.description}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Center>
      )}

      {isConfirmed && !isHanded && isOwner && (
        <Center p="$4">
          <Button size="sm" variant="solid" onPress={() => setIsHanded()}>
            <ButtonText>I've handed over the book</ButtonText>
          </Button>
        </Center>
      )}

      {isHanded && !isReturned && isOwner && (
        <Center p="$4">
          <Button size="sm" variant="solid" onPress={() => setIsReturned()}>
            <ButtonText>I've received my book back</ButtonText>
          </Button>
        </Center>
      )}
    </ScrollView>
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
