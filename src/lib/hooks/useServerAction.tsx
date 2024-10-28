import {useState, useEffect, useTransition, useRef} from "react"
import {useBoolean} from "usehooks-ts"

/**
 * Call a server action and provide a pending state while the process is running.
 *
 * @see https://github.com/vercel/next.js/discussions/51371#discussioncomment-8671340
 *
 * @param action
 * @param onFinished
 */
const useServerAction = <P extends unknown[], R>(
  action?: (..._args: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void
): [(..._args: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<R>()
  const {value: finished, setTrue: setFinished} = useBoolean(false)
  const resolver = useRef<(_value?: R | PromiseLike<R>) => void>(undefined)

  useEffect(() => {
    if (!finished) return

    if (onFinished) onFinished(result)
    resolver.current?.(result)
  }, [result, finished, onFinished])

  const runAction = async (...args: P): Promise<R | undefined> => {
    startTransition(() => {
      if (action) {
        action(...args)
          .then(data => {
            setResult(data)
            setFinished()
          })
          .catch(_e => console.warn("An error happened with a server action."))
      }
    })

    return new Promise(resolve => {
      resolver.current = resolve
    })
  }

  return [runAction, isPending]
}

export default useServerAction
