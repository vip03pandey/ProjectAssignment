import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './Components/Layout/UserLayout'
import { BackgroundLinesDemo } from './Pages/Home'
import { SignIn } from './Pages/Login'
import { SignUp } from './Pages/SignUp'
import Dashboard from './Pages/Dashboard'
import ServiceProviderDashboard from './Pages/ServiceProviderDashboard'
import ProviderQueryDetail from './Pages/ProviderQueryDetail'
import SubmitQuote from './Pages/SubmitQuote'
import UploadDeliverables from './Pages/UploadDeliverables'
import QuoteReview from './Pages/QuoteReview'
import NewQuery from './Pages/NewQuery'
import { AuthProvider } from './context/AuthContext'
import QueryDetail from './Pages/QueryDetail';
import ClientDeliverables from './Pages/ShowDeliverables'
import ProtectedRoute from './lib/ProtectedRoutes'
import ApprovedQuote from './Pages/AssignedPage'
import { Toaster } from 'sonner';
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
       <Toaster position="top-right" reverseOrder={false}/>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<BackgroundLinesDemo />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
              <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
            path="/service-provider" 
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <ServiceProviderDashboard />
              </ProtectedRoute>
            } 
          />
            <Route path="/provider-query/:queryId" element={<ProviderQueryDetail />} />
            <Route path="/submit-quote/:queryId" element={<SubmitQuote />} />
            <Route path="/upload-deliverables/:queryId" element={<UploadDeliverables />} />
            <Route path="/quote-review" element={<QuoteReview />} />
            <Route path="/query/:queryId" element={<QueryDetail />} />
            <Route path="/new-query" element={<NewQuery />} />
            <Route path="/deliverables/:queryId" element={<ClientDeliverables />} />
            <Route path='/assigned-to/:queryId' element={<ApprovedQuote/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
