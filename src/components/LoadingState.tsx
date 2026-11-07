export function LoadingState() {
  return (
    <div className="loading-state" aria-label="Loading skills">
      {[1, 2, 3].map((n) => (
        <div key={n}>
          <i />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
