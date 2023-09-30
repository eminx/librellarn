import React from 'react';
import { Alert as GlAlert, AlertIcon, AlertText, InfoIcon } from '@gluestack-ui/themed';

export default function Alert({ action = 'info', variant = 'solid', children, ...otherProps }) {
  return (
    <GlAlert mx="$2.5" action={action} variant={variant} {...otherProps}>
      <AlertIcon as={InfoIcon} mr="$3" />
      <AlertText>{children}</AlertText>
    </GlAlert>
  );
}
