import React from 'react';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  BadgeText,
  Box,
  Heading,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';

import Accordion from './Accordion';

export default function About({ user }) {
  if (!user) {
    return null;
  }

  const items = [
    {
      content: <AccordionContent user={user} />,
      title: <AccordionTitle user={user} />,
      value: user.username,
    },
  ];

  return (
    <Box bg="$blue50" w="100%">
      <Accordion items={items} />
    </Box>
  );
}

function AccordionTitle({ user }) {
  return (
    <HStack alignItems="center">
      <Box>
        <Avatar>
          <AvatarFallbackText>{user.username}</AvatarFallbackText>
          <AvatarImage alt={user.username} source={{ uri: user.images && user.images[0] }} />
        </Avatar>
      </Box>

      <VStack space="sm" px="$4">
        <Heading mb={-6} size="md">
          {user.username}
        </Heading>
        {user.firstName && user.lastName && <Text>{user.firstName + ' ' + user.lastName}</Text>}
      </VStack>
    </HStack>
  );
}

function AccordionContent({ user }) {
  return (
    <Box w="100%">
      {user.bio && (
        <Box pb="$2">
          <Text>{user.bio}</Text>
        </Box>
      )}
      <Box w="100%">
        <HStack flexWrap="wrap" space="2xs" w="100%" pb="$2">
          {user.languages &&
            user.languages.length > 0 &&
            user.languages.map((language, index) => (
              <Badge
                key={language?.value}
                action="info"
                mb="$2"
                mr="$2"
                size="sm"
                variant="outline"
              >
                <BadgeText>{language?.label?.toUpperCase()} </BadgeText>
              </Badge>
            ))}
        </HStack>
      </Box>
    </Box>
  );
}
