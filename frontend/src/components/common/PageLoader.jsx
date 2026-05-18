const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white px-8 py-7 shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-900">Loading page</p>
        <p className="mt-1 text-xs font-medium text-gray-500">
          Preparing your workspace...
        </p>
      </div>
    </div>
  </div>
);

export default PageLoader;
