import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuoteDetail = ({ query, quote, setCurrentView }) => {
  const [detailedQuote, setDetailedQuote] = useState(quote);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };


  useEffect(() => {
    console.log('Quote data received:', quote);
    console.log('Query data received:', query);
  }, [quote, query]);

  const handleApproveQuote = async (queryId, quoteId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/client/${quoteId}/approve`, 
        {}, 
        { headers }
      );
      
      setDetailedQuote(prev => ({ ...prev, status: 'Approved' }));
      setCurrentView('list');
    } catch (err) {
      console.error('Approve failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to approve quote');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectQuote = async (queryId, quoteId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/client/${quoteId}/reject`, 
        {}, 
        { headers }
      );
      
      setDetailedQuote(prev => ({ ...prev, status: 'Rejected' }));
      setCurrentView('list');
    } catch (err) {
      console.error('Reject failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to reject quote');
    } finally {
      setLoading(false);
    }
  };

  if (!detailedQuote) return null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-10 text-gray-600">Loading quote details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <button
          onClick={() => setCurrentView('list')}
          className="group flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200 mb-6"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Quote Review
        </button>
        <h2 className="text-3xl font-extrabold text-black tracking-tight">Quote Details</h2>
        <p className="text-lg text-blue-600 mt-3 font-medium">{query?.title}</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{detailedQuote.providerName}</h3>
              <p className="text-sm text-gray-500 font-medium">{detailedQuote.providerCompany}</p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">{detailedQuote.providerRating}/5.0</span>
                </div>
                <span className="text-sm text-gray-600 font-medium">{detailedQuote.providerExperience} experience</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 tracking-tight">${detailedQuote.total}</div>
              <div className="text-sm text-gray-500 font-medium">Total Quote</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-5">Breakdown</h4>
          <div className="space-y-4">
          {(detailedQuote.breakdown && detailedQuote.breakdown.length > 0) ? (
            detailedQuote.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div>
                  <span className="font-semibold text-gray-900">
                    {item.country || `Item ${index + 1}`}
                  </span>
                  <div className="text-sm text-gray-500">
                    {item.hours && item.rate ? `${item.hours} hours × ${item.rate}/hr` : ''}
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  ${item.total || 0}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No breakdown items available</p>
              <p className="text-sm mt-2">This quote shows a total amount of ${detailedQuote.total}</p>
            </div>
          )}

            <div className="flex justify-between items-center py-3 font-bold text-xl text-gray-900 border-t-2 border-gray-200 mt-4">
              <span>Total</span>
              <span>${detailedQuote.total || 0}</span>
            </div>
          </div>


          <div className="mt-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Provider Notes</h4>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <p className="text-gray-600 leading-relaxed">
                {detailedQuote.providerNotes || detailedQuote.notes || detailedQuote.description || 'No additional notes provided by the provider.'}
              </p>
            </div>
          </div>


          <div className="mt-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Timeline</h4>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-600">
              <div className="flex items-center mb-2 sm:mb-0">
                <svg className="w-5 h-5 text-green-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-green-600 font-medium">
                  Submitted: {
                    detailedQuote.submittedDate || detailedQuote.createdAt 
                      ? new Date(detailedQuote.submittedDate || detailedQuote.createdAt).toLocaleDateString() 
                      : '—'
                  }
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-600 font-medium">
                  Estimated Delivery: {
                    detailedQuote.estimatedDelivery 
                      ? new Date(detailedQuote.estimatedDelivery).toLocaleDateString() 
                      : 'Not specified'
                  }
                </span>
              </div>
            </div>
          </div>


          {detailedQuote.status === 'Pending' && (
            <div className="mt-10 flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
              <button
                onClick={() => handleApproveQuote(query.id, detailedQuote.id)}
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {loading ? 'Processing...' : 'Approve Quote'}
              </button>
              <button
                onClick={() => handleRejectQuote(query.id, detailedQuote.id)}
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {loading ? 'Processing...' : 'Reject Quote'}
              </button>
            </div>
          )}

          {detailedQuote.status === 'Approved' && (
            <div className="mt-10">
              <div className="flex items-center justify-center px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quote Approved
              </div>
            </div>
          )}

          {detailedQuote.status === 'Rejected' && (
            <div className="mt-10">
              <div className="flex items-center justify-center px-6 py-3 bg-red-100 text-red-800 rounded-lg font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quote Rejected
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteDetail;