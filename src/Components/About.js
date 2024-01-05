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
        {user.firstName && user.lastName && <Text>{user.firstName + ' ' + user.lastName}</Text>}
        {user.bio && <Text>{user.bio}</Text>}

        <HStack flexWrap="wrap" space="xs">
          {user.languages &&
            user.languages.length > 0 &&
            user.languages.map((language) => (
              <Badge
                key={language?.value}
                action="info"
                mb="$2"
                mr="$2"
                variant="outline"
                size="sm"
              >
                <BadgeText>{language?.label?.toUpperCase()} </BadgeText>
              </Badge>
            ))}
        </HStack>
      </VStack>
    </HStack>
  );
}
