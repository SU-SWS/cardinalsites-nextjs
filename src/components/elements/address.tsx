import {Address as AddressType} from "@lib/gql/__generated__/drupal.d";
type Props = AddressType & {
  singleLine?: boolean
}

const Address = ({
  addressLine1,
  addressLine2,
  administrativeArea,
  country,
  locality,
  organization,
  postalCode,
  singleLine = false
}: Props) => {


  if (singleLine) {
    const parts = [
      organization,
      addressLine1,
      addressLine2,
      locality,
      `${administrativeArea} ${postalCode}`,
      `${country?.code}`
    ];
    return (
      <address>{parts.filter(part => !!part).join(', ')}</address>
    )
  }

  return (
    <address>
      {organization && <div className="font-semibold">{organization}</div>}
      {(addressLine1) && <div>{addressLine1}</div>}
      {(addressLine2) && <div>{addressLine2}</div>}
      {(locality && (administrativeArea) && (postalCode)) &&
        <div>{locality}, {administrativeArea} {postalCode}</div>}
      {(country?.code) && <div>{country?.code}</div>}
    </address>
  )
}
export default Address;