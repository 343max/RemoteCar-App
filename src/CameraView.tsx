import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, StyleProp } from "react-native"
import { useSocket } from "./useSocket"

type CameraViewProps = {
  style?: StyleProp<ImageStyle>
}

export const CameraView: FC<CameraViewProps> = ({ style }) => {
  const [imageData, setImageData] = useState<string | undefined>()
  const [connected, setConnected] = useState(false)

  const { socket, socketCreated } = useSocket(12000)

  if (socketCreated) {
    socket.on("image", (data) => {
      setImageData(data)
    })

    socket.on("connect", () => {
      setConnected(true)
    })

    socket.on("disconnect", () => {
      console.log("disconnected control!")
      setConnected(false)
    })
  }

  if (imageData === undefined || connected === false) {
    return <></>
  } else {
    return (
      <Image
        source={{ uri: "data:image/jpeg;base64," + imageData }}
        style={style}
      />
    )
  }
}
