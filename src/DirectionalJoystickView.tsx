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

type JoystickState = null | number

type JoystickViewProps = {
  direction: "horizontal" | "vertical"
  style?: StyleProp<ViewStyle>
  onValueChanged: (value: JoystickState) => void
  joystickRadius: number
  trackingLength: number
}

const clamp = (min: number, value: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const DirectionalJoystickView: FC<JoystickViewProps> = ({
  direction,
  style,
  onValueChanged,
  joystickRadius,
  trackingLength,
  children,
}) => {
  const d = <T,>(horizontal: T, vertical: T): T =>
    direction === "horizontal" ? horizontal : vertical

  const translate = useRef(new Animated.Value(0)).current
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

  const [offset, setOffset] = useState(0)

  const onGestureEvent: Exclude<
    PanGestureHandlerProperties["onGestureEvent"],
    undefined
  > = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      const diff = clamp(
        -trackingLength / 2,
        d(nativeEvent.absoluteX, nativeEvent.absoluteY) - offset,
        trackingLength / 2
      )
      translate.setValue(diff)
      onValueChanged((diff / trackingLength) * 2)
    }
  }

  const onHandlerStateChange: Exclude<
    PanGestureHandlerProperties["onHandlerStateChange"],
    undefined
  > = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      setPanning(true)
      setOffset(d(nativeEvent.absoluteX, nativeEvent.absoluteY))
      onValueChanged(0)
    } else if (
      nativeEvent.state === State.END ||
      nativeEvent.state === State.CANCELLED
    ) {
      setPanning(false)
      Animated.timing(translate, {
        duration: 200,
        toValue: 0,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start()
      onValueChanged(null)
    }
  }

  const thickness = 16

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View
        style={[
          style,
          {
            height: d(thickness, trackingLength),
            borderRadius: 8,
            width: d(trackingLength, thickness),
            backgroundColor: "rgba(0,0,0,0.2)",
            borderColor: "rgba(255,255,255,0.3)",
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Animated.View
          style={{
            ...circleStyle(joystickRadius),
            backgroundColor: "#ff8800",
            opacity,
            transform: d(
              [{ translateX: translate }],
              [{ translateY: translate }]
            ),
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
