import Meteor, { Mongo, withTracker } from '@meteorrn/core';
import React, { useContext, useState } from 'react';
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
  Text,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import { Bell, CheckSquare, MessagesSquare, MinusSquare } from 'lucide-react-native';

import { call } from '../../utils/functions';
import Alert from '../../Components/Alert';
import { StateContext } from '../../StateContext';
import { i18n } from '../../../i18n';
import ConfirmDialog from '../../Components/ConfirmDialog';
import Toast from '../../Components/Toast';

const RequestsCollection = new Mongo.Collection('requests');

const steps = [
  {
    title: i18n.t('requests.requested'),
    description: i18n.t('requests.requestedMessage'),
  },
  {
    title: i18n.t('requests.accepted'),
    description: i18n.t('requests.acceptedMessage'),
  },
  {
    title: i18n.t('requests.handed'),
    description: i18n.t('requests.handedMessage'),
  },
  {
    title: i18n.t('requests.returned'),
    description: i18n.t('requests.returnedMessage'),
  },
];

function Request({ isOwner, navigation, request }) {
  const { currentUser } = useContext(StateContext);
  const [state, setState] = useState({
    isBlockModalOn: false,
  });

  const toast = useToast();

  const acceptRequest = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('acceptRequest', request._id);
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
    } catch (error) {
      console.log(error);
    }
  };

  const setIsHanded = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('setIsHanded', request._id);
    } catch (error) {
      console.log(error);
    }
  };

  const setIsReturned = async () => {
    if (currentUser._id !== request.ownerId) {
      return;
    }
    try {
      await call('setIsReturned', request._id);
    } catch (error) {
      console.log(error);
    }
  };

  const blockUser = async () => {
    const theOtherId = isOwner ? request.requesterId : request.ownerId;
    const theOtherUsername = isOwner ? request.requesterUsername : request.ownerUsername;
    try {
      await call('blockUser', theOtherId);
      setState({
        ...state,
        isBlockModalOn: false,
      });
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message={`${theOtherUsername} is blocked`} />,
      });
    } catch (error) {
      console.log(error);
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
            {i18n.t('requests.unreadMessages', { count, username: theOther })}
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
          <ButtonText>{i18n.t('requests.chatWith', { username: theOther })}</ButtonText>
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

  const { isBlockModalOn } = state;

  const theOther = isOwner ? requesterUsername : ownerUsername;

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

          <Center px="$4" py="$4">
            <Text textAlign="center">
              {i18n.t('requests.requestsToBorrow', { bookTitle, ownerUsername, requesterUsername })}
            </Text>
          </Center>

          <Center>{renderButtonWithNotification()}</Center>
        </Box>

        <Box bg="$white">
          {isConfirmed && !isHanded && isOwner && (
            <Center p="$4">
              <Button bg="$green500" variant="solid" onPress={() => setIsHanded()}>
                <ButtonText>{i18n.t('requests.handedOver')}</ButtonText>
              </Button>
            </Center>
          )}

          {isHanded && !isReturned && isOwner && (
            <Center p="$4">
              <Button bg="$green500" variant="solid" onPress={() => setIsReturned()}>
                <ButtonText>{i18n.t('requests.receivedBack')}</ButtonText>
              </Button>
            </Center>
          )}
        </Box>

        {requestedNotResponded && isOwner ? (
          <Box bg="$white" p="$2">
            <Center>
              <ButtonGroup space="$2">
                <Button bg="$green500" onPress={() => acceptRequest()}>
                  <ButtonText>{i18n.t('requests.accept')}</ButtonText>
                </Button>
                <Button variant="outline" onPress={() => denyRequest()}>
                  <ButtonText>{i18n.t('requests.deny')}</ButtonText>
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

        <Center pb="$8">
          <Button variant="link" onPress={() => setState({ ...state, isBlockModalOn: true })}>
            <ButtonText color="$red" size="sm">
              {i18n.t('generic.blockUser', { username: theOther })}
            </ButtonText>
          </Button>
        </Center>
      </ScrollView>

      <ConfirmDialog
        isOpen={isBlockModalOn}
        header={i18n.t('generic.blockHeader')}
        onClose={() => setState({ ...state, isBlockModalOn: false })}
        onConfirm={() => blockUser()}
      >
        <Text>{i18n.t('generic.blockDescription')}</Text>
      </ConfirmDialog>
    </Box>
  );
}

const RequestContainer = withTracker(({ navigation, route }) => {
  const { isOwner, request } = route.params;
  const requestSubscription = Meteor.subscribe('request', request._id);
  const requestSubscribed = RequestsCollection.findOne({ _id: request._id });
  return {
    isOwner,
    navigation,
    request: requestSubscribed,
  };
})(Request);

export default RequestContainer;
