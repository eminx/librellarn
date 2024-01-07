import React from 'react';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Center,
  VStack,
  Text,
} from '@gluestack-ui/themed';

export default function AvatarWithUsername({ image, username }) {
  return (
    <VStack alignItems="center">
      <Avatar bgColor="$amber400" borderRadius="$full" source={{ uri: image }}>
        <AvatarFallbackText>{username?.toUpperCase()}</AvatarFallbackText>
        <AvatarImage alt={username} source={{ uri: image }} />
      </Avatar>
      <Center>
        <Text size="sm">{username}</Text>
      </Center>
    </VStack>
  );
}
