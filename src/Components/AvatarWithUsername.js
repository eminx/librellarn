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
      <Avatar bgColor="$amber400" borderRadius="$full">
        <AvatarFallbackText>{username?.toUpperCase()}</AvatarFallbackText>
        {image && <AvatarImage alt={username} source={{ uri: image }} />}
      </Avatar>
      <Center>
        <Text size="xs" isTruncated>
          {username}
        </Text>
      </Center>
    </VStack>
  );
}
