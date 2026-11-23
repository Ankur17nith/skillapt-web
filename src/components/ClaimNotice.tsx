import { useState } from "react";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { Button } from "./Button";

/**
 * Shown on unclaimed listings: explains where the entry came from and lets the
 * matching signed-in GitHub user take ownership.
 */
export function ClaimNotice({
  name,
  owner,
  sourceUrl,
  onClaimed,
}: {
  name: string;
  owner: string;
  sourceUrl?: string | null;
  onClaimed: () => void;
}) {
  const { user, login } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOwner = Boolean(user && user.handle.toLowerCase() === owner.toLowerCase());

  const claim = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.claimSkill(name);
      onClaimed();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not claim this skill.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="claim-notice" aria-label="Unclaimed listing">
      <div>
        <strong>Unclaimed listing</strong>
        <p>
          Indexed automatically from a public repository
          {sourceUrl && sourceUrl.startsWith("https://") ? (
            <>
              {" "}
              (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                {sourceUrl.replace("https://", "")}
              </a>
              )
            </>
          ) : null}
          . Review the source before installing. Only <b>@{owner}</b> can claim it.
        </p>
        {error && <p className="claim-error" role="alert">{error}</p>}
      </div>
      {isOwner ? (
        <Button onClick={claim} disabled={busy}>
          {busy ? "Claiming…" : "Claim this skill"}
        </Button>
      ) : user ? null : (
        <Button variant="secondary" onClick={login}>
          Sign in to claim
        </Button>
      )}
    </aside>
  );
}
