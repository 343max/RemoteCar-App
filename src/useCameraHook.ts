import useInterval from "@rooks/use-interval"
import usePrevious from "@rooks/use-previous"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { clamp } from "./Clamp"
import { JoystickState } from "./Joystick"

export type CameraCalibration = Record<
  "h" | "v" | "h_min" | "h_middle" | "h_max" | "v_min" | "v_max" | "v_middle",
  number
>

type CameraAngle = Record<"h" | "v", number>

const coordinatesFromState = ({
  rad,
  power,
}: Exclude<JoystickState, null>): CameraAngle => ({
  h: Math.cos(rad) * power,
  v: Math.sin(rad) * power,
})

export const useCameraHook = (socket: Socket) => {
  const [cameraAngle, setCameraAngle] = useState<CameraAngle | null>(null)
  const [panning, setPanning] = useState<JoystickState>(null)
  const previousPanning = usePrevious(panning)
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

  const sendCameraPosition = () => {
    if (panning !== null && cameraAngle !== null && calibration !== null) {
      const diff = coordinatesFromState(panning)
      const m = 10
      const { round } = Math
      const { h_min, h_max, v_min, v_max } = calibration
      const precission = 1
      setCameraAngle((c) => ({
        h:
          round(clamp(h_min, c!.h - diff.h * m, h_max) / precission) *
          precission,
        v:
          round(clamp(v_min, c!.v + diff.v * m, v_max) / precission) *
          precission,
      }))
    }
  }

  const [startInterval, clearInterval] = useInterval(() => {
    sendCameraPosition()
  }, 10)

  useEffect(() => {
    if (panning !== null && previousPanning === null) {
      // joystick pressed
      console.log("joystick down")
      startInterval()
    } else if (panning === null && previousPanning !== null) {
      // joystick released
      console.log("joystick up")
      clearInterval()
      sendCameraPosition
    }
  }, [panning])

  return {
    setCameraPanning: setPanning,
    setCameraCalibration,
    resetCameraPanning: () => {
      if (calibration !== null) {
        setCameraAngle({ h: calibration.h_middle, v: calibration.v_middle })
      }
    },
  }
}
