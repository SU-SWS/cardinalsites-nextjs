"use client"

import Button, {ButtonProps} from "@components/elements/button"

const LogoutButton = ({children, ...props}: ButtonProps) => {
  return (
    <Button {...props} prefetch={false} href="/api/auth/logout">
      {children || "Log Out"}
    </Button>
  )
}
export default LogoutButton
