import React from 'react';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  BadgeText,
  Box,
  Center,
  Divider,
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
        <Heading mb="-$2" size="md">
          {user.username}
        </Heading>
        {user.firstName && user.lastName && <Text>{user.firstName + ' ' + user.lastName}</Text>}
      </VStack>
    </HStack>
  );
}

function AccordionContent({ user }) {
  return (
    <Box>
      {user.bio && (
        <Box pb="$4">
          <Text>{user.bio}</Text>
        </Box>
      )}
      <Center>
        <HStack flexWrap="wrap" justifyContent="center" space="2xs" px="$4">
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
      </Center>
    </Box>
  );
}
