const StringWithLines = ({text, key}: { text: string, key: string }) => {
  return (
    <>
      {text.split('\n').map((line, i) =>
        <p key={`${key}--${i}`}>
          {line}
        </p>
      )}
    </>
  )
}
export default StringWithLines;