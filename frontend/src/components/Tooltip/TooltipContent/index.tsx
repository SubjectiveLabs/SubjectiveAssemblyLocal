import { HTMLProps, forwardRef } from "react"
import { useTooltipContext } from ".."
import { FloatingPortal, useMergeRefs } from "@floating-ui/react"
import classNames from "utils/classNames"

const TooltipContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ style, ...props }, propRef) => {
    const context = useTooltipContext()
    const ref = useMergeRefs([context.refs.setFloating, propRef])

    return <FloatingPortal>
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...style
        }}
        {...context.getFloatingProps(props)}
        className={classNames(
          'transition',
          context.open ? '' : 'opacity-0',
        )}
      >
      </div>
    </FloatingPortal>
  }
)

export default TooltipContent
