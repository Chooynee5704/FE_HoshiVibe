import { useState, useCallback } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

interface FlyAnimationState {
  isAnimating: boolean
  startPosition: { x: number; y: number } | null
  endPosition: { x: number; y: number } | null
}

export const useFlyAnimation = () => {
  const [animationState, setAnimationState] = useState<FlyAnimationState>({
    isAnimating: false,
    startPosition: null,
    endPosition: null
  })

  type TriggerEvent =
    | ReactMouseEvent<HTMLElement>
    | MouseEvent
    | PointerEvent

  const resolveCenter = (element: Element | null) => {
    if (!element) return null
    const rect = element.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }

  const triggerFlyAnimation = useCallback((
    clickEvent?: TriggerEvent | null,
    cartIconId: string = 'nav-cart-icon'
  ) => {
    if (typeof window === 'undefined') return

    const cartIcon = document.getElementById(cartIconId)
    if (!cartIcon) return

    const cartCenter = resolveCenter(cartIcon)
    if (!cartCenter) return

    const candidateElement =
      clickEvent && 'currentTarget' in clickEvent && clickEvent.currentTarget instanceof Element
        ? clickEvent.currentTarget
        : clickEvent && 'target' in clickEvent && clickEvent.target instanceof Element
          ? clickEvent.target
          : null

    const elementCenter = resolveCenter(candidateElement)

    const pointerX =
      clickEvent && 'clientX' in clickEvent ? clickEvent.clientX : undefined
    const pointerY =
      clickEvent && 'clientY' in clickEvent ? clickEvent.clientY : undefined

    const startPosition =
      elementCenter ??
      (pointerX !== undefined && pointerY !== undefined
        ? { x: pointerX, y: pointerY }
        : cartCenter)

    setAnimationState({
      isAnimating: true,
      startPosition,
      endPosition: cartCenter
    })
  }, [])

  const completeAnimation = useCallback(() => {
    setAnimationState({
      isAnimating: false,
      startPosition: null,
      endPosition: null
    })
    // Dispatch event to trigger cart animation
    window.dispatchEvent(new CustomEvent('cartItemAdded'))
  }, [])

  return {
    animationState,
    triggerFlyAnimation,
    completeAnimation
  }
}
