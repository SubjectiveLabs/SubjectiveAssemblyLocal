import { ReactNode, createContext, useContext, useMemo, useState } from "react"
import TooltipContent from "./TooltipContent"
import TooltipTrigger from "./TooltipTrigger"
import type { Placement } from "@floating-ui/react"
import { useFloating, autoUpdate, offset, flip, shift, useHover, useFocus, useDismiss, useRole, useInteractions } from "@floating-ui/react"

export { TooltipContent, TooltipTrigger }

export const useTooltip = ({
  initialOpen = false,
  placement = "bottom",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  initialOpen?: boolean
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "start",
        padding: 5,
      }),
      shift({ padding: 5 }),
    ]
  })
  const context = data.context
  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  })
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: "tooltip" })
  const interactions = useInteractions([hover, focus, dismiss, role])
  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  )
}
export const TooltipContext = createContext<ReturnType<typeof useTooltip> | null>(null);
export const useTooltipContext = () => {
  const context = useContext(TooltipContext)
  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip />")
  }
  return context
}
export const Tooltip = ({
  children,
  ...options
}: {
  children: ReactNode
  initialOpen?: boolean
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const tooltip = useTooltip(options)
  return <TooltipContext.Provider value={tooltip}>
    {children}
  </TooltipContext.Provider>
}
