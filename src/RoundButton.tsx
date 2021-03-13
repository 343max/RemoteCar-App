import React, { FC, useState } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { State, TapGestureHandler } from "react-native-gesture-handler"
import { ThumbStick } from "./ThumbStick"

type RoundButtonProps = {
  radius: number
  enabled?: boolean
  style?: StyleProp<ViewStyle>
  onPress: () => void
}

export const RoundButton: FC<RoundButtonProps> = ({
  radius,
  enabled,
  style,
  onPress,
  children,
}) => {
  const [pressed, setPressed] = useState(false)
  return (
    <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        setPressed(
          nativeEvent.state === State.ACTIVE ||
            nativeEvent.state === State.BEGAN
        )
        if (nativeEvent.state === State.END) {
          onPress()
        }
      }}
    >
      <View style={style}>
        <ThumbStick radius={radius} enabled={enabled} pressed={pressed}>
          {children}
        </ThumbStick>
      </View>
    </TapGestureHandler>
  )
}
