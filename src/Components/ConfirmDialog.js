import React, { useRef } from 'react';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonSpinner,
  ButtonText,
  Heading,
  HStack,
} from '@gluestack-ui/themed';

import { i18n } from '../../i18n';

export default function ConfirmDialog({
  confirmButtonLabel = 'Confirm',
  confirmButtonType = 'blue',
  children,
  footer,
  header,
  isConfirmButtonLoading,
  isOpen,
  size = 'md',
  onClose,
  onConfirm,
  ...otherProps
}) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      avoidKeyboard
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
            <Button variant="link" colorScheme="$coolGray" onPress={onClose} ref={cancelRef}>
              <ButtonText>{i18n.t('generic.cancel')}</ButtonText>
            </Button>
            <Button
              colorScheme={confirmButtonType}
              isDisabled={isConfirmButtonLoading}
              onPress={onConfirm}
              borderRadius="$full"
            >
              {isConfirmButtonLoading && <ButtonSpinner mr="$1" />}
              <ButtonText>{confirmButtonLabel}</ButtonText>
            </Button>
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
