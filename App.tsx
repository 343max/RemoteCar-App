import { lockAsync, OrientationLock } from "expo-screen-orientation"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { CameraView } from "./src/CameraView"
import { JoystickState, Joystick } from "./src/Joystick"
import { AntDesign } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import {
  DirectionalJoystickState,
  DirectionalJoystick,
} from "./src/DirectionalJoystick"

export default function App() {
  const [cameraPanning, setCameraPanning] = useState<JoystickState>(null)
  const [
    drivingDirection,
    setDrivingDirection,
  ] = useState<DirectionalJoystickState>(null)
  const [throttling, setThrottling] = useState<DirectionalJoystickState>(null)

  useEffect(() => {
    lockAsync(OrientationLock.LANDSCAPE)
  }, [])

  useEffect(() => {
    console.log({ cameraPanning, drivingDirection, throttling })
  }, [cameraPanning, drivingDirection, throttling])

  return (
    <>
      <View style={styles.container}>
        <CameraView style={{ height: "100%", aspectRatio: 4 / 3 }} />
      </View>
      <View style={styles.joystickContainer}>
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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  joystickContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
})
