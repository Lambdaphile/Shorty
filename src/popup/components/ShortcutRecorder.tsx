import { useState, KeyboardEvent } from 'react'

const checkIsOperationalKey = (key?: string) => {
  return key === 'control' || key === 'shift' || key === 'alt' || key === 'meta'
}

const ShortcutRecorder = () => {
  const [recordedKeys, setRecordedKeys] = useState<string[]>([])
  const [baseKey, setBaseKey] = useState<string | null>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()

    const currentKey = event.key.toLowerCase()

    const isOperationalKey = checkIsOperationalKey(currentKey)
    const firstPressedKey = recordedKeys[0]

    if (isOperationalKey) {
      setBaseKey((prevBaseKey) =>
        prevBaseKey ? `${prevBaseKey}+${currentKey}` : currentKey,
      )

      // Ignore the consecutive press of 'control', 'shift', 'option', and 'command' keys
      if (firstPressedKey === currentKey) {
        return
      }
    }

    if (baseKey === null) {
      setRecordedKeys((prevKeyPressed) =>
        prevKeyPressed.length === 2
          ? [currentKey]
          : [...prevKeyPressed, currentKey],
      )
      return
    }

    const recordKeysCopy = [...recordedKeys]
    const lastElement = recordKeysCopy.pop()
    const lastKey = lastElement?.split('+').pop()

    // If another key is pressed while holding down the same operational key, not change the previous combination
    // Ex: "cmd+a+b" => "cmd+a cmd+b"
    if (lastElement && !checkIsOperationalKey(lastKey)) {
      recordKeysCopy.push(lastElement)
    }

    const newKey = `${baseKey}+${currentKey}`
    recordKeysCopy.push(newKey)

    const updatedRecordedKeys =
      recordKeysCopy.length > 2 ? [newKey] : recordKeysCopy
    setRecordedKeys(updatedRecordedKeys)
  }

  const handleKeyUp = () => {
    setBaseKey(null)
  }

  const value = recordedKeys.join(' ')
  return (
    <>
      <input value={value} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
      <button onClick={() => setRecordedKeys([])}>Clear</button>
    </>
  )
}

export default ShortcutRecorder
