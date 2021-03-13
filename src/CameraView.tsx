import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, StyleProp } from "react-native"
import { useSocket } from "./useSocket"

type CameraViewProps = {
  style?: StyleProp<ImageStyle>
}

export const CameraView: FC<CameraViewProps> = ({ style }) => {
  const [imageData, setImageData] = useState<string | undefined>()

  const socket = useSocket(12000)

  useEffect(() => {
    socket.on("image", (data) => {
      setImageData(data)
    })
  }, [socket])

  if (imageData === undefined) {
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
