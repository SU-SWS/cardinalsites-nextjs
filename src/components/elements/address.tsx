import {Address as AddressType} from "@lib/gql/__generated__/drupal.d"
import {HTMLAttributes} from "react"

type Props = AddressType &
  HTMLAttributes<HTMLElement> & {
    singleLine?: boolean
  }

const Address = ({
  additionalName: _a,
  addressLine1,
  addressLine2,
  administrativeArea,
  country,
  locality,
  organization,
  postalCode,
  dependentLocality: _d,
  familyName: _f,
  givenName: _g,
  langcode: _l,
  sortingCode: _s,
  singleLine = false,
  ...props
}: Props) => {
  if (singleLine) {
    const parts = [
      organization,
      addressLine1,
      addressLine2,
      locality,
      `${administrativeArea} ${postalCode}`,
      `${country?.code}`,
    ]
    return <address {...props}>{parts.filter(part => !!part).join(", ")}</address>
  }

  return (
    <address {...props}>
      {organization && <div className="font-semibold">{organization}</div>}
      {addressLine1 && <div>{addressLine1}</div>}
      {addressLine2 && <div>{addressLine2}</div>}
      {locality && administrativeArea && postalCode && (
        <div>
          {locality}, {administrativeArea} {postalCode}
        </div>
      )}
      {country?.code && <div>{country?.code}</div>}
    </address>
  )
}
export default Address
