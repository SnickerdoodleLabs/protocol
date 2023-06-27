import React, { useState, useRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";

const VideoPlayer = ({ source, ...props }) => {
  const [paused, setPaused] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: "https://drive.google.com/uc?export=download&id=1ohloSDHad0O8J2r-sqRIgS5xOtK8dedM",
        }}
        style={styles.video}
        resizeMode="contain"
        paused={paused}
        {...props}
      />
      <TouchableOpacity
        style={styles.playButtonContainer}
        onPress={togglePlay}
        activeOpacity={0.7}
      >
        <Icon
          name={paused ? "play" : "pause"}
          size={40}
          color="#FFFFFF"
          style={styles.playButton}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  video: {
    width: 300,
    height: 300,
  },
  playButtonContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 10,
  },
});
export default VideoPlayer;
