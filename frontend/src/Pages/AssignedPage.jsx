import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Calendar, User, DollarSign, FileText, CheckCircle, Clock, Star, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ApprovedQuote = () => {
  const { queryId } = useParams();
  const { user } = useAuth(); 
  console.log("Query ID from URL:", queryId);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedQuote = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("You are not authorized to view this quote. Please log in.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/client/approved-quote/${queryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setQuote(data);
        console.log("Fetched approved quote:", data);
      } catch (err) {
        console.error("Error fetching approved quote:", err);
        if (err.response?.status === 401) {
          setError("You are not authorized to view this quote. Please log in.");
        } else if (err.response?.status === 404) {
          setError("Approved quote not found.");
        } else {
          setError("Failed to load approved quote");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedQuote();
  }, [queryId, user]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200/25 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/30">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Loading Quote Details</h3>
            <p className="text-lg text-emerald-600 font-medium">Please wait while we fetch your approved quote...</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/30 text-center max-w-md">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-rose-800 mb-4">Oops! Something went wrong</h3>
        <p className="text-lg text-rose-600 font-medium">{error}</p>
      </div>
    </div>
  );

  if (!quote) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/30 text-center max-w-md">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">No Quote Found</h3>
        <p className="text-lg text-slate-600 font-medium">We couldn't find an approved quote for this request.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-200/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Back Button */}
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="group inline-flex items-center bg-white/80 backdrop-blur-sm hover:bg-white/90 text-blue-700 hover:text-violet-900 transition-all duration-300 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl border border-white/30 font-semibold"
            >
              <ArrowLeft className="mr-3 w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Dashboard
            </Link>
          </div>

          {/* Main Quote Card */}
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/30 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gray-900 px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-white mb-1 tracking-tight">
                    Approved Quote Details
                  </h1>
                  <p className="text-violet-100 text-base font-medium">
                    Your project has been approved and is ready to begin
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Status Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-base">
                  Quote Approved & Project Assigned
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="group bg-white p-4 rounded-xl border border-violet-200/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-800 rounded-lg shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Provider</p>
                      <p className="text-lg font-black text-gray-800">{quote.provider?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white p-4 rounded-xl border border-cyan-200/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-800 rounded-lg shadow-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Submitted</p>
                      <p className="text-lg font-black text-gray-800">
                        {new Date(quote.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white p-4 rounded-xl border border-emerald-200/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-800 rounded-lg shadow-lg">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Investment</p>
                      <p className="text-2xl font-black text-gray-800">₹{quote.total?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white p-4 rounded-xl border border-amber-200/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-800 rounded-lg shadow-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {quote.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown Section */}
              {quote.breakdown && quote.breakdown.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-800 rounded-lg shadow-lg mr-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800">Investment Breakdown</h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200/50">
                    <div className="space-y-3">
                      {quote.breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"></div>
                            <span className="text-base font-bold text-gray-800">{item.country}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600 font-medium">
                              {item.hours} hours @ ₹{item.rate}/hr
                            </p>
                            <p className="text-lg font-black text-emerald-600">₹{item.total?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Query Details Section */}
              {quote.query && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg mr-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800">Project Overview</h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200/50 shadow-inner">
                    <h3 className="text-xl font-black text-gray-800 mb-3">{quote.query.title}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quote.query.regulatoryArea && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Regulatory Area:</span>
                          <span className="text-sm font-bold text-gray-800">{quote.query.regulatoryArea}</span>
                        </div>
                      )}
                      
                      {quote.query.deadline && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Deadline:</span>
                          <span className="text-sm font-bold text-gray-800">
                            {new Date(quote.query.deadline).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedQuote;