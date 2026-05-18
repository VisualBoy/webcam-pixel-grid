"use client"

import { useState, useEffect } from "react"

interface GridResolution {
  cols: number
  rows: number
  isPortrait: boolean
}

export function useGridResolution(baseDensity = 24): GridResolution {
  const [grid, setGrid] = useState<GridResolution>({
    cols: baseDensity,
    rows: Math.floor(baseDensity / 2),
    isPortrait: false,
  })

  useEffect(() => {
    const calculateGrid = () => {
      // Detect orientation via matchMedia
      const isPortrait = window.matchMedia("(orientation: portrait)").matches

      const width = window.innerWidth
      const height = window.innerHeight
      const aspectRatio = width / height

      let cols: number
      let rows: number

      if (isPortrait) {
        // Portrait mode: reduce columns for narrow screens, scale rows to keep cells square-ish
        cols = Math.min(baseDensity, 16)
        rows = Math.floor(cols / aspectRatio)
      } else {
        // Landscape mode
        cols = baseDensity
        rows = Math.floor(cols / aspectRatio)
      }

      // Clamp rows to reasonable bounds
      rows = Math.max(8, Math.min(rows, 48))

      setGrid({ cols, rows, isPortrait })
    }

    // Initial calculation
    calculateGrid()

    // Listen for orientation and resize changes
    const orientationMediaQuery = window.matchMedia("(orientation: portrait)")
    orientationMediaQuery.addEventListener("change", calculateGrid)
    window.addEventListener("resize", calculateGrid)

    return () => {
      orientationMediaQuery.removeEventListener("change", calculateGrid)
      window.removeEventListener("resize", calculateGrid)
    }
  }, [baseDensity])

  return grid
}
