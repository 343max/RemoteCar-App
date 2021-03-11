import { lockAsync, OrientationLock } from "expo-screen-orientation"
import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { CameraView } from "./src/CameraView"
import { JoystickView } from "./src/JoystickView"
import { AntDesign } from "@expo/vector-icons"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { HorizontalJoystickView } from "./src/HorizontalJoystickView"

export default function App() {
  useEffect(() => {
    lockAsync(OrientationLock.LANDSCAPE)
  }, [])

  const joystickPadding = 60

  return (
    <>
      <View style={styles.container}>
        <CameraView style={{ height: "100%", aspectRatio: 4 / 3 }} />
      </View>
      <View style={styles.joystickContainer}>
        <JoystickView
          onValueChanged={console.log}
          style={{
            position: "absolute",
            top: 60,
            left: 60,
          }}
          joystickRadius={40}
          trackingRadius={60}
        >
          <AntDesign name="videocamera" size={32} color="white" />
        </JoystickView>
        <HorizontalJoystickView
          onValueChanged={console.log}
          joystickRadius={40}
          trackingLength={180}
          style={{
            position: "absolute",
            left: 80,
            bottom: 80,
          }}
        >
          <MaterialCommunityIcons name="steering" size={32} color="white" />
        </HorizontalJoystickView>
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
