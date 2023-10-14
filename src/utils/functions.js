import Meteor from '@meteorrn/core';
import React from 'react';
import { Text } from '@gluestack-style/react';

const call = (method, ...parameters) =>
  new Promise((resolve, reject) => {
    Meteor.call(method, ...parameters, (error, respond) => {
      if (error) reject(error);
      resolve(respond);
    });
  });

function parseAuthors(authors) {
  if (!authors) {
    return <Text color="$coolGray800">unknown authors</Text>;
  }
  return authors.map((author, index) => (
    <Text key={author}>{author + (authors.length !== index + 1 ? ', ' : '')}</Text>
  ));
}

export { call, parseAuthors };
