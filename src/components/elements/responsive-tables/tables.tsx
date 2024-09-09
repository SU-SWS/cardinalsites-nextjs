"use client"

import {
  Table as ResponsiveTable,
  Thead as ResponsiveThead,
  Tbody as ResponsiveTbody,
  Tr as ResponsiveTr,
  Th as ResponsiveTh,
  Td as ResponsiveTd,
} from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import {OmitProps as ResponsiveTableProps, TdProps} from "react-super-responsive-table/dist/esm/types"
import {HTMLAttributes} from "react"

export const Table = ({children, className, ...props}: ResponsiveTableProps) => {
  return (
    <ResponsiveTable {...props} className={className}>
      {children}
    </ResponsiveTable>
  )
}

export const Thead = ({children, ...props}: ResponsiveTableProps) => {
  return <ResponsiveThead {...props}>{children}</ResponsiveThead>
}
export const Tbody = ({children, ...props}: ResponsiveTableProps) => {
  return <ResponsiveTbody {...props}>{children}</ResponsiveTbody>
}
export const Tr = ({children, ...props}: ResponsiveTableProps) => {
  return <ResponsiveTr {...props}>{children}</ResponsiveTr>
}
export const Th = ({children, ...props}: ResponsiveTableProps) => {
  return <ResponsiveTh {...props}>{children}</ResponsiveTh>
}
export const Td = ({children, ...props}: Omit<TdProps & HTMLAttributes<HTMLTableCellElement>, "headers">) => {
  return <ResponsiveTd {...props}>{children}</ResponsiveTd>
}
