import { lockAsync, OrientationLock } from "expo-screen-orientation"
import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { CameraView } from "./src/CameraView"

export default function App() {
  useEffect(() => {
    lockAsync(OrientationLock.LANDSCAPE)
  }, [])

  return (
    <View style={styles.container}>
      <CameraView />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
