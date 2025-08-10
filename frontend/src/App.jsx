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
            <Route path="/provider-query/:queryId" element={<ProviderQueryDetail />} />
            <Route path="/submit-quote/:queryId" element={<SubmitQuote />} />
            <Route path="/upload-deliverables/:queryId" element={<UploadDeliverables />} />
            <Route path="/quote-review" element={<QuoteReview />} />
            <Route path="/query/:queryId" element={<QueryDetail />} />
            <Route path="/new-query" element={<NewQuery />} />
            <Route path="/deliverables/:queryId" element={<ClientDeliverables />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
