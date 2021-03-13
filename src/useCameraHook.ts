import useThrottle from "@rooks/use-throttle"
import { useEffect, useState } from "react"
import { pow } from "react-native-reanimated"
import { Socket } from "socket.io-client"
import { clamp } from "./Clamp"
import { Joystick, JoystickState } from "./Joystick"

export type CameraCalibration = Record<
  "h" | "v" | "h_min" | "h_middle" | "h_max" | "v_min" | "v_max",
  number
>

type CameraAngle = Record<"h" | "v", number>

const coordinatedFromState = ({
  rad,
  power,
}: Exclude<JoystickState, null>): CameraAngle => ({
  h: Math.cos(rad) * power,
  v: Math.sin(rad) * power,
})

export const useCameraHook = (socket: Socket) => {
  const [cameraAngle, setCameraAngle] = useState<CameraAngle | null>(null)
  const [panning, setPanning] = useState<JoystickState>(null)
  const [
    calibration,
    setCameraCalibration,
  ] = useState<CameraCalibration | null>(null)

  useEffect(() => {
    setCameraAngle(calibration)
  }, [calibration])

  useEffect(() => {
    if (cameraAngle !== null) {
      socket.emit("camera", cameraAngle)
    }
  }, [cameraAngle])

  const [triggerThorrtledUpdate] = useThrottle(() => {
    if (panning !== null && cameraAngle !== null && calibration !== null) {
      const diff = coordinatedFromState(panning)
      const m = 10
      const { round } = Math
      const { h_min, h_max, v_min, v_max } = calibration
      setCameraAngle((c) => ({
        h: round(clamp(h_min, c!.h - diff.h * m, h_max)),
        v: round(clamp(v_min, c!.v + diff.v * m, v_max)),
      }))
    }
  }, 10)

  return {
    setCameraPanning: (panning: JoystickState) => {
      setPanning(panning)
      triggerThorrtledUpdate()
    },
    setCameraCalibration,
  }
}
