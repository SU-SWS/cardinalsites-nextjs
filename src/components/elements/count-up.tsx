"use client"

import {useEffect, useRef, useState} from "react"
import {motion, useInView, useMotionValue, useSpring, useReducedMotion} from "motion/react"
import {useComponentAnimation} from "@hooks/useComponentAnimation"

type CountUpProps = {
  end: number | string
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

const parseNumber = (value: number | string): number => {
  if (typeof value === "number") return value
  const parsed = parseFloat(String(value).replace(/,/g, ""))
  return isNaN(parsed) ? 0 : parsed
}

const formatNumber = (value: number, decimals: number): string => {
  // Ensure we have a valid number
  const num = Number(value)
  if (isNaN(num)) return "0"

  // Format with proper decimal places first
  const fixed = decimals > 0 ? num.toFixed(decimals) : Math.floor(num).toString()

  // Split into integer and decimal parts
  const parts = fixed.split(".")
  const integerPart = parts[0]
  const decimalPart = parts[1]

  // Add commas to integer part
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  // Combine parts
  return decimalPart ? `${withCommas}.${decimalPart}` : withCommas
}

const CountUpNumber = ({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  ...props
}: CountUpProps) => {
  const prefersReducedMotion = useReducedMotion()

  // Check if animations are enabled for this component
  const {isEnabled} = useComponentAnimation()
  const isAnimationEnabled = isEnabled("statCard")

  // Parse string value that may contain commas
  const parsedEnd = parseNumber(end)

  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: prefersReducedMotion || !isAnimationEnabled ? 0 : duration * 1000,
    bounce: 0,
  })
  const [displayValue, setDisplayValue] = useState(0)
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
      motionValue.set(parsedEnd)
    }
  }, [motionValue, parsedEnd, isInView])

  const formattedValue = formatNumber(displayValue, decimals)

  return (
    <motion.span ref={ref} className={className} {...props}>
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  )
}

export default CountUpNumber
