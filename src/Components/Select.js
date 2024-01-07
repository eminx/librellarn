import React from 'react';
import {
  ChevronDownIcon,
  Icon,
  Select as GlSelect,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
  Text,
} from '@gluestack-ui/themed';

export default function Select({
  options,
  placeholder = 'Select option',
  size = 'md',
  variant = 'rounded',
  ...otherProps
}) {
  return (
    <GlSelect {...otherProps}>
      <SelectTrigger size={size} variant={variant}>
        <SelectInput />
        <Text color="$coolGray600" mr="$4">
          {placeholder}
        </Text>
        <SelectIcon mr="$3">
          <Icon as={ChevronDownIcon} />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectScrollView>
            {options?.map((option) => (
              <SelectItem key={option.value} label={option.label} value={option.value} />
            ))}
          </SelectScrollView>
        </SelectContent>
      </SelectPortal>
    </GlSelect>
  );
}
