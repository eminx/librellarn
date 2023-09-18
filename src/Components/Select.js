import React from "react";
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
  SelectTrigger,
} from "@gluestack-ui/themed";

export default function Select({
  options,
  placeholder,
  variant,
  ...otherProps
}) {
  return (
    <GlSelect {...otherProps}>
      <SelectTrigger variant={variant} size="sm">
        <SelectInput placeholder={placeholder} />
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
          {options?.map((option) => (
            <SelectItem
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </GlSelect>
  );
}
