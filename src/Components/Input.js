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
  value,
  onChangeText,
  onPressCloseIcon,
  ...otherProps
}) {
  return (
    <GInput bg="$white" variant="rounded" {...otherProps}>
      {leftIcon && (
        <InputSlot pl="$3" pt="$1">
          <InputIcon>
            <Icon as={leftIcon} size="sm" />
          </InputIcon>
        </InputSlot>
      )}
      <InputField placeholder={placeholder} pb="$2" value={value} onChangeText={onChangeText} />
      {showCLoseIcon && value?.length > 0 && (
        <InputSlot pr="$3" pt="$1" onPress={() => onPressCloseIcon()}>
          <InputIcon>
            <Icon as={CloseIcon} />
          </InputIcon>
        </InputSlot>
      )}
    </GInput>
  );
}
