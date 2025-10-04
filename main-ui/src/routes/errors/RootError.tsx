import { isRouteErrorResponse, useRouteError } from 'react-router'

export default function RootError() {
  const err = useRouteError()
  if (isRouteErrorResponse(err)) {
    return <div className="p-6">Error {err.status}: {err.statusText}</div>
  }
  return <div className="p-6">Something went wrong.</div>
}