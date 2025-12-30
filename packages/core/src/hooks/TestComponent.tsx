import { FC, RefObject } from "react"
import { useClickOutside } from "./useClickOutside"

type TestComponentProps = {
  callback: (event: MouseEvent) => void
}

const TestComponent: FC<TestComponentProps> = ({ callback }) => {
  const ref = { current: null } as RefObject<HTMLDivElement>

  useClickOutside(ref, callback)

  return (
    <div ref={ref} data-testid="test-div">
      Test
    </div>
  )
}

export default TestComponent
