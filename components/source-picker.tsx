"use client";

import { useState, useEffect, useRef } from "react";

export type CaptureSource = "webcam" | "screen";

export type VideoDevice = {
  deviceId: string;
  label: string;
};

type SourcePickerProps = {
  captureSource: CaptureSource;
  onCaptureSourceChange: (source: CaptureSource) => void;
  selectedDeviceId: string | undefined;
  onDeviceChange: (deviceId: string) => void;
};

export function SourcePicker({
  captureSource,
  onCaptureSourceChange,
  selectedDeviceId,
  onDeviceChange,
}: SourcePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [devices, setDevices] = useState<VideoDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Enumerate devices when popover opens and webcam is selected
  useEffect(() => {
    async function enumerateDevices() {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        // Request permission first to get labeled devices
        await navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
          })
          .catch(() => {
            // Permission may already be granted
          });

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices
          .filter((device) => device.kind === "videoinput")
          .map((device, index) => ({
            deviceId: device.deviceId,
            label:
              device.label ||
              (index === 0
                ? "Front Camera"
                : index === 1
                  ? "Back Camera"
                  : `Camera ${index + 1}`),
          }));

        setDevices(videoDevices);
      } catch (error) {
        console.error("[v0] Failed to enumerate devices:", error);
      } finally {
        setIsLoading(false);
      }
    }

    enumerateDevices();
  }, [isOpen]);

  // Listen for device changes
  useEffect(() => {
    function handleDeviceChange() {
      if (isOpen) {
        navigator.mediaDevices.enumerateDevices().then((allDevices) => {
          const videoDevices = allDevices
            .filter((device) => device.kind === "videoinput")
            .map((device, index) => ({
              deviceId: device.deviceId,
              label:
                device.label ||
                (index === 0
                  ? "Front Camera"
                  : index === 1
                    ? "Back Camera"
                    : `Camera ${index + 1}`),
            }));
          setDevices(videoDevices);
        });
      }
    }

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () =>
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
  }, [isOpen]);

  const handleSelectDevice = (deviceId: string) => {
    if (captureSource !== "webcam") {
      onCaptureSourceChange("webcam");
    }
    onDeviceChange(deviceId);
    setIsOpen(false);
  };

  const handleSelectScreen = () => {
    onCaptureSourceChange("screen");
    setIsOpen(false);
  };

  return (
    <div ref={popoverRef} className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-black/80 hover:text-white"
        title="Switch Source"
      >
        {captureSource === "screen" ? (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-72 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="rounded-lg border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-xl">
            {/* Source Type Selection */}
            <div className="mb-2 px-2 py-1 text-xs font-medium text-white/50">
              Capture Source
            </div>
            
            {/* Screen Capture Option */}
            <button
              onClick={handleSelectScreen}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                captureSource === "screen"
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <span className="flex-1">
                <span className="block font-medium">Screen / Window</span>
                <span className="block text-xs text-white/50">Share a window or entire screen</span>
              </span>
              {captureSource === "screen" && (
                <svg
                  className="h-4 w-4 flex-shrink-0 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-white/10" />

            {/* Webcam Section Header */}
            <div className="mb-1 px-2 py-1 text-xs font-medium text-white/50">
              Webcam
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <svg
                  className="h-5 w-5 animate-spin text-white/50"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : devices.length === 0 ? (
              <div className="px-2 py-3 text-center text-sm text-white/40">
                No cameras found
              </div>
            ) : (
              <div className="space-y-1">
                {devices.map((device) => {
                  const isSelected = captureSource === "webcam" && device.deviceId === selectedDeviceId;
                  const isFrontCamera =
                    device.label.toLowerCase().includes("front") ||
                    device.label.toLowerCase().includes("facetime") ||
                    device.label.toLowerCase().includes("user");
                  const isBackCamera =
                    device.label.toLowerCase().includes("back") ||
                    device.label.toLowerCase().includes("rear") ||
                    device.label.toLowerCase().includes("environment");

                  return (
                    <button
                      key={device.deviceId}
                      onClick={() => handleSelectDevice(device.deviceId)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-white/15 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {/* Camera icon */}
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                        {isFrontCamera ? (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        ) : isBackCamera ? (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </span>

                      {/* Label */}
                      <span className="flex-1 truncate">{device.label}</span>

                      {/* Selected indicator */}
                      {isSelected && (
                        <svg
                          className="h-4 w-4 flex-shrink-0 text-cyan-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
