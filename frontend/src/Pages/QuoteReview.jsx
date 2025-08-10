import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Eye, CheckCircle, XCircle, DollarSign, User, Calendar, Clock, Star, ArrowLeft } from 'lucide-react';
import QuoteDetail from './QuoteDetailsClient';
const QuoteReview = () => {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('queryId');


  const [queryWithQuotes, setQueryWithQuotes] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!queryId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = getAuthHeaders();

        const [queryRes, quotesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/client/query/${queryId}`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/client/${queryId}/quotes`, { headers })
        ]);

        const q = queryRes.data || {};
        const quotes = Array.isArray(quotesRes.data) ? quotesRes.data : [];

        
        const normalized = {
          id: q._id || q.id || queryId,
          title: q.title || q.name || '',
          description: q.description || '',
          status: q.status || '',
          submittedDate: q.submittedDate || q.createdAt || '',
          priority: q.priority || '',
          clientName: q.clientName || q.client || '',
          detailedQuestions: q.detailedQuestions || q.details || '',
          attachments: q.attachments || [],
          quotes: quotes.map((r) => ({
            id: r._id || r.id,
            providerName: r.provider?.name || r.providerName || r.provider?.company || 'Unknown Provider',
            providerCompany: r.provider?.company || r.providerCompany || '',
            providerRating: r.provider?.rating || r.providerRating || r.rating || 0,
            providerExperience: r.provider?.experience || r.providerExperience || '',
            submittedDate: r.submittedDate || r.createdAt || '',
            breakdown: r.breakdown  || [],
            total: r.total || r.amount || (r.items ? r.items.reduce((s, it) => s + (it.total || 0), 0) : 0),
            status: r.status || 'Pending',
            estimatedDelivery: r.estimatedDelivery || r.estimated || '',
            providerNotes: r.providerNotes || r.notes || r.description || ''
          }))
        };

        setQueryWithQuotes(normalized);
      } catch (err) {
        console.error('Failed to fetch query/quotes', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryId]);


  const handleApproveQuote = async (queryIdArg, quoteId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      await axios.put(`/api/client/${quoteId}/approve`, {}, { headers });
      setQueryWithQuotes((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          quotes: prev.quotes.map((q) => (q.id === quoteId ? { ...q, status: 'Approved' } : q))
        };
        return updated;
      });

      setSelectedQuote((prev) => (prev && prev.quote && prev.quote.id === quoteId ? { ...prev, quote: { ...prev.quote, status: 'Approved' } } : prev));
      setCurrentView('list');
    } catch (err) {
      console.error('Approve failed', err);
      setError(err.response?.data?.message || err.message || 'Failed to approve quote');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectQuote = async (queryIdArg, quoteId) => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();


      await axios.put(`/api/client/${quoteId}/reject`, {}, { headers });
      setQueryWithQuotes((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          quotes: prev.quotes.map((q) => (q.id === quoteId ? { ...q, status: 'Rejected' } : q))
        };
        return updated;
      });

      setSelectedQuote((prev) => (prev && prev.quote && prev.quote.id === quoteId ? { ...prev, quote: { ...prev.quote, status: 'Rejected' } } : prev));
      setCurrentView('list');
    } catch (err) {
      console.error('Reject failed', err);
      setError(err.response?.data?.message || err.message || 'Failed to reject quote');
    } finally {
      setLoading(false);
    }
  };






  const QuoteList = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    if (!queryWithQuotes) return null;

    const nextQuote = () => {
      setCurrentQuoteIndex((prev) =>
        prev === queryWithQuotes.quotes.length - 1 ? 0 : prev + 1
      );
    };

    const prevQuote = () => {
      setCurrentQuoteIndex((prev) =>
        prev === 0 ? queryWithQuotes.quotes.length - 1 : prev - 1
      );
    };

    const goToQuote = (index) => {
      setCurrentQuoteIndex(index);
    };

    return (
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-5 lg:px-6">
        <div className="mb-10">
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 mb-6 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-1">Quote Review</h1>
            <p className="text-lg text-gray-600 font-medium">{queryWithQuotes.title}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
          <div className="p-4">
            <h2 className="text-xl font-bold text-black mb-1">{queryWithQuotes.title}</h2>
            <p className="text-gray-800 text-sm">{queryWithQuotes.description}</p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium">Query ID</p>
                <p className="text-gray-900 font-semibold text-sm">{queryWithQuotes.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Priority</p>
                <p className="text-gray-900 font-semibold text-sm capitalize">{queryWithQuotes.priority}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Submitted</p>
                <p className="text-gray-900 font-semibold text-sm">{queryWithQuotes.submittedDate ? new Date(queryWithQuotes.submittedDate).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Quotes</p>
                <p className="text-lg  font-bold text-green-600">{queryWithQuotes.quotes.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Submitted Quotes</h3>
            <div className="text-sm text-gray-600">
              {queryWithQuotes.quotes.length > 0 && (
                <span>{currentQuoteIndex + 1} of {queryWithQuotes.quotes.length}</span>
              )}
            </div>
          </div>

          {queryWithQuotes.quotes.length > 0 ? (
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-2xl mx-auto">
               
                <div className={`absolute top-0 right-0 w-1 h-full ${
                  queryWithQuotes.quotes[currentQuoteIndex].status === 'Approved' 
                    ? 'bg-green-500' 
                    : 'bg-yellow-500'
                }`} />

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" stroke="currentColor" className="text-gray-600">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{queryWithQuotes.quotes[currentQuoteIndex].providerName}</h4>
                    <p className="text-lg text-gray-600 mb-4">{queryWithQuotes.quotes[currentQuoteIndex].providerCompany}</p>
                    
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold text-gray-800">{queryWithQuotes.quotes[currentQuoteIndex].providerRating}</span>
                      </div>

                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        queryWithQuotes.quotes[currentQuoteIndex].status === 'Approved'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          queryWithQuotes.quotes[currentQuoteIndex].status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        {queryWithQuotes.quotes[currentQuoteIndex].status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border text-center mb-6">
                    <div className="text-4xl font-bold text-black mb-2">
                      ${queryWithQuotes.quotes[currentQuoteIndex].total.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Quote Amount</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setSelectedQuote({ query: queryWithQuotes, quote: queryWithQuotes.quotes[currentQuoteIndex] });
                        setCurrentView('detail');
                      }}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 text-white bg-black rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Full Details
                    </button>
                    
                    <button className="flex-1 inline-flex items-center justify-center px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Contact Provider
                    </button>
                  </div>
                </div>
              </div>

              {queryWithQuotes.quotes.length > 1 && (
                <>
                  <button
                    onClick={prevQuote}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={nextQuote}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:bg-gray-50"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {queryWithQuotes.quotes.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {queryWithQuotes.quotes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuote(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentQuoteIndex 
                          ? 'bg-black scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quotes Yet</h3>
              <p className="text-gray-600">No quotes have been submitted for this request yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!queryWithQuotes) {
    return <div className="text-center py-10 text-gray-600">No query found.</div>;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      {currentView === 'list' && <QuoteList />}
      {currentView === 'detail' && selectedQuote && (
        <QuoteDetail query={selectedQuote.query} quote={selectedQuote.quote} />
      )}
    </div>
  );
};

export default QuoteReview;
