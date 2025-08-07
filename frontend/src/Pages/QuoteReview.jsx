import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, DollarSign, User, Calendar, Clock, Star, ArrowLeft } from 'lucide-react';

const QuoteReview = () => {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('queryId');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [currentView, setCurrentView] = useState('list');

  // Mock data for the specific query with quotes from different providers
  const [queryWithQuotes] = useState({
    id: queryId || 'RQ-1704067200001',
    title: 'FDA Medical Device Classification Requirements',
    description: 'Need guidance on Class II medical device registration process and 510(k) submission requirements for our new diagnostic equipment.',
    status: 'Quoted',
    submittedDate: '2024-01-01',
    priority: 'High',
    clientName: 'MedTech Solutions Inc.',
    detailedQuestions: 'What are the specific requirements for 510(k) submission? What documentation is needed for predicate device comparison? What are the typical review timelines?',
    attachments: ['device_specs.pdf', 'technical_drawings.pdf'],
    quotes: [
      {
        id: 'Q-001',
        providerName: 'Sarah Johnson',
        providerCompany: 'Regulatory Solutions Inc.',
        providerRating: 4.8,
        providerExperience: '15+ years',
        submittedDate: '2024-01-05',
        items: [
          { country: 'United States', hours: 10, rate: 85, total: 850 },
          { country: 'EU', hours: 8, rate: 95, total: 760 }
        ],
        total: 1610,
        status: 'Pending',
        estimatedDelivery: '2024-02-15',
        providerNotes: 'We have extensive experience with FDA 510(k) submissions and can provide comprehensive guidance on your medical device classification.'
      },
      {
        id: 'Q-002',
        providerName: 'Michael Chen',
        providerCompany: 'MedTech Compliance Group',
        providerRating: 4.6,
        providerExperience: '12+ years',
        submittedDate: '2024-01-06',
        items: [
          { country: 'United States', hours: 12, rate: 75, total: 900 },
          { country: 'EU', hours: 10, rate: 80, total: 800 }
        ],
        total: 1700,
        status: 'Pending',
        estimatedDelivery: '2024-02-20',
        providerNotes: 'Specialized in medical device regulatory compliance with a focus on diagnostic equipment.'
      },
      {
        id: 'Q-003',
        providerName: 'Emily Rodriguez',
        providerCompany: 'FDA Compliance Experts',
        providerRating: 4.9,
        providerExperience: '18+ years',
        submittedDate: '2024-01-07',
        items: [
          { country: 'United States', hours: 8, rate: 95, total: 760 },
          { country: 'EU', hours: 6, rate: 100, total: 600 }
        ],
        total: 1360,
        status: 'Pending',
        estimatedDelivery: '2024-02-10',
        providerNotes: 'Former FDA reviewer with deep expertise in medical device classification and 510(k) processes.'
      }
    ]
  });

  const handleApproveQuote = (queryId, quoteId) => {
    console.log(`Approved quote ${quoteId} for query ${queryId}`);
    setCurrentView('list');
  };

  const handleRejectQuote = (queryId, quoteId) => {
    console.log(`Rejected quote ${quoteId} for query ${queryId}`);
    setCurrentView('list');
  };

const QuoteDetail = ({ query, quote }) => {
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
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Quote Details</h2>
        <p className="text-lg text-blue-600 mt-3 font-medium">{query.title}</p>
      </div>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Provider Info */}
        <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{quote.providerName}</h3>
              <p className="text-sm text-gray-500 font-medium">{quote.providerCompany}</p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">{quote.providerRating}/5.0</span>
                </div>
                <span className="text-sm text-gray-600 font-medium">{quote.providerExperience} experience</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 tracking-tight">${quote.total}</div>
              <div className="text-sm text-gray-500 font-medium">Total Quote</div>
            </div>
          </div>
        </div>

        {/* Quote Items */}
        <div className="p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-5">Breakdown</h4>
          <div className="space-y-4">
            {quote.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div>
                  <span className="font-semibold text-gray-900">{item.country}</span>
                  <div className="text-sm text-gray-500">
                    {item.hours} hours × ${item.rate}/hr
                  </div>
                </div>
                <span className="font-semibold text-gray-900">${item.total}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-3 font-bold text-xl text-gray-900">
              <span>Total</span>
              <span>${quote.total}</span>
            </div>
          </div>

          {/* Provider Notes */}
          <div className="mt-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Provider Notes</h4>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <p className="text-gray-600 leading-relaxed">{quote.providerNotes}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Timeline</h4>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-600">
              <div className="flex items-center mb-2 sm:mb-0">
                <svg className="w-5 h-5 text-green-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-green-600 font-medium">Submitted: {new Date(quote.submittedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-600 font-medium">Estimated Delivery: {new Date(quote.estimatedDelivery).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {quote.status === 'Pending' && (
            <div className="mt-10 flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
              <button
                onClick={() => handleApproveQuote(query.id, quote.id)}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approve Quote
              </button>
              <button
                onClick={() => handleRejectQuote(query.id, quote.id)}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reject Quote
              </button>
            </div>
          )}

          {quote.status === 'Approved' && (
            <div className="mt-10">
              <div className="flex items-center justify-center px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quote Approved
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuoteList = () => {
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

      {/* Query Summary Card */}
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
              <p className="text-gray-900 font-semibold text-sm">{new Date(queryWithQuotes.submittedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Quotes</p>
              <p className="text-lg  font-bold text-green-600">{queryWithQuotes.quotes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Submitted Quotes</h3>

        {queryWithQuotes.quotes.map((quote) => (
          <div
            key={quote.id}
            className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden max-w-4xl mx-auto"
          >
            {/* Status Bar */}
            <div className={`absolute top-0 right-0 w-1 h-full ${
              quote.status === 'Approved' 
                ? 'bg-green-500' 
                : 'bg-yellow-500'
            }`} />

            <div className="p-4">
              {/* Top Section */}
              <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                {/* Provider */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" className="lucide lucide-user text-gray-600">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{quote.providerName}</h4>
                      <p className="text-sm text-gray-600">{quote.providerCompany}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-800">{quote.providerRating}</span>
                    </div>

                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      quote.status === 'Approved'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        quote.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      {quote.status}
                    </span>
                  </div>
                </div>

                {/* Price Box */}
                <div className="bg-gray-50 p-4 rounded-xl border text-center shadow-inner">
                  <div className="text-2xl font-bold text-black mb-1">
                    ${quote.total.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Total Quote</div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-md border text-sm">
                  <p className="text-blue-800 font-semibold mb-1">Submitted Date</p>
                  <p className="text-blue-900">{new Date(quote.submittedDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md border text-sm">
                  <p className="text-green-800 font-semibold mb-1">Estimated Delivery</p>
                  <p className="text-green-900">{new Date(quote.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-md border mb-4 text-sm">
                <h5 className="text-gray-900 font-semibold mb-2">Provider Notes</h5>
                <p className="italic text-gray-700">"{quote.providerNotes}"</p>
              </div>

              {/* Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedQuote({ query: queryWithQuotes, quote });
                    setCurrentView('detail');
                  }}
                  className="inline-flex items-center px-6 py-2.5 text-white bg-black rounded-2xl transition-transform transform hover:scale-105 text-sm shadow"
                >
                  View Full Details
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* No Quotes Fallback */}
        {queryWithQuotes.quotes.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-600">
            No quotes submitted yet.
          </div>
        )}
      </div>
    </div>
  );
};


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