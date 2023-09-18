import React from "react";
import { ScrollView } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@gluestack-ui/themed";

export default function ActionSheet({ isOpen, options, onClose, onPress }) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} zIndex={999}>
      <ActionsheetBackdrop />
      <ActionsheetContent zIndex={999}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ScrollView>
          {options.map((option) => (
            <ActionsheetItem key={option.value} onPress={() => onPress(option)}>
              <ActionsheetItemText>{option.label}</ActionsheetItemText>
            </ActionsheetItem>
          ))}
        </ScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
}
