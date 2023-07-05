import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 428;
const guidelineBaseHeight = 926;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const scaleWidth = SCREEN_WIDTH / 428;
const scaleHeight = SCREEN_HEIGHT / 926;

export function normalizeWidth(size) {
  const newSize = size * scaleWidth;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
export function normalizeHeight(size) {
  const newSize = size * scaleHeight;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export { horizontalScale, verticalScale, moderateScale };
