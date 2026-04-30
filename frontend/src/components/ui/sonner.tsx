"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "hsl(0 0% 100%)",
          "--normal-text": "hsl(240 10% 3.9%)",
          "--normal-border": "hsl(240 5.9% 90%)",
          "--border-radius": "var(--radius)",
          "--toast-bg": "white",
          "--toast-text": "#111827",
          "--toast-description-text": "#4b5563",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast !bg-white !border !border-gray-200 !shadow-lg",
          title: "!text-gray-900 !font-semibold !text-sm",
          description: "!text-gray-700 !text-sm !mt-1",
        },
        style: {
          background: 'white',
          color: '#111827',
          border: '1px solid #e5e7eb',
        },
        descriptionClassName: '!text-gray-700 !opacity-100',
      }}
      {...props}
    />
  )
}

export { Toaster }
