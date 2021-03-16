import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

const calculateMotorSpeed = (
  steering: number,
  speed: number
): [left: number, right: number] => {
  if (speed === 0) {
    return [-steering, steering]
  } else if (speed > 0) {
    if (steering > 0) {
      return [speed - steering, speed]
    } else {
      return [speed, speed + steering]
    }
  } else {
    if (steering > 0) {
      return [speed, speed + steering]
    } else {
      return [speed - steering, speed]
    }
  }
}

export const useSteeringHook = (socket: Socket) => {
  const [speed, setSpeed] = useState<number>(0)
  const [steering, setSteering] = useState<number>(0)

  useEffect(() => {
    const [left, right] = calculateMotorSpeed(steering, speed)
    socket.emit("steer", { left, right })
  }, [speed, steering])

  return {
    setSpeed: (speed: number) => setSpeed(Math.round(speed * 10) / 10),
    setSteering: (steering: number) =>
      setSteering(Math.round(steering * 10) / 10),
  }
}
