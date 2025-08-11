import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Calendar, User, DollarSign, FileText } from "lucide-react";
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex items-center space-x-2 text-indigo-600 animate-pulse">
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-lg font-medium">Loading approved quote...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <p className="text-lg font-medium text-red-600 bg-red-100 px-6 py-3 rounded-xl shadow-lg">{error}</p>
    </div>
  );

  if (!quote) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <p className="text-lg font-medium text-gray-700 bg-gray-100 px-6 py-3 rounded-xl shadow-lg">No approved quote found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="group flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-semibold text-lg">Back to Dashboard</span>
        </Link>

        {/* Quote details */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-indigo-100 transform hover:scale-[1.02] transition-all duration-300">
          <h1 className="text-4xl font-bold text-indigo-900 mb-6 tracking-tight">Approved Quote Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200">
              <User className="mr-3 text-indigo-500 w-6 h-6" />
              <div>
                <span className="font-medium text-black">Provider:</span>
                <span className="ml-2 text-gray-900 font-bold">{quote.provider?.name}</span>
              </div>
            </div>

            <div className="flex items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200">
              <Calendar className="mr-3 text-indigo-500 w-6 h-6" />
              <div>
                <span className="font-medium text-black">Submitted At:</span>
                <span className="ml-2 text-gray-900 font-bold">
                  {new Date(quote.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200">
              <DollarSign className="mr-3 text-green-500 w-6 h-6" />
              <div>
                <span className="font-medium text-black">Total Price:</span>
                <span className="ml-2 text-gray-900 font-bold text-lg">₹{quote.total}</span>
              </div>
            </div>

            <div className="flex items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200">
              <FileText className="mr-3 text-purple-500 w-6 h-6" />
              <div>
                <span className="font-medium text-black">Status:</span>
                <span className="ml-2 text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                  {quote.status}
                </span>
              </div>
            </div>
          </div>

          {quote.breakdown && quote.breakdown.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-4 tracking-tight">Cost Breakdown</h2>
              <div className="space-y-3">
                {quote.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <span className="text-gray-700 font-bold">{item.country}</span>
                    <span className="text-gray-900 font-semibold">
                      {item.hours} hours @ ₹{item.rate}/hr = <span className="text-green-600">₹{item.total}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quote.query && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">Query Details</h2>
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800">{quote.query.title}</h3>
                {quote.query.regulatoryArea && (
                  <p className="text-sm text-gray-600 mt-3">
                    <span className="font-medium">Area:</span> {quote.query.regulatoryArea}
                  </p>
                )}
                {quote.query.deadline && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Deadline:</span>{" "}
                    {new Date(quote.query.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovedQuote;