import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export const useSocket = (port: number) => {
  const [socket, _] = useState(
    io(`http://carpi.local:${port}/`, { autoConnect: false })
  )

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  return socket
}
