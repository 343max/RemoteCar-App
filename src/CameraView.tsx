import React, { FC, useState } from "react"
import { Image, ImageStyle, StyleProp } from "react-native"
import { useSocket } from "./useSocket"

type CameraViewProps = {
  style?: StyleProp<ImageStyle>
}

export const CameraView: FC<CameraViewProps> = ({ style }) => {
  const [imageData, setImageData] = useState<string | undefined>()

  useSocket(12000, (socket) => {
    socket.on("image", (data) => {
      setImageData(data)
    })
  })

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
