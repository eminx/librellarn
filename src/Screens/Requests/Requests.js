import Meteor, { Mongo, useTracker } from '@meteorrn/core';
import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Center,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  SearchIcon,
  Spinner,
  Text,
} from '@gluestack-ui/themed';

import { StateContext } from '../../StateContext';
import Input from '../../Components/Input';
import AvatarWithUsername from '../../Components/AvatarWithUsername';
import { i18n } from '../../../i18n';

const RequestsCollection = new Mongo.Collection('requests');

const filterOptions = [
  { label: i18n.t('generic.all'), value: 'all' },
  { label: i18n.t('generic.byMe'), value: 'by me' },
  { label: i18n.t('generic.toMe'), value: 'to me' },
];

export default function Requests({ navigation }) {
  const [state, setState] = useState({
    filterInputValue: '',
    requestType: 'all',
  });

  const requests = useTracker(() => {
    Meteor.subscribe('myRequests');
    return RequestsCollection.find().fetch();
  });

  const { currentUser } = useContext(StateContext);
  const { filterInputValue, requestType } = state;

  const currentUserId = currentUser._id;

  if (!requests) {
    return <Spinner m="$4" />;
  }

  const getNotificationsCount = (request) => {
    const foundContext =
      currentUser?.notifications &&
      currentUser?.notifications.find((notification) => {
        return notification?.contextId === request?._id;
      });
    return foundContext?.count;
  };

  const getRequestsFilteredByType = (items) => {
    if (!items) {
      return;
    }
    switch (requestType) {
      case 'by me':
        return items.filter((request) => request.requesterId === currentUserId);

      case 'to me':
        return items.filter((request) => request.ownerId === currentUserId);
      default:
        return items;
    }
  };

  const getRequestsFilteredByInput = (items) => {
    if (!items) {
      return;
    }
    return items.filter((request) => {
      return (
        request.bookTitle.toLowerCase().indexOf(filterInputValue.toLowerCase()) !== -1 ||
        request.ownerUsername.toLowerCase().indexOf(filterInputValue.toLowerCase()) !== -1 ||
        request.requesterUsername.toLowerCase().indexOf(filterInputValue.toLowerCase()) !== -1
      );
    });
  };

  const getRequestsSorted = (items) => {
    return items.sort((a, b) => {
      return (
        new Date(b.lastMessageDate || b.dateRequested) -
        new Date(a.lastMessageDate || a.dateRequested)
      );
    });
  };

  if (!requests || requests.length === 0) {
    return <Spinner m="$4" />;
  }

  const filteredRequestsByType = getRequestsFilteredByType(requests);
  const filteredRequestsByInput = getRequestsFilteredByInput(filteredRequestsByType);
  const sortedRequests = getRequestsSorted(filteredRequestsByInput);

  return (
    <>
      <HStack p="$4">
        <Box flex={1} pr="$2">
          <Input
            leftIcon={SearchIcon}
            placeholder="Book title, author etc"
            size="sm"
            value={filterInputValue}
            onChangeText={(value) => setState({ ...state, filterInputValue: value })}
            onPressCloseIcon={() => setState({ ...state, filterInputValue: '' })}
          />
        </Box>

        <Box flex={1} pr="$2">
          <ButtonGroup>
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                borderBottomColor={requestType === option.value ? '$blue600' : '$white'}
                borderBottomWidth="2px"
                borderRadius="0"
                px="$2"
                size="sm"
                variant="link"
                onPress={() => setState({ ...state, requestType: option.value })}
              >
                <ButtonText color={requestType === option.value ? '$coolGray800' : '$blue600'}>
                  {option.label}
                </ButtonText>
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </HStack>

      <FlatList
        data={sortedRequests}
        renderItem={({ item }) => {
          const request = {
            ...item,
            dateRequested: item.dateRequested.toString(),
            isConfirmed: item.isConfirmed?.toString(),
            isHanded: item.isHanded?.toString(),
            isReturned: item.isReturned?.toString(),
            lastMessageDate: item.lastMessageDate?.toLocaleString(),
          };
          const isOwner = request.ownerId === currentUserId;
          const nCount = getNotificationsCount(item);
          const isNCount = typeof nCount !== 'undefined';

          return (
            <Pressable
              key={request._id}
              bg="$white"
              sx={{ ':active': { bg: '$lime50' } }}
              onPress={() =>
                navigation.navigate('Request', {
                  isOwner,
                  request,
                })
              }
            >
              <Box
                bg={isNCount ? '$lime100' : 'none'}
                borderBottomColor="$coolGray200"
                borderBottomWidth={1}
                borderLeftColor={isNCount ? '$lime500' : 'none'}
                p="$2"
              >
                <HStack justifyContent="space-between">
                  <HStack flex={1}>
                    <Box alignItems="center" w={54} pt="$2" pl="$2" position="relative">
                      <AvatarWithUsername
                        image={isOwner ? request.requesterImage : request.ownerImage}
                        username={isOwner ? request.requesterUsername : request.ownerUsername}
                      />
                      {/* <Image
                        alt={isOwner ? request.requesterUsername : request.ownerUsername}
                        borderRadius="$full"
                        resizeMode="cover"
                        style={styles.avatar}
                        source={{
                          uri: isOwner ? request.requesterImage : request.ownerImage,
                        }}
                      />
                      <Text isTruncated size="xs">
                        {isOwner ? request.requesterUsername : request.ownerUsername}
                      </Text> */}
                      {isNCount && (
                        <Box
                          bg="$lime800"
                          borderRadius="50%"
                          borderWidth="1px"
                          borderColor="$white"
                          position="absolute"
                          pt={1}
                          top={2}
                          right={-12}
                          w={24}
                          h={24}
                        >
                          <Center>
                            <Text color="$white" fontWeight="bold">
                              {nCount}
                            </Text>
                          </Center>
                        </Box>
                      )}
                    </Box>
                    <Box flex={1}>
                      <Box px="$4">
                        <Heading size="sm">{request.bookTitle}</Heading>
                      </Box>
                      <Box px="$4">
                        <HStack flexWrap="wrap">
                          {request.bookAuthors?.map((author, index) => (
                            <Text key={author} mr="$2" size="xs">
                              {author}
                              {index < request?.bookAuthors?.length - 1 && ','}
                            </Text>
                          ))}
                        </HStack>
                      </Box>
                      <Box mt="$2" px="$4">
                        <Text size="xs">{request?.lastMessageDate}</Text>
                      </Box>
                    </Box>
                  </HStack>
                  <Box>
                    <Image
                      alignSelf="flex-end"
                      alt={request.bookTitle}
                      resizeMode="cover"
                      source={{ uri: request.bookImage }}
                      style={styles.thumbImage}
                    />
                  </Box>
                </HStack>
              </Box>
            </Pressable>
          );
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: 48,
    height: 72,
  },
  avatar: {
    width: 48,
    height: 48,
  },
});
