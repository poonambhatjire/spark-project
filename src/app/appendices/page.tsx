"use client"

import { useEffect, useRef, useState } from "react"
import { renderAsync } from "docx-preview"

/** Italicize C. difficile in rendered docx text */
function italicizeDifficile(root: HTMLElement) {
  const textNodes: Text[] = []
  const collect = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text)
      return
    }
    node.childNodes.forEach((child) => collect(child))
  }
  collect(root)

  for (const textNode of textNodes) {
    if (textNode.parentElement?.closest("em")) continue
    const text = textNode.textContent ?? ""
    if (!/C\.\s*difficile/i.test(text)) continue

    const bits = text.split(/(C\.\s*difficile)/gi)
    const frag = document.createDocumentFragment()
    for (const bit of bits) {
      if (!bit) continue
      if (/^C\.\s*difficile$/i.test(bit)) {
        const em = document.createElement("em")
        em.textContent = bit
        frag.appendChild(em)
      } else {
        frag.appendChild(document.createTextNode(bit))
      }
    }
    textNode.parentNode?.replaceChild(frag, textNode)
  }
}

/** Remove leading empty table rows (Word often exports blank header rows as empty cells) */
function trimDocxTopWhitespace(root: HTMLElement) {
  const tables = root.querySelectorAll("table")
  for (const table of tables) {
    let row: HTMLTableRowElement | null = table.querySelector("tr")
    while (row) {
      const cells = row.querySelectorAll("td, th")
      if (cells.length === 0) break
      const allEmpty = Array.from(cells).every((cell) => {
        const t = (cell.textContent ?? "").replace(/\u00a0/g, " ").trim()
        return t.length === 0
      })
      if (!allEmpty) break
      const next = row.nextElementSibling as HTMLTableRowElement | null
      row.remove()
      row = next
    }
  }
  const firstBlock = root.querySelector("p, table, section, article")
  if (firstBlock instanceof HTMLElement) {
    firstBlock.style.marginTop = "0"
    firstBlock.style.paddingTop = "0"
  }
}

export default function AppendicesPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadDocx() {
      if (!containerRef.current) return

      try {
        const res = await fetch("/Appendices%20List.docx", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load document")
        const blob = await res.blob()

        // Clear container before rendering; inWrapper: false avoids gray box and shadow overlay
        containerRef.current.innerHTML = ""
        await renderAsync(blob, containerRef.current, undefined, { inWrapper: false })

        italicizeDifficile(containerRef.current)
        trimDocxTopWhitespace(containerRef.current)

        setStatus("ready")
      } catch (err) {
        setStatus("error")
        setErrorMessage(err instanceof Error ? err.message : "Failed to display document")
      }
    }

    loadDocx()
  }, [])

  return (
    <div className="container mx-auto px-4 pt-2 pb-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        Antimicrobial Stewardship Program Activity Definitions
      </h1>

      {status === "loading" && (
        <p className="text-slate-600 dark:text-slate-400">Loading document…</p>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
          <a
            href="/Appendices%20List.docx"
            download
            className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Download document instead
          </a>
        </div>
      )}

      <div
        ref={containerRef}
        className={`docx-wrapper bg-white dark:bg-slate-800 rounded-lg ${status === "ready" ? "block" : "hidden"}`}
        style={{ minHeight: status === "ready" ? undefined : 0 }}
      />
    </div>
  )
}
