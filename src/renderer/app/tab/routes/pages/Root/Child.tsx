import { Outlet } from 'react-router-dom'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  //TODO: Implement login session checks and close tab if not logged in
  return <Outlet />
}
