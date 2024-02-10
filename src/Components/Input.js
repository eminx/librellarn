import React from 'react';

import {
  CloseIcon,
  Icon,
  Input as GInput,
  InputIcon,
  InputField,
  InputSlot,
} from '@gluestack-ui/themed';

export default function Input({
  leftIcon,
  placeholder,
  showCLoseIcon = true,
  size = 'md',
  value,
  onChangeText,
  onPressCloseIcon,
  ...otherProps
}) {
  return (
    <GInput bg="$white" size={size} variant="rounded" {...otherProps}>
      {leftIcon && (
        <InputSlot pl="$3">
          <InputIcon>
            <Icon as={leftIcon} size={size} />
          </InputIcon>
        </InputSlot>
      )}
      <InputField placeholder={placeholder} value={value} onChangeText={onChangeText} />
      {showCLoseIcon && value?.length > 0 && (
        <InputSlot mb="$1" pr="$3" onPress={() => onPressCloseIcon()}>
          <InputIcon mt="$1">
            <Icon as={CloseIcon} size={size} />
          </InputIcon>
        </InputSlot>
      )}
    </GInput>
  );
}
