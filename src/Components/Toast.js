import React from "react";
import {
  Toast as GToast,
  ToastTitle,
  ToastDescription,
  VStack,
} from "@gluestack-ui/themed";

export default function Toast({
  action = "success",
  id,
  message,
  title = "Success",
}) {
  return (
    <GToast nativeId={id} action={action} variant="outline">
      <VStack space="xs">
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{message}</ToastDescription>
      </VStack>
    </GToast>
  );
}
