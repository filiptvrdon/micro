import { createContext, useContext, useEffect, useState } from "react"

export type Font =
  | "jetbrains-mono"
  | "geist-sans"
  | "geist-mono"
  | "inter"
  | "ibm-plex-sans"
  | "ibm-plex-mono"
  | "plus-jakarta-sans"
  | "manrope"
  | "space-grotesk"
  | "archivo"

type FontProviderProps = {
  children: React.ReactNode
  defaultFont?: Font
  storageKey?: string
}

type FontProviderState = {
  font: Font
  setFont: (font: Font) => void
}

const initialState: FontProviderState = {
  font: "jetbrains-mono",
  setFont: () => null,
}

const FontProviderContext = createContext<FontProviderState>(initialState)

export function FontProvider({
  children,
  defaultFont = "jetbrains-mono",
  storageKey = "vite-ui-font",
  ...props
}: FontProviderProps) {
  const [font, setFont] = useState<Font>(
    () => (localStorage.getItem(storageKey) as Font) || defaultFont
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all possible font classes
    const fontClasses = [
      "font-jetbrains-mono",
      "font-geist-sans",
      "font-geist-mono",
      "font-inter",
      "font-ibm-plex-sans",
      "font-ibm-plex-mono",
      "font-plus-jakarta-sans",
      "font-manrope",
      "font-space-grotesk",
      "font-archivo"
    ]
    root.classList.remove(...fontClasses)

    // Add the selected font class
    root.classList.add(`font-${font}`)
  }, [font])

  const value = {
    font,
    setFont: (font: Font) => {
      localStorage.setItem(storageKey, font)
      setFont(font)
    },
  }

  return (
    <FontProviderContext.Provider {...props} value={value}>
      {children}
    </FontProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
  const context = useContext(FontProviderContext)

  if (context === undefined)
    throw new Error("useFont must be used within a FontProvider")

  return context
}
