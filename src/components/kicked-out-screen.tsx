export function KickedOutScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full mb-8">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="font-semibold">Kicked Out</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">You have been removed from this session</h1>
        <p className="text-gray-600">
          The teacher has removed you from the current polling session. Please contact your teacher for
          more information.
        </p>
      </div>
    </div>
  )
}

