"use client"

import CountUp from "react-countup"
import {CountUpProps} from "react-countup/build/CountUp"

const CountUpNumber = ({...props}: CountUpProps) => {
  return <CountUp {...props} />
}
export default CountUpNumber
