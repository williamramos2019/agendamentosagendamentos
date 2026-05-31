import { useState } from "react"

export function useToast() {
  const [toast, setToast] = useState(null)
  return { toast }
}
