import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './Components/Layout/UserLayout'
import { BackgroundLinesDemo } from './Pages/Home'
import { SignIn } from './Pages/Login'
import { SignUp } from './Pages/SignUp'
import Dashboard from './Pages/Dashboard'
import ServiceProviderDashboard from './Pages/ServiceProviderDashboard'
import QuoteReview from './Pages/QuoteReview'
import NewQuery from './Pages/NewQuery'
import { AuthProvider } from './context/AuthContext'
const QueryDetail = React.lazy(() => import('./Pages/QueryPage'));
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<BackgroundLinesDemo />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/service-provider" element={<ServiceProviderDashboard />} />
            <Route path="/quote-review" element={<QuoteReview />} />
            <Route path="/query/:id" element={<QueryDetail />} />
            <Route path="/new-query" element={<NewQuery />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
