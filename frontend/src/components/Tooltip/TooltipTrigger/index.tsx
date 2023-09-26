import { HTMLProps, cloneElement, forwardRef, isValidElement } from "react"
import { useTooltipContext } from ".."
import { useMergeRefs } from "@floating-ui/react"

const TooltipTrigger = forwardRef<HTMLElement, HTMLProps<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = useTooltipContext()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const childrenRef = (children as any).ref
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
        })
      )
    }

    return <div
      ref={ref}
      {...context.getReferenceProps(props)}
    >
      {children}
    </div>
  }
)

export default TooltipTrigger
