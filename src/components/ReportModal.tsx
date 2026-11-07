import { Icon } from "./Icon";
import { Button } from "./Button";

export function ReportModal({ close }: { close: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <div className="modal-head">
          <h2 id="report-title">Report skill</h2>
          <button onClick={close}>
            <Icon name="x" />
          </button>
        </div>
        <label>
          Reason
          <select>
            <option>Security concern</option>
            <option>Misleading information</option>
            <option>Broken package</option>
          </select>
        </label>
        <label>
          Details
          <textarea rows={5} placeholder="Tell us what happened" />
        </label>
        <div className="modal-actions">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <button className="button" disabled title="Reporting requires the registry service">
            Submission unavailable
          </button>
        </div>
      </div>
    </div>
  );
}
