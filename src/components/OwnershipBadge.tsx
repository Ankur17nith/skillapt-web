/** Marks listings that were indexed from a public repository and not yet claimed by their owner. */
export function OwnershipBadge({ claimStatus }: { claimStatus?: string }) {
  if (claimStatus !== "unclaimed") return null;
  return (
    <span
      className="ownership-badge"
      title="Indexed from a public repository. The owner has not claimed this listing yet."
    >
      Unclaimed
    </span>
  );
}
