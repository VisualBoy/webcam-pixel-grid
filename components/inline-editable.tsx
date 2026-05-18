"use client"

import { useEffect, useRef, useState } from "react"

interface InlineEditableProps {
  value: string
  onChange: (value: string) => void
  as?: "h1" | "p" | "span"
  className?: string
  placeholder?: string
}

export function InlineEditable({
  value,
  onChange,
  as: Tag = "span",
  className = "",
  placeholder = "Click to edit",
}: InlineEditableProps) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLElement>(null)
  // Track last committed value to detect real changes
  const committedRef = useRef(value)

  // When entering edit mode, move caret to end and focus
  useEffect(() => {
    if (!editing || !ref.current) return
    const el = ref.current
    el.focus()
    // Place caret at end
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(el)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [editing])

  // Keep inner text in sync when value changes externally (not while editing)
  useEffect(() => {
    if (!editing && ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value
    }
  }, [value, editing])

  function handleActivate() {
    committedRef.current = value
    setEditing(true)
  }

  function commit() {
    if (!ref.current) return
    const newValue = ref.current.innerText.trim()
    const final = newValue || committedRef.current
    // Restore if empty
    if (!newValue) ref.current.innerText = committedRef.current
    onChange(final)
    committedRef.current = final
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      commit()
    }
    if (e.key === "Escape") {
      // Revert
      if (ref.current) ref.current.innerText = committedRef.current
      setEditing(false)
    }
  }

  return (
    <Tag
      // @ts-expect-error – generic ref across tag union
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      onClick={handleActivate}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={[
        className,
        // Cursor: text when editing, pointer otherwise
        editing ? "cursor-text outline-none" : "cursor-pointer select-none",
        // Subtle hover hint when not editing
        !editing && "transition-opacity hover:opacity-80",
        // Blinking caret colour
        "caret-white",
        // Editing ring
        editing && "ring-1 ring-white/20 ring-offset-2 ring-offset-transparent rounded",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        editing
          ? { WebkitUserModify: "read-write-plaintext-only" as React.CSSProperties["WebkitUserModify"] }
          : undefined
      }
    />
  )
}
