"use client"

import { useState } from "react"
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid"
import { SettingsSidebar, type GridSettings } from "@/components/settings-sidebar"
import { SourcePicker, type CaptureSource } from "@/components/source-picker"
import { InlineEditable } from "@/components/inline-editable"
import { useGridResolution } from "@/hooks/use-grid-resolution"

const DEFAULT_SETTINGS: GridSettings = {
  maxElevation: 80,
  motionSensitivity: 0.8,
  elevationSmoothing: 0.28,
  gapRatio: 0.05,
  borderColor: "#01fefe",
  borderOpacity: 0.2,
  bloomIntensity: 0.6,
  bloomRadius: 6,
}

export default function WebcamPixelGridDemo() {
  const [settings, setSettings] = useState<GridSettings>(DEFAULT_SETTINGS)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined)
  const [captureSource, setCaptureSource] = useState<CaptureSource>("webcam")
  const [title, setTitle] = useState("Webcam Pixel Grid")
  const [subtitle, setSubtitle] = useState("3D pixel grid effect for webcam with glowing bloom FX.")

  // Dynamic grid resolution based on orientation
  const { cols, rows } = useGridResolution(24)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Webcam pixel grid background */}
      <div className="absolute inset-0">
        <WebcamPixelGrid
          gridCols={cols}
          gridRows={rows}
          maxElevation={settings.maxElevation}
          motionSensitivity={settings.motionSensitivity}
          elevationSmoothing={settings.elevationSmoothing}
          colorMode="webcam"
          backgroundColor="#030303"
          mirror={captureSource === "webcam"}
          gapRatio={settings.gapRatio}
          invertColors={false}
          darken={0.5}
          borderColor={settings.borderColor}
          borderOpacity={settings.borderOpacity}
          bloomIntensity={settings.bloomIntensity}
          bloomRadius={settings.bloomRadius}
          deviceId={selectedDeviceId}
          captureMode={captureSource}
          className="h-full w-full"
          onWebcamReady={() => console.log("[v0] Capture ready!")}
          onWebcamError={(err) => console.error("[v0] Capture error:", err)}
        />
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="max-w-4xl text-center group/container">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            <a href="https://github.com/VisualBoy/webcam-pixel-grid" target="_blank" > {"VisualBoy/webcam-pixel-grid \u2192"} </a>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-xl font-bold tracking-tight text-white sm:text-6xl md:text-8xl [text-shadow:4px_4px_8px_rgba(0,0,0,0.5)]">
            <InlineEditable
              as="span"
              value={title}
              onChange={setTitle}
              placeholder="Enter title"
              className="block text-xl font-bold tracking-tight text-white sm:text-6xl md:text-8xl [text-shadow:4px_4px_8px_rgba(0,0,0,0.5)]"
            />
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-base text-white/60 sm:text-xl [text-shadow:4px_4px_8px_rgba(0,0,0,0.5)]">
            <InlineEditable
              as="span"
              value={subtitle}
              onChange={setSubtitle}
              placeholder="Enter subtitle"
              className="text-base text-white/60 sm:text-xl [text-shadow:4px_4px_8px_rgba(0,0,0,0.5)]"
            />
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

            <a href="https://github.com/VisualBoy/webcam-pixel-grid" target="_blank" rel="noreferrer" className="group relative inline-flex h-9 px-4 text-sm sm:h-12 sm:px-8 sm:text-base items-center justify-center gap-2 rounded-full bg-white font-medium text-black transition-all hover:scale-105 hover:bg-white/70 md:opacity-0 md:group-hover/container:opacity-100">GitHub
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <button className="inline-flex h-9 px-4 text-sm sm:h-12 sm:px-8 sm:text-base items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 font-medium text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 md:opacity-0 md:group-hover/container:opacity-100">
              <a href="https://ui.aceternity.com/components/webcam-pixel-grid" target="_blank" rel="noreferrer">View Doc</a>
            </button>


          </div>
        </div>
      </div>

      {/* Settings sidebar */}
      <SettingsSidebar settings={settings} onChange={setSettings} defaults={DEFAULT_SETTINGS} />

      {/* Source picker (webcam or screen) */}
      <SourcePicker 
        captureSource={captureSource}
        onCaptureSourceChange={setCaptureSource}
        selectedDeviceId={selectedDeviceId} 
        onDeviceChange={setSelectedDeviceId}
      />
    </div>
  )
}
