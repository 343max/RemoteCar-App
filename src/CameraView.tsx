import React, { FC, useState } from "react"
import { Image } from "react-native"
import { useSocket } from "./useSocket"

export const CameraView: FC = () => {
  const [imageData, setImageData] = useState<string | undefined>()

  useSocket((socket) => {
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
        style={{ width: 640 / 2, height: 480 / 2 }}
      />
    )
  }
}
