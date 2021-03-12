import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Joystick, JoystickState } from "./Joystick"
import { AntDesign } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import {
  DirectionalJoystickState,
  DirectionalJoystick,
} from "./DirectionalJoystick"
import useInterval from "@rooks/use-interval"
import { useSocket } from "./useSocket"

type ControlLayerProps = {
  style?: ViewStyle
}

export const ControlLayer: FC<ControlLayerProps> = ({ style }) => {
  const [cameraPanning, setCameraPanning] = useState<JoystickState>(null)
  const [
    drivingDirection,
    setDrivingDirection,
  ] = useState<DirectionalJoystickState>(null)
  const [throttling, setThrottling] = useState<DirectionalJoystickState>(null)

  const sendDriveCommand = (left: number, right: number) => {
    socket.emit("steer", { left, right })
  }

  const [start, clear] = useInterval(() => {
    if (drivingDirection !== null) {
      const steeringDirection = drivingDirection ?? 0
      sendDriveCommand(-steeringDirection, steeringDirection)
    } else {
      sendDriveCommand(throttling ?? 0, throttling ?? 0)
    }
  }, 10)

  const socket = useSocket(8080, (socket) => {
    socket.on("connect", () => {
      console.log("connected!")
      start()
    })

    socket.on("disconnect", () => {
      console.log("disconnected!")
      clear()
    })
  })

  useEffect(() => {
    console.log({ cameraPanning, drivingDirection, throttling })
  }, [cameraPanning, drivingDirection, throttling])

  return (
    <View style={style}>
      <Joystick
        onValueChanged={setCameraPanning}
        style={{
          position: "absolute",
          top: 60,
          left: 60,
        }}
        joystickRadius={40}
        trackingRadius={60}
      >
        <AntDesign name="videocamera" size={32} color="white" />
      </Joystick>
      <DirectionalJoystick
        direction="horizontal"
        onValueChanged={setDrivingDirection}
        joystickRadius={40}
        trackingLength={180}
        style={{
          position: "absolute",
          left: 120,
          bottom: 125,
        }}
      >
        <MaterialCommunityIcons name="steering" size={32} color="white" />
      </DirectionalJoystick>
      <DirectionalJoystick
        direction="vertical"
        onValueChanged={setThrottling}
        joystickRadius={40}
        trackingLength={50}
        style={{
          position: "absolute",
          right: 240,
          bottom: 120,
        }}
      >
        <Ionicons name="ios-speedometer-outline" size={32} color="white" />
      </DirectionalJoystick>
    </View>
  )
}
