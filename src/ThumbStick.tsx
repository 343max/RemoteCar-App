import React, { FC, useEffect, useRef } from "react"
import { Animated, Easing, ViewStyle } from "react-native"
import { circleStyle } from "./styleHelpers"
import { useAnimatedValue } from "./useAnimatedValue"

export type RoundThumbStickProps = {
  radius: number
  transform?: Animated.WithAnimatedObject<ViewStyle>["transform"]
  pressed?: boolean
  enabled?: boolean
}

export const ThumbStick: FC<RoundThumbStickProps> = ({
  children,
  radius,
  transform = [],
  pressed = false,
  enabled = true,
}) => {
  const calcOpacity = (pressed: boolean) => (pressed ? 0.8 : 0.3)
  const calcScale = (enabled: boolean) => (enabled ? 1.0 : 0.6)
  // const calcBackgroundColor = (enabled: boolean) =>
  //   enabled ? "#ff8800" : "#444444"
  const opacity = useAnimatedValue(calcOpacity(pressed))
  const scale = useAnimatedValue(calcScale(enabled))

  useEffect(() => {
    if (pressed) {
      opacity.setValue(calcOpacity(pressed))
    } else {
      Animated.timing(opacity, {
        duration: 200,
        toValue: calcOpacity(pressed),
        useNativeDriver: true,
      }).start()
    }
  }, [pressed])

  useEffect(() => {
    Animated.timing(scale, {
      duration: 50,
      toValue: calcScale(enabled),
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start()
  }, [enabled])

  return (
    <Animated.View
      style={{
        ...circleStyle(radius),
        backgroundColor: enabled ? "#ff8800" : "#444444",
        opacity,
        transform: [...transform, { scale }],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Animated.View>
  )
}
