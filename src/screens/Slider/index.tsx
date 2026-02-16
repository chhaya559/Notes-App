import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
} from "react-native-reanimated";

const INITIAL_BOX_SIZE = 50;
//const SLIDER_WIDTH = 00;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const Slider = () => {
  const offset = useSharedValue<number>(0);
  const pressed = useSharedValue<boolean>(false);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      //   offset.value = event.translationX;
      offset.value = 100;
    })
    .onFinalize((e) => {
      offset.value = 0;
    });
  // .onFinalize(() => {
  //   offset.value = withSpring(0);
  //   pressed.value = false;
  // });

  //   const animatedStyles = useAnimatedStyle(() => ({
  //     transform: [
  //       { translateX: offset.value },
  //       { scale: withTiming(pressed.value ? 1.2 : 1) },
  //     ],
  //     backgroundColor: pressed.value ? "#FFE04B" : "#b58df1",
  //   }));

  const boxStyle = useAnimatedStyle(() => {
    return {};
  });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <AnimatedTextInput style={[styles.boxWidthText]} editable={false} /> */}
      {/* <Animated.View style={[styles.box, boxStyle]} /> */}
      <View style={styles.sliderTrack}>
        <Text>Hellllooo</Text>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.sliderHandle, sliderStyle]}>
            <Text>Swipee</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderTrack: {
    width: 250,
    height: 50,
    backgroundColor: "#fd0000ff",
    borderRadius: 15,
    justifyContent: "center",
    padding: 5,
  },
  sliderHandle: {
    width: 250,
    height: 50,
    backgroundColor: "#f8f9ff",
    borderRadius: 15,
    position: "absolute",
    left: 5,
  },
  //   box: {
  //     height: INITIAL_BOX_SIZE,
  //     backgroundColor: "#b58df1",
  //     borderRadius: 10,
  //   },
  //   boxWidthText: {
  //     textAlign: "center",
  //     fontSize: 18,
  //   },
});

export default Slider;
