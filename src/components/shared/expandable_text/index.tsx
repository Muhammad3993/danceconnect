import { Text, TextStyle } from 'react-native';
import React from 'react';

interface Props {
  style?: TextStyle;
  children?: string;
  expand: boolean;
  cutLength?: number;
}

export default function ExpandableText({
  style,
  children,
  expand,
  cutLength = 100,
}: Props) {
  if (!children || children.length === 0) {
    return null;
  }

  return (
    <Text style={style}>
      {children.length > cutLength && !expand
        ? `${children.slice(0, cutLength)}...`
        : children}
    </Text>
  );
}
