import React, { FC, useRef, useState } from "react"
import { Animated, Easing, StyleProp, View, ViewStyle } from "react-native"
import {
  PanGestureHandler,
  PanGestureHandlerProperties,
  State,
} from "react-native-gesture-handler"
import { ThumbStick } from "./ThumbStick"
import { circleStyle, trackingStyle } from "./styleHelpers"
import { useAnimatedValue } from "./useAnimatedValue"

export type JoystickState = null | { rad: number; power: number }

type JoystickViewProps = {
  style?: StyleProp<ViewStyle>
  onValueChanged: (value: JoystickState) => void
  joystickRadius: number
  trackingRadius: number
  enabled?: boolean
}

export const Joystick: FC<JoystickViewProps> = ({
  style,
  onValueChanged,
  joystickRadius,
  trackingRadius,
  enabled = true,
  children,
}) => {
  const translateX = useAnimatedValue(0)
  const translateY = useAnimatedValue(0)

  const [panning, setPanning] = useState(false)

  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const onGestureEvent: Exclude<
    PanGestureHandlerProperties["onGestureEvent"],
    undefined
  > = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      const x = nativeEvent.absoluteX - offset.x
      const y = nativeEvent.absoluteY - offset.y
      const rad = Math.atan2(y, x)
      const length = Math.min(Math.sqrt(x * x + y * y), trackingRadius)
      translateX.setValue(Math.cos(rad) * length)
      translateY.setValue(Math.sin(rad) * length)
      onValueChanged({ rad, power: length / trackingRadius })
    }
  }

  const onHandlerStateChange: Exclude<
    PanGestureHandlerProperties["onHandlerStateChange"],
    undefined
  > = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      setPanning(true)
      setOffset({ x: nativeEvent.absoluteX, y: nativeEvent.absoluteY })
      onValueChanged({ rad: 0, power: 0 })
    } else if (
      nativeEvent.state === State.END ||
      nativeEvent.state === State.CANCELLED
    ) {
      setPanning(false)
      ;[translateX, translateY].forEach((value) => {
        Animated.timing(value, {
          duration: 200,
          toValue: 0,
          easing: Easing.bounce,
          useNativeDriver: true,
        }).start()
      })
      onValueChanged(null)
    }
  }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View
        style={[
          style,
          {
            ...circleStyle(trackingRadius),
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            ...trackingStyle(enabled),
          },
        ]}
      >
        <ThumbStick
          radius={joystickRadius}
          transform={[{ translateX }, { translateY }]}
          pressed={panning}
          enabled={enabled}
        >
          {children}
        </ThumbStick>
      </View>
    </PanGestureHandler>
  )
}
