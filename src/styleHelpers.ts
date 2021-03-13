import { ViewStyle } from "react-native"

export const circleStyle = (
  radius: number
): Pick<ViewStyle, "width" | "height" | "borderRadius"> => ({
  width: radius * 2,
  height: radius * 2,
  borderRadius: radius,
})

export const trackingStyle = (
  enabled: boolean
): Pick<ViewStyle, "backgroundColor" | "borderColor" | "borderWidth"> =>
  enabled
    ? {
        backgroundColor: "rgba(0,0,0,0.2)",
        borderColor: "rgba(255,255,255,0.3)",
        borderWidth: 1,
      }
    : {
        backgroundColor: "rgba(0,0,0,0.1)",
        borderColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
      }
