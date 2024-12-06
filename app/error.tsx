  "use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { toast } = useToast()

  useEffect(() => {
    toast({
      variant: "destructive",
      title: "An error occurred",
      description: error.message,
      action: (
        <button
          onClick={() => reset()}
          className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
        >
          Try again
        </button>
      ),
    })
  }, [error, reset, toast])

  return null
}