"use client"

import { useState, useRef, useEffect } from "react"

const MESSENGER_ID = "61590641043505"

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [sent, setSent] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [open])

  function handleSend() {
    if (!text.trim()) return
    const encoded = encodeURIComponent(`[Feedback ToPeak] ${text.trim()}`)
    window.open(`https://m.me/${MESSENGER_ID}?text=${encoded}`, "_blank", "noopener")
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setText("")
      setOpen(false)
    }, 2000)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend()
    if (e.key === "Escape") setOpen(false)
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">
        {/* Popup panel */}
        {open && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 overflow-hidden">
            {/* Header */}
            <div className="bg-[#0a66c2] px-4 py-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.42 5.507 3.647 7.22V22l3.338-1.84c.893.248 1.838.382 2.815.382 5.523 0 10-4.144 10-9.299C22 6.145 17.523 2 12 2zm1.007 12.52l-2.55-2.717-4.974 2.717 5.474-5.808 2.611 2.717 4.913-2.717-5.474 5.808z"/>
              </svg>
              <span className="text-white font-semibold text-sm">Gửi feedback qua Messenger</span>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-white/70 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              {sent ? (
                <div className="flex flex-col items-center py-4 gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Mở Messenger rồi!</p>
                  <p className="text-xs text-gray-500">Bấm Gửi trong Messenger để hoàn tất</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    Nhập nội dung, bấm Gửi — Messenger mở ra với tin nhắn đã điền sẵn, bạn chỉ cần bấm Send.
                  </p>
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Góp ý, báo lỗi, hay bất kỳ điều gì..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                    rows={4}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">⌘ Enter để gửi</span>
                    <button
                      onClick={handleSend}
                      disabled={!text.trim()}
                      className="flex items-center gap-1.5 bg-[#0a66c2] disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0958a8] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.42 5.507 3.647 7.22V22l3.338-1.84c.893.248 1.838.382 2.815.382 5.523 0 10-4.144 10-9.299C22 6.145 17.523 2 12 2zm1.007 12.52l-2.55-2.717-4.974 2.717 5.474-5.808 2.611 2.717 4.913-2.717-5.474 5.808z"/>
                      </svg>
                      Gửi qua Messenger
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Floating button */}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-13 h-13 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ width: 52, height: 52, background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)" }}
          aria-label="Gửi feedback"
          title="Gửi feedback qua Messenger"
        >
          {open ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.42 5.507 3.647 7.22V22l3.338-1.84c.893.248 1.838.382 2.815.382 5.523 0 10-4.144 10-9.299C22 6.145 17.523 2 12 2zm1.007 12.52l-2.55-2.717-4.974 2.717 5.474-5.808 2.611 2.717 4.913-2.717-5.474 5.808z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
