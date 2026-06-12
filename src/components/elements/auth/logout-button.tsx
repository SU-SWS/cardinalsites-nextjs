"use client"

import Button, {ButtonProps} from "@components/elements/button"

const LogoutButton = ({children, ...props}: ButtonProps) => {
  return (
    <Button {...props} href="/api/auth/logout">
      {children || "Log Out"}
    </Button>
  )
}
export default LogoutButton
