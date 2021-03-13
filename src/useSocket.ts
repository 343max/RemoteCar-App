import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export const useSocket = (port: number) => {
  let socketCreated: boolean = false
  const [socket, _] = useState(() => {
    socketCreated = true
    return io(`http://carpi.local:${port}/`, { autoConnect: false })
  })

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  return { socket, socketCreated }
}
