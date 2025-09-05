"use client"

import {useEffect, useRef, useState} from "react"
import {motion, useInView, useMotionValue, useSpring, useReducedMotion} from "motion/react"

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

const CountUpNumber = ({
  end,
  start = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  ...props
}: CountUpProps) => {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(start)
  const springValue = useSpring(motionValue, {
    duration: prefersReducedMotion ? 0 : duration * 1000,
    bounce: 0,
  })
  const [displayValue, setDisplayValue] = useState(start)
  const isInView = useInView(ref, {once: true})

  useEffect(() => {
    const unsubscribe = springValue.on("change", latest => {
      setDisplayValue(parseFloat(latest.toFixed(decimals)))
    })

    return () => {
      unsubscribe()
    }
  }, [springValue, decimals])

  useEffect(() => {
    if (isInView) {
      motionValue.set(end)
    }
  }, [motionValue, end, isInView])

  const formattedValue = decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue).toString()

  return (
    <motion.span ref={ref} className={className} {...props}>
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  )
}

export default CountUpNumber
