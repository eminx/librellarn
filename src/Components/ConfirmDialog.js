import React, { useRef } from "react";

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonText,
  Heading,
  HStack,
} from "@gluestack-ui/themed";

export default function ConfirmDialog({
  confirmButtonLabel = "Confirm",
  confirmButtonType = "blue",
  children,
  footer,
  header,
  isConfirmButtonDisabled,
  isOpen,
  size = "md",
  onClose,
  onConfirm,
  ...otherProps
}) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      size={size}
      onClose={onClose}
      {...otherProps}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogCloseButton />
        {header && (
          <AlertDialogHeader>
            <Heading>{header}</Heading>
          </AlertDialogHeader>
        )}
        <AlertDialogBody>{children}</AlertDialogBody>
        <AlertDialogFooter>
          <HStack justifyContent="space-between" w="100%">
            <Button
              variant="link"
              colorScheme="$coolGray"
              onPress={onClose}
              ref={cancelRef}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              colorScheme={confirmButtonType}
              isDisabled={isConfirmButtonDisabled}
              onPress={onConfirm}
            >
              <ButtonText>{confirmButtonLabel}</ButtonText>
            </Button>
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
