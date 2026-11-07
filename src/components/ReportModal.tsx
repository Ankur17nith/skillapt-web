import { useState } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { api, ApiError } from "../lib/api";

export function ReportModal({
  skillName = "package",
  version = "1.0.0",
  close,
  onSuccess,
  onSubmit,
}: {
  skillName?: string;
  version?: string;
  close: () => void;
  onSuccess?: (message: string) => void;
  onSubmit?: (reason: string, details: string) => void;
}) {
  const [reason, setReason] = useState<string>("malware");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!details.trim()) {
      setError("Please provide details about the problem.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (onSubmit) {
        onSubmit(reason, details);
      } else {
        const res = await api.submitReport({
          skillName,
          version,
          reason,
          details,
        });
        if (onSuccess) {
          onSuccess(res.message);
        }
      }
      close();
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Rate limit exceeded (max 5 reports/hour). Please try again later.");
      } else {
        setError(err?.message || "Failed to submit report. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="report-title">Report {skillName}</h2>
          <button onClick={close} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </div>

        {error && (
          <div className="field-error" style={{ marginBottom: "12px", padding: "8px 12px", background: "var(--surface-muted)", border: "1px solid var(--border)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Reason
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="malware">Malicious code or security vulnerability</option>
              <option value="copyright">Copyright or license infringement</option>
              <option value="spam">Spam, typo-squatting, or misleading metadata</option>
              <option value="inappropriate">Harmful or inappropriate content</option>
              <option value="other">Other issue</option>
            </select>
          </label>
          <label>
            Details
            <textarea
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the issue, suspicious behavior, or reproduction steps..."
              required
            />
          </label>
          <div className="modal-actions">
            <Button variant="secondary" type="button" onClick={close}>
              Cancel
            </Button>
            <button
              className="button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
