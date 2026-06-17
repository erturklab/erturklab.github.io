"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0a0a0a", color: "#f5f5f5" }}>
        <main style={{ maxWidth: "32rem", margin: "4rem auto", padding: "0 1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ marginTop: "1rem", lineHeight: 1.6, color: "#a3a3a3" }}>
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#737373" }}>Reference: {error.digest}</p>
          )}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "1.5rem",
              border: "none",
              borderRadius: "9999px",
              padding: "0.625rem 1.25rem",
              background: "#c9a962",
              color: "#0a0a0a",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
