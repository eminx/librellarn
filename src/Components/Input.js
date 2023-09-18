import React from 'react';

import {
  CloseIcon,
  Icon,
  Input as GInput,
  InputIcon,
  InputField,
  InputSlot,
  Pressable,
} from '@gluestack-ui/themed';

export default function Input({
  leftIcon,
  placeholder,
  showCLoseIcon = true,
  value,
  onChangeText,
  onPressCloseIcon,
  ...otherProps
}) {
  return (
    <GInput bg="$white" variant="rounded" {...otherProps}>
      {leftIcon && (
        <InputSlot pl="$3">
          <InputIcon>
            <Icon as={leftIcon} />
          </InputIcon>
        </InputSlot>
      )}
      <InputField placeholder={placeholder} value={value} onChangeText={onChangeText} />
      {showCLoseIcon && value?.length > 0 && (
        <InputSlot pr="$3">
          <Pressable onPress={() => onPressCloseIcon()}>
            <InputIcon>
              <Icon as={CloseIcon} />
            </InputIcon>
          </Pressable>
        </InputSlot>
      )}
    </GInput>
  );
}
