import { useRef } from "react"
import { Animated } from "react-native"

export const useAnimatedValue = (value: number) =>
  useRef(new Animated.Value(value)).current
