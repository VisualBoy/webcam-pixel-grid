"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Settings2, X, RotateCcw } from "lucide-react"

export type GridSettings = {
  maxElevation: number
  motionSensitivity: number
  elevationSmoothing: number
  gapRatio: number
  borderColor: string
  borderOpacity: number
  bloomIntensity: number
  bloomRadius: number
}

type SettingsSidebarProps = {
  settings: GridSettings
  onChange: (settings: GridSettings) => void
  defaults: GridSettings
}

type SliderRowProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  format?: (value: number) => string
}

function SliderRow({ label, value, min, max, step, onChange, format }: SliderRowProps) {
  const display = format ? format(value) : value.toFixed(step < 1 ? 2 : 0)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-white/70">{label}</Label>
        <span className="font-mono text-xs tabular-nums text-white/50">{display}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-white/30 [&_[role=slider]]:bg-white"
      />
    </div>
  )
}

export function SettingsSidebar({ settings, onChange, defaults }: SettingsSidebarProps) {
  const [open, setOpen] = useState(false)

  const update = <K extends keyof GridSettings>(key: K, value: GridSettings[K]) => {
    onChange({ ...settings, [key]: value })
  }

  const handleReset = () => {
    onChange(defaults)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close settings" : "Open settings"}
        aria-expanded={open}
        className={cn(
          "fixed top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full",
          "border border-white/15 bg-black/50 text-white/80 shadow-lg backdrop-blur-xl",
          "transition-all hover:scale-105 hover:border-white/25 hover:bg-black/70 hover:text-white",
          open && "translate-x-[-20rem]",
        )}
      >
        {open ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
      </button>

      {/* Backdrop-less side panel */}
      <aside
        aria-hidden={!open}
        className={cn(
          "fixed top-0 right-0 z-30 flex h-full w-80 flex-col",
          "border-l border-white/10 bg-black/70 backdrop-blur-2xl",
          "shadow-[0_0_40px_rgba(0,0,0,0.5)]",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold text-white">Grid Controls</h2>
            <p className="text-xs text-white/50">Tweak parameters in realtime</p>
          </div>
          <button
            onClick={handleReset}
            aria-label="Reset to defaults"
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Motion</h3>
            </div>

            <SliderRow
              label="Max Elevation"
              value={settings.maxElevation}
              min={0}
              max={200}
              step={1}
              onChange={(v) => update("maxElevation", v)}
              format={(v) => v.toFixed(0)}
            />

            <SliderRow
              label="Motion Sensitivity"
              value={settings.motionSensitivity}
              min={0.05}
              max={2}
              step={0.01}
              onChange={(v) => update("motionSensitivity", v)}
            />

            <SliderRow
              label="Elevation Smoothing"
              value={settings.elevationSmoothing}
              min={0.01}
              max={1}
              step={0.01}
              onChange={(v) => update("elevationSmoothing", v)}
            />

            <Separator className="bg-white/10" />

            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Grid</h3>
            </div>

            <SliderRow
              label="Gap Ratio"
              value={settings.gapRatio}
              min={0}
              max={0.5}
              step={0.01}
              onChange={(v) => update("gapRatio", v)}
            />

            <Separator className="bg-white/10" />

            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Border</h3>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-white/70">Border Color</Label>
                <span className="font-mono text-xs uppercase tabular-nums text-white/50">{settings.borderColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative h-9 w-9 overflow-hidden rounded-md border border-white/15">
                  <input
                    type="color"
                    value={settings.borderColor}
                    onChange={(e) => update("borderColor", e.target.value)}
                    aria-label="Border color"
                    className="absolute inset-0 h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none bg-transparent p-0"
                  />
                </div>
                <input
                  type="text"
                  value={settings.borderColor}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                      update("borderColor", val)
                    }
                  }}
                  className="h-9 flex-1 rounded-md border border-white/10 bg-white/5 px-3 font-mono text-xs text-white/80 outline-none transition-colors focus:border-white/25"
                  aria-label="Border color hex"
                />
              </div>
            </div>

            <SliderRow
              label="Border Opacity"
              value={settings.borderOpacity}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => update("borderOpacity", v)}
            />

            <Separator className="bg-white/10" />

            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Bloom</h3>
            </div>

            <SliderRow
              label="Bloom Intensity"
              value={settings.bloomIntensity}
              min={0}
              max={2}
              step={0.01}
              onChange={(v) => update("bloomIntensity", v)}
            />

            <SliderRow
              label="Bloom Radius"
              value={settings.bloomRadius}
              min={0}
              max={30}
              step={0.5}
              onChange={(v) => update("bloomRadius", v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-3">
          <p className="text-[10px] text-white/40">Changes apply live to the grid</p>
        </div>
      </aside>
    </>
  )
}
