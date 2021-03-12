import { lockAsync, OrientationLock } from "expo-screen-orientation"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { CameraView } from "./src/CameraView"
import { ControlLayer } from "./src/ControlLayer"

export default function App() {
  useEffect(() => {
    lockAsync(OrientationLock.LANDSCAPE)
  }, [])

  return (
    <>
      <View style={styles.container}>
        <CameraView style={{ height: "100%", aspectRatio: 4 / 3 }} />
        <ControlLayer style={styles.joystickContainer} />
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
