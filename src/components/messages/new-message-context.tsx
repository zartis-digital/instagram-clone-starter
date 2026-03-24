import { createContext, useContext } from "react"

const NewMessageContext = createContext<() => void>(() => {})

export const NewMessageProvider = NewMessageContext.Provider

export function useNewMessage() {
  return useContext(NewMessageContext)
}
