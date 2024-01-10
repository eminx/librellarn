import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React from 'react';
import {
  ArrowRightIcon,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonGroup,
  ButtonIcon,
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
import { Bell, CheckSquare, MessagesSquare, MinusSquare } from 'lucide-react-native';

import { call } from '../../utils/functions';
import Alert from '../../Components/Alert';

const RequestsCollection = new Mongo.Collection('requests');

const steps = [
  {
    title: 'Requested',
    description: 'Request is made',
  },
  {
    title: 'Accepted',
    description: 'Request is accepted',
  },
  {
    title: 'Handed',
    description: 'The book is handed to requester',
  },
  {
    title: 'Returned',
    description: 'The book is returned to the owner',
  },
];

function Request({ currentUser, isLoading, isOwner, navigation, request }) {
  if (isLoading) {
    return <Spinner />;
  }

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

  const renderButtonWithNotification = () => {
    const currentItem = currentUser.notifications?.find((notification) => {
      return notification.contextId === request._id;
    });

    const count = currentItem?.unSeenIndexes?.length;

    const isUnreadMessage = count && count > 0;
    const theOther = isOwner ? requesterUsername : ownerUsername;

    const requestNoDate = {
      ...request,
      createdAt: request.createdAt?.toDateString(),
    };

    return (
      <>
        {isUnreadMessage && (
          <Alert bg="$lime100" mb="$2">
            You have <Text fontWeight="bold">{count}</Text> unread messages from {theOther}
          </Alert>
        )}
        <Button
          size="sm"
          variant="solid"
          borderRadius="$full"
          onPress={() =>
            navigation.navigate('RequestMessages', {
              currentUser,
              isOwner,
              request: requestNoDate,
            })
          }
        >
          {isUnreadMessage ? (
            <ButtonIcon as={Bell} color="$red400" mr="$2" strokeWidth={3} />
          ) : (
            <ButtonIcon as={MessagesSquare} mr="$2" />
          )}
          <ButtonText>{`Chat with ${theOther}`}</ButtonText>
          <ButtonIcon as={ArrowRightIcon} ml="$2" />
        </Button>
      </>
    );
  };

  const requestedNotResponded = !request.isConfirmed && !request.isDenied;
  const currentStatus = getCurrentStatus();

  const {
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
    <Box>
      <ScrollView>
        <Box py="$4">
          <HStack pb="$2">
            <Box flex={1}>
              <Center>
                <Avatar bgColor="$amber400" borderRadius="$full">
                  <AvatarFallbackText>{requesterUsername}</AvatarFallbackText>
                  <AvatarImage alt={requesterUsername} source={{ uri: requesterImage }} />
                </Avatar>
              </Center>
              <Center>
                <Link>
                  <LinkText>{requesterUsername}</LinkText>
                </Link>
              </Center>
            </Box>

            <Center>
              <Box flex={2}>
                <Image
                  alt={bookTitle}
                  h={80}
                  resizeMode="contain"
                  size="lg"
                  source={{
                    uri: bookImage,
                  }}
                  w={50}
                />
              </Box>
            </Center>

            <Box flex={1}>
              <Center>
                <Avatar bgColor="$amber400" borderRadius="$full">
                  <AvatarFallbackText>{ownerUsername}</AvatarFallbackText>
                  <AvatarImage alt={ownerUsername} source={{ uri: ownerImage }} />
                </Avatar>
              </Center>
              <Center>
                <Link>
                  <LinkText>{ownerUsername}</LinkText>
                </Link>
              </Center>
            </Box>
          </HStack>

          <Center px="$4" py="$2">
            <Text textAlign="center">
              <Text fontWeight="bold">{requesterUsername}</Text> requests to borrow{' '}
              <Text fontWeight="bold">{bookTitle}</Text> from{' '}
              <Text fontWeight="bold">{ownerUsername}</Text>
            </Text>
          </Center>

          <Center>{renderButtonWithNotification()}</Center>
        </Box>

        <Box bg="$white">
          {isConfirmed && !isHanded && isOwner && (
            <Center p="$4">
              <Button variant="solid" onPress={() => setIsHanded()}>
                <ButtonText>I've handed over the book</ButtonText>
              </Button>
            </Center>
          )}

          {isHanded && !isReturned && isOwner && (
            <Center p="$4">
              <Button variant="solid" onPress={() => setIsReturned()}>
                <ButtonText>I've received my book back</ButtonText>
              </Button>
            </Center>
          )}
        </Box>

        {requestedNotResponded && isOwner ? (
          <Box bg="$white" p="$2">
            <Center>
              <ButtonGroup space="$2">
                <Button onPress={() => acceptRequest()}>
                  <ButtonText>Accept</ButtonText>
                </Button>
                <Button variant="outline" onPress={() => denyRequest()}>
                  <ButtonText>Deny</ButtonText>
                </Button>
              </ButtonGroup>
            </Center>
          </Box>
        ) : (
          <Center>
            <VStack p="$2" space="md">
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
                      <Heading
                        fontColor={currentStatus >= index ? '$coolGray800' : '$coolGray300'}
                        size="sm"
                      >
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
      </ScrollView>
    </Box>
  );
}

const RequestContainer = withTracker(({ navigation, route }) => {
  const { isOwner, request } = route.params;
  Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const requestSubscription = Meteor.subscribe('request', request._id);
  const requestSubscribed = RequestsCollection.findOne({ _id: request._id });
  return {
    currentUser,
    isLoading: !requestSubscription.ready(),
    isOwner,
    navigation,
    request: requestSubscribed,
  };
})(Request);

export default RequestContainer;
