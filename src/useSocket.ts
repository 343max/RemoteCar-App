import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export const useSocket = (
  port: number,
  socketSetup?: (socket: ReturnType<typeof io>) => void
) => {
  const [socket, _] = useState(
    io(`http://carpi.local:${port}/`, { autoConnect: false })
  )

  useEffect(() => {
    if (socketSetup !== undefined) {
      socketSetup(socket)
    }

    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  return socket
}
