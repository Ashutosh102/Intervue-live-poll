export function Spinner() {
  return (
    <div
      className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-t-transparent"
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

