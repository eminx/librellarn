import React from 'react';
import {
  Avatar,
  Badge,
  BadgeText,
  Box,
  Center,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed';

export default function About({ user }) {
  if (!user) {
    return null;
  }

  return (
    <>
      <HStack px="$4">
        <Box>
          {user.images && user.images.length > 0 ? (
            <Image alt={user.username} size="xl" source={{ uri: user.images[0] }} />
          ) : (
            <Avatar size="xl" name={user.username} />
          )}
        </Box>

        <VStack space="sm" px="$4">
          <Heading size="md">{user.username}</Heading>
          {user.firstName && user.lastName && (
            <Text fontWeight="bold">{user.firstName + ' ' + user.lastName}</Text>
          )}
          {user.bio && <Text fontWeight="bold">{user.bio}</Text>}
        </VStack>
      </HStack>
      <HStack flexWrap="wrap" space="xs" px="$4" pt="$4">
        <Text size="sm">Reads in:</Text>
        {user.languages &&
          user.languages.length > 0 &&
          user.languages.map((language, index) => (
            <Text key={language.value} color="$coolGray600" mr="$1" size="sm">
              {language?.label}
              {index < user.languages.length - 1 && ','}
            </Text>
            // <Badge
            //   key={language?.value}
            //   action="info"
            //   mb="$2"
            //   mr="$2"
            //   variant="outline"
            //   size="sm"
            // >
            //   <BadgeText>{language?.label?.toUpperCase()} </BadgeText>
            // </Badge>
          ))}
      </HStack>
    </>
  );
}
