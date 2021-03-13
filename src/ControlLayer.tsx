import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Joystick } from "./Joystick"
import { AntDesign } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import { DirectionalJoystick } from "./DirectionalJoystick"
import { useSocket } from "./useSocket"
import { CameraCalibration, useCameraHook } from "./useCameraHook"
import { useSteeringHook } from "./useSteeringHook"

type ControlLayerProps = {
  style?: ViewStyle
}

type CalibrationType = {
  camera: CameraCalibration
}

export const ControlLayer: FC<ControlLayerProps> = ({ style }) => {
  const [connected, setConnected] = useState(false)

  const { socket, socketCreated } = useSocket(8080)

  const { setCameraPanning, setCameraCalibration } = useCameraHook(socket)
  const { setSteering, setSpeed } = useSteeringHook(socket)

  if (socketCreated) {
    socket.on("connect", () => {
      console.log("connected control!")
      setConnected(true)
    })

    socket.on("calibrate", (data: CalibrationType) => {
      setCameraCalibration(data.camera)
      console.log("calibrated")
    })

    socket.on("disconnect", () => {
      console.log("disconnected control!")
      setCameraCalibration(null)
      setConnected(false)
    })
  }

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
        enabled={connected}
      >
        <AntDesign name="videocamera" size={32} color="white" />
      </Joystick>
      <DirectionalJoystick
        direction="horizontal"
        onValueChanged={(n) => setSteering(n ?? 0)}
        joystickRadius={40}
        trackingLength={180}
        enabled={connected}
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
        onValueChanged={(n) => setSpeed(n ?? 0)}
        joystickRadius={40}
        trackingLength={50}
        enabled={connected}
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
