/* Motion permission prompt — intentionally disabled.
   The iOS DeviceOrientation permission prompt hurt conversion, so we don't ask.
   PUM_TILT (src/lib/motion.jsx) registers touch-drag + cursor listeners
   unconditionally, so that fallback motion is the default and nothing is inert. */
export function MotionPermission() {
  return null
}
