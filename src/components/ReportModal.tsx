import { useState } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";

export function ReportModal({
  close,
  onSubmit,
}: {
  close: () => void;
  onSubmit: (reason: string, details: string) => void;
}) {
  const [reason, setReason] = useState("Security concern");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(reason, details);
      close();
    }, 300);
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
          <h2 id="report-title">Report skill</h2>
          <button onClick={close} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </div>
        <label>
          Reason
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option>Security concern</option>
            <option>Misleading information</option>
            <option>Broken package</option>
          </select>
        </label>
        <label>
          Details
          <textarea
            rows={5}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Tell us what happened"
          />
        </label>
        <div className="modal-actions">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <button
            className="button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit report"}
          </button>
        </div>
      </div>
    </div>
  );
}
