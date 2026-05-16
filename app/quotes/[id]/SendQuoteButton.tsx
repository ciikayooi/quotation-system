"use client";

import { useState } from "react";
import { sendQuoteEmail } from "./actions";

type Props = {
  quoteId: string;
  customerEmail: string;
  currentStatus: string;
};

export default function SendQuoteButton({ quoteId, customerEmail, currentStatus }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    currentStatus === "Sent" || currentStatus === "Accepted" ? "sent" : "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSend() {
    setState("sending");
    setErrorMsg(null);
    const result = await sendQuoteEmail(quoteId);
    if (result.error) {
      setErrorMsg(result.error);
      setState("error");
    } else {
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-900/30 border border-emerald-700 text-emerald-400 text-sm font-medium">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Sent to {customerEmail}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSend}
        disabled={state === "sending"}
        className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 text-sm font-semibold rounded-lg transition-colors"
      >
        {state === "sending" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
            </svg>
            Send Quote
          </>
        )}
      </button>
      {state === "error" && errorMsg && (
        <p className="text-xs text-red-400 max-w-xs text-right">{errorMsg}</p>
      )}
    </div>
  );
}
