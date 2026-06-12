"use client"

import Button, {ButtonProps} from "@components/elements/button"
import {usePathname} from "next/navigation"

const LoginButton = ({children, ...props}: ButtonProps) => {
  const pathname = usePathname()
  return (
    <Button {...props} href={`/api/auth/login?destination=${pathname}`}>
      {children || "Log In"}
    </Button>
  )
}
export default LoginButton
