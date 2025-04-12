"use client"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export const BackgroundBeams = ({
    className,
}: {
    className?: string
}) => {
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    })

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                setMousePosition({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                })
            }
        }

        const element = ref.current
        if (element) {
            element.addEventListener("mousemove", handleMouseMove)
        }

        return () => {
            if (element) {
                element.removeEventListener("mousemove", handleMouseMove)
            }
        }
    }, [])

    return (
        <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
            <div
                className="pointer-events-none absolute -inset-[100%] opacity-20"
                style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--accent) 0%, transparent 60%)`,
                }}
            />
        </div>
    )
}
