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
  value,
  ...otherProps
}) {
  return (
    <GlSelect {...otherProps}>
      <SelectTrigger bg="$white" size={size} variant={variant}>
        <SelectInput placeholder={placeholder} placeholderTextColor="#262626" value={value} />
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
