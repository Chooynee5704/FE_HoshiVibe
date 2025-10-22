import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface FlyAnimationProps {
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  onComplete: () => void
  duration?: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  const p = t - 1
  return 1 + c3 * p * p * p + c1 * p * p
}

const FlyAnimation = ({
  startPosition,
  endPosition,
  onComplete,
  duration = 800
}: FlyAnimationProps) => {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)
  const completionRef = useRef(false)

  useEffect(() => {
    completionRef.current = false
    setProgress(0)

    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const nextProgress = Math.min(1, elapsed / duration)
      setProgress(nextProgress)

      if (nextProgress < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        frameRef.current = null
      }
    }

    frameRef.current = requestAnimationFrame(step)

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [duration, startPosition, endPosition])

  useEffect(() => {
    if (progress < 1 || completionRef.current) return

    completionRef.current = true
    const timeoutId = window.setTimeout(onComplete, 120)
    return () => window.clearTimeout(timeoutId)
  }, [progress, onComplete])

  const eased = easeOutCubic(progress)
  const currentX = startPosition.x + (endPosition.x - startPosition.x) * eased
  const baseY = startPosition.y + (endPosition.y - startPosition.y) * eased
  const arcHeight = 60
  const arcOffset = Math.sin(Math.PI * eased) * arcHeight
  const currentY = baseY - arcOffset

  const entryProgress = Math.min(1, progress / 0.25)
  const exitProgress = progress > 0.7 ? Math.min(1, (progress - 0.7) / 0.3) : 0
  const scale =
    progress < 0.7
      ? clamp(0.6 + easeOutBack(entryProgress) * 0.45, 0.6, 1.25)
      : clamp(1.05 - exitProgress * 0.55, 0.45, 1.1)
  const opacity = clamp(progress < 0.85 ? 1 : 1 - (progress - 0.85) / 0.15, 0, 1)
  const rotation = (1 - progress) * 14
  const glowOpacity = clamp(0.2 + (1 - progress) * 0.3, 0.15, 0.5)

  const content = (
    <div
      style={{
        position: 'fixed',
        left: currentX,
        top: currentY,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform, opacity',
        filter: `drop-shadow(0 8px 18px rgba(0, 0, 0, ${0.25 + 0.35 * (1 - progress)}))`
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 30,
          height: 30
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0) 70%)',
            opacity: glowOpacity,
            filter: 'blur(4px)'
          }}
        />
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 60%, #374151 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="20" r="1.6" />
            <circle cx="18" cy="20" r="1.6" />
            <path d="M2.5 4.5h3l2.2 10.2a1.2 1.2 0 0 0 1.18.95H18.5a1.2 1.2 0 0 0 1.13-.8L22 8H6.2" />
          </svg>
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(content, document.body)
}

export default FlyAnimation
