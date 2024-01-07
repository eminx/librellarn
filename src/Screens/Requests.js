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

import { StateContext } from '../StateContext';
import Input from '../Components/Input';

const RequestsCollection = new Mongo.Collection('requests');

const filterOptions = ['all', 'by me', 'to me'];

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

  if (!requests || !currentUser) {
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
    return items.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
  };

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
                key={option}
                borderBottomColor={requestType === option ? '$blue600' : '$white'}
                borderBottomWidth="2px"
                borderRadius="0"
                px="$2"
                size="sm"
                variant="link"
                onPress={() => setState({ ...state, requestType: option })}
              >
                <ButtonText color={requestType === option ? '$blue600' : '$coolGray800'}>
                  {option}
                </ButtonText>
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </HStack>

      <FlatList
        data={sortedRequests}
        renderItem={({ item }) => {
          const request = item;
          const isOwner = request.ownerId === currentUserId;
          const nCount = getNotificationsCount(item);
          const isNCount = typeof nCount !== 'undefined';

          return (
            <Pressable
              key={request._id}
              bg="$white"
              sx={{ ':active': { bg: '$amber100' } }}
              onPress={() =>
                navigation.navigate('Request', {
                  request,
                  currentUser,
                  isOwner,
                  name: isOwner ? request.requesterUsername : request.ownerUsername,
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
                  <HStack alignItems="center" flex={1}>
                    <Box alignItems="center" w={54} pt="$2" pl="$2" position="relative">
                      <Image
                        alt={isOwner ? request.requesterUsername : request.ownerUsername}
                        borderRadius="$full"
                        style={styles.avatar}
                        source={{
                          uri: isOwner ? request.requesterImage : request.ownerImage,
                        }}
                      />
                      <Text isTruncated size="xs">
                        {isOwner ? request.requesterUsername : request.ownerUsername}
                      </Text>
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
                        <Text size="xs">{request?.lastMessageDate?.toLocaleDateString()}</Text>
                      </Box>
                    </Box>
                  </HStack>
                  <Box>
                    <Image
                      alignSelf="flex-end"
                      alt={request.bookTitle}
                      style={styles.thumbImage}
                      source={{ uri: request.bookImage }}
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
