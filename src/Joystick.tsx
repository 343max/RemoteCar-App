import React, { FC, useEffect, useRef, useState } from "react"
import { Animated, Easing, StyleProp, View, ViewStyle } from "react-native"
import {
  PanGestureHandler,
  PanGestureHandlerProperties,
  State,
} from "react-native-gesture-handler"

const circleStyle = (
  radius: number
): Pick<ViewStyle, "width" | "height" | "borderRadius"> => ({
  width: radius * 2,
  height: radius * 2,
  borderRadius: radius,
})

export type JoystickState = null | { rad: number; power: number }

type JoystickViewProps = {
  style?: StyleProp<ViewStyle>
  onValueChanged: (value: JoystickState) => void
  joystickRadius: number
  trackingRadius: number
}

export const Joystick: FC<JoystickViewProps> = ({
  style,
  onValueChanged,
  joystickRadius,
  trackingRadius,
  children,
}) => {
  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(1)).current

  const [panning, setPanning] = useState(false)

  useEffect(() => {
    if (panning) {
      opacity.setValue(0.8)
    } else {
      Animated.timing(opacity, {
        duration: 200,
        toValue: 0.3,
        useNativeDriver: true,
      }).start()
    }
  }, [panning])

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
            backgroundColor: "rgba(0,0,0,0.2)",
            borderColor: "rgba(255,255,255,0.3)",
            borderWidth: 1,
          },
        ]}
      >
        <Animated.View
          style={{
            ...circleStyle(joystickRadius),
            backgroundColor: "#ff8800",
            opacity,
            transform: [{ translateX }, { translateY }],
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </Animated.View>
      </View>
    </PanGestureHandler>
  )
}
