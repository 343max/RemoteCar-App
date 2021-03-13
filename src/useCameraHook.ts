import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { clamp } from "./Clamp"
import { JoystickState } from "./Joystick"

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

  return {
    setCameraPanning: (panning: JoystickState) => {
      if (panning !== null && cameraAngle !== null && calibration !== null) {
        const diff = coordinatedFromState(panning)
        const m = 10
        const { round } = Math
        const { h_min, h_max, v_min, v_max } = calibration
        const precission = 10
        setCameraAngle((c) => ({
          h:
            round(clamp(h_min, c!.h - diff.h * m, h_max) / precission) *
            precission,
          v:
            round(clamp(v_min, c!.v + diff.v * m, v_max) / precission) *
            precission,
        }))
      }
    },
    setCameraCalibration,
  }
}
