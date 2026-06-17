"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ExternalLink, FileText, Loader2, Upload } from "lucide-react";

interface ApplyFormProps {
  jobSlug: string;
  jobTitle: string;
}

function PdfUploadField({
  label,
  required,
  file,
  onChange,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="space-y-2">
      <span className="text-sm text-[var(--muted-foreground)]">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {!file ? (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] px-4 py-8 transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5">
          <Upload className="h-8 w-8 text-[var(--muted-foreground)]" />
          <span className="text-sm font-medium">Click to upload PDF</span>
          <span className="text-xs text-[var(--muted-foreground)]">Max 5 MB</span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            required={required}
            className="sr-only"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/5 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20">
            <Check className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-medium truncate">
              <FileText className="h-4 w-4 shrink-0 text-[var(--primary)]" />
              {file.name}
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">{(file.size / 1024).toFixed(0)} KB · PDF uploaded</p>
          </div>
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline shrink-0"
            >
              Preview <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] shrink-0"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export function ApplyForm({ jobSlug, jobTitle }: ApplyFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [motivation, setMotivation] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function loadCaptcha() {
    try {
      const res = await fetch("/api/captcha", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Captcha failed");
      setCaptchaQuestion(data.question);
      setCaptchaToken(data.token);
      setCaptchaAnswer("");
    } catch {
      setCaptchaQuestion("Could not load security check — refresh the page.");
    }
  }

  useEffect(() => {
    void loadCaptcha();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cv) {
      setError("Please attach your CV as PDF.");
      return;
    }
    if (!motivation) {
      setError("Please attach your motivation letter as PDF.");
      return;
    }
    if (!consent) {
      setError("Please confirm that you agree to the processing of your application data.");
      return;
    }
    if (!captchaAnswer.trim()) {
      setError("Please answer the security check.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("jobSlug", jobSlug);
      form.set("name", name);
      form.set("email", email);
      form.set("consent", "true");
      form.set("cv", cv);
      form.set("motivationLetter", motivation);
      form.set("captchaToken", captchaToken);
      form.set("captchaAnswer", captchaAnswer);

      const res = await fetch("/api/apply", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      void loadCaptcha();
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-6">
        <h3 className="font-semibold text-[var(--primary)]">Application received</h3>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Thank you for applying to {jobTitle}. Our team will review your materials shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-5">
      <h3 className="font-semibold">Apply for this position</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--muted-foreground)]">Full name <span className="text-red-400">*</span></span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="mt-1 w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--muted-foreground)]">Email <span className="text-red-400">*</span></span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className="mt-1 w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2"
          />
        </label>
      </div>

      <PdfUploadField label="CV" required file={cv} onChange={setCv} />
      <PdfUploadField label="Motivation letter" required file={motivation} onChange={setMotivation} />

      <label className="block text-sm">
        <span className="text-[var(--muted-foreground)]">Security check <span className="text-red-400">*</span></span>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-[var(--muted)] px-3 py-2 text-sm font-medium">{captchaQuestion || "Loading…"}</span>
          <input
            required
            inputMode="numeric"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            placeholder="Answer"
            className="w-24 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2"
          />
          <button type="button" onClick={() => void loadCaptcha()} className="text-xs text-[var(--primary)] hover:underline">
            New question
          </button>
        </div>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">Helps protect against automated submissions.</p>
      </label>

      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--input)]"
        />
        <span className="text-[var(--muted-foreground)]">
          I agree that my personal data (including CV and contact details) may be stored and processed for recruitment
          purposes related to this position, as described in the{" "}
          <Link href="/privacy" className="text-[var(--primary)] hover:underline">
            Privacy Policy
          </Link>
          . I understand I may withdraw my application or request deletion of my data by contacting the lab.
        </span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-[var(--primary-foreground)] disabled:opacity-50"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit application
      </button>
    </form>
  );
}
