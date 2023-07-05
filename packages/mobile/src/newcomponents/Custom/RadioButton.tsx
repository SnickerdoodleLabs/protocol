import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type RadioButtonProps = {
  label: string;
  checked: boolean;
  onPress: () => void;
};

const RadioButton = ({ label, checked, onPress }: RadioButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.radio}>
        {checked && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width:'90%'
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6E62A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6E62A6',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default RadioButton;
