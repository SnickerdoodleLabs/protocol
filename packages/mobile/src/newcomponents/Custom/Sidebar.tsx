import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedWidth = useState(new Animated.Value(0))[0];

  const toggleSidebar = () => {
    const toValue = isOpen ? 0 : width * 0.8;
    Animated.timing(animatedWidth, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={toggleSidebar}>
          <Text style={styles.buttonText}>{isOpen ? 'Close' : 'Open'} Sidebar</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.sidebar, { width: animatedWidth }]}>
        <Text style={styles.sidebarTitle}>Sidebar</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  button: {
    padding: 16,
    backgroundColor: '#f4511e',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Sidebar;
