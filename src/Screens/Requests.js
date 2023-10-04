import React, { useEffect, useContext, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  SearchIcon,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';

import ActionSheet from '../Components/ActionSheet';
import { StateContext } from '../StateContext';
import { call } from '../utils/functions';
import Input from '../Components/Input';

const filterOptions = ['all', 'by me', 'to me'];
const sortOptions = [
  {
    label: 'Date',
    value: 'date',
  },
  {
    label: 'Book title',
    value: 'book',
  },
  {
    label: 'Username',
    value: 'username',
  },
];

export default function Requests({ navigation }) {
  const [state, setState] = useState({
    filterInputValue: '',
    gotoRequest: null,
    isLoading: true,
    noRequest: false,
    requests: [],
    requestType: 'all',
    sortOptionsVisible: false,
    sortValue: sortOptions[0],
  });
  const { currentUser } = useContext(StateContext);
  const { filterInputValue, isLoading, requests, requestType, sortOptionsVisible, sortValue } =
    state;

  const currentUserId = currentUser._id;

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    try {
      const respond = await call('getMyRequests');
      setState({
        ...state,
        requests: respond,
        isLoading: false,
        noRequest: Boolean(respond && respond.length === 0),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTypeChange = (value) => {
    setState({
      ...state,
      requestType: value,
    });
  };

  const getNotificationsCount = (request) => {
    const foundContext =
      currentUser?.notifications &&
      currentUser?.notifications.find((notification) => {
        return notification?.contextId === request?._id;
      });

    return foundContext?.count;
  };

  const getRequestsFilteredByType = (items) => {
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
    return items.filter((request) => {
      return (
        request.bookTitle.toLowerCase().indexOf(filterInputValue.toLowerCase()) !== -1 ||
        request.ownerUsername.toLowerCase().indexOf(filterInputValue.toLowerCase()) !== -1 ||
        request.requesterUsername.toLowerCase().indexOf(filterInputValue.toLowerCase()) !== -1
      );
    });
  };

  const getRequestsSorted = (items) => {
    switch (sortValue?.value) {
      case 'book':
        return items.sort((a, b) => a.bookTitle?.localeCompare(b.bookTitle));
      case 'username':
        return items.sort((a, b) => {
          const isOwner = a.ownerId === currentUserId;
          const param = isOwner ? 'requesterUsername' : 'ownerUsername';
          return a[param]?.localeCompare(b[param]);
        });
      default:
        return items.sort((a, b) => new Date(b.dateRequested) - new Date(a.dateRequested));
    }
  };

  const filteredRequestsByType = getRequestsFilteredByType(requests);
  const filteredRequestsByInput = getRequestsFilteredByInput(filteredRequestsByType);
  const sortedRequests = getRequestsSorted(filteredRequestsByInput);

  return (
    <>
      <>
        <HStack my="$4" space="md">
          <VStack justifyContent="flex-start" ml="$4" w="60%">
            <Text size="sm">Filter: </Text>
            <Box>
              <Input
                leftIcon={SearchIcon}
                placeholder="Book title, author etc"
                size="sm"
                value={filterInputValue}
                onChangeText={(value) => setState({ ...state, filterInputValue: value })}
                onPressCloseIcon={() => setState({ ...state, filterInputValue: '' })}
              />
            </Box>
          </VStack>

          <VStack justifyContent="flex-end" mr="$4">
            <Text size="sm">Sort:</Text>
            <Button
              size="sm"
              variant="link"
              onPress={() => setState({ ...state, sortOptionsVisible: true })}
            >
              <ButtonText>{sortValue.label}</ButtonText>
            </Button>
            <ActionSheet
              isOpen={sortOptionsVisible}
              options={sortOptions}
              onClose={() => setState({ ...state, sortOptionsVisible: false })}
              onPress={(option) =>
                setState({
                  ...state,
                  sortOptionsVisible: false,
                  sortValue: option,
                })
              }
            />
          </VStack>
        </HStack>
        <Box mb="$4" ml="$4">
          <ButtonGroup>
            {filterOptions.map((option) => (
              <Button
                key={option}
                bg={requestType === option ? '$blue500' : '$white'}
                borderRadius={0}
                size="xs"
                variant={requestType === option ? 'solid' : 'outline'}
                onPress={() => setState({ ...state, requestType: option })}
              >
                <ButtonText>{option}</ButtonText>
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        {isLoading || !currentUser ? (
          <Spinner m="$4" />
        ) : (
          <FlatList
            data={sortedRequests}
            renderItem={({ item }) => {
              const request = item;
              const isOwner = request.ownerId === currentUserId;
              return (
                <Pressable
                  key={request._id}
                  bg="$white"
                  sx={{ ':active': { bg: '$coolGray200' } }}
                  onPress={() =>
                    navigation.navigate('Request', {
                      request,
                      currentUser,
                      isOwner,
                      name: isOwner ? request.requesterUsername : request.ownerUsername,
                    })
                  }
                >
                  <Box borderBottomColor="$coolGray200" borderBottomWidth={1} p="$2">
                    <HStack justifyContent="space-between">
                      <HStack alignItems="center" flex={1}>
                        <Box alignItems="center" w={60} pt="$2">
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
                            <Text size="xs">{request?.dateRequested?.toLocaleDateString()}</Text>
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
        )}
      </>
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
