type Props = {
  /**
   * New line delimited string.
   */
  text: string
  /**
   * Key prefix to split up each line.
   */
  key: string
}
const StringWithLines = ({text, key}: Props) => {
  return (
    <>
      {text.split("\n").map((line, i) =>
        <p key={`${key}--${i}`}>
          {line}
        </p>
      )}
    </>
  )
}
export default StringWithLines;