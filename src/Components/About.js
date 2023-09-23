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
} from '@gluestack-ui/themed';

export default function About({ user }) {
  if (!user) {
    return null;
  }

  return (
    <Box>
      <Center>
        <Text fontWeight="bold" mb="$2" size="lg">
          {user.username}
        </Text>
      </Center>
      <Center>
        {user.images && user.images.length > 0 ? (
          <Image alt={user.username} size="2xl" source={{ uri: user.images[0] }} />
        ) : (
          <Avatar size="2xl" name={user.username} />
        )}
      </Center>

      <Center>
        {user.firstName && user.lastName && (
          <Box pt="$2">
            <Text fontWeight="$bold">{user.firstName + ' ' + user.lastName}</Text>
          </Box>
        )}
        {user.bio && (
          <Box p="$2">
            <Text size="md" textAlign="center">
              {user.bio}
            </Text>
          </Box>
        )}
      </Center>

      <Center py="$2" mt="$2">
        <Heading size="md" textAlign="center" mb="$2" fontWeight="light">
          Languages
        </Heading>

        <Center>
          <HStack flexWrap="wrap" justifyContent="center" px="$4">
            {user.languages &&
              user.languages.length > 0 &&
              user.languages.map((language) => (
                <Center key={language?.value}>
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
                </Center>
              ))}
          </HStack>
        </Center>
      </Center>
    </Box>
  );
}
