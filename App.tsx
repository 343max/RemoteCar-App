import { lockAsync, OrientationLock } from "expo-screen-orientation"
import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { CameraView } from "./src/CameraView"
import { JoystickView } from "./src/JoystickView"
import { AntDesign } from "@expo/vector-icons"

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
            bottom: joystickPadding,
            left: joystickPadding,
          }}
          joystickRadius={40}
          trackingRadius={100}
        >
          <AntDesign name="videocamera" size={32} color="white" />
        </JoystickView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  joystickContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
})
