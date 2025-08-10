import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, FileText, CheckCircle, Calendar, Clock, DollarSign } from 'lucide-react';

const QueryDetail = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const fetchQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      
     
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/api/provider/queries/${queryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setQuery(response.data);
      } else {
        setError('Query not found');
      }
    } catch (err) {
      console.error('Error fetching query details:', err);
      if (err.response?.status === 404) {
        setError('Query not found');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch query details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      fetchQuery();
    }
  }, [queryId]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'New': 
        return {
          bg: 'bg-gradient-to-r from-amber-100 to-orange-100',
          text: 'text-amber-800',
          border: 'border-amber-200',
          icon: <Clock className="w-4 h-4" />
        };
      case 'Quoted': 
        return {
          bg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          icon: <DollarSign className="w-4 h-4" />
        };
      case 'Approved': 
        return {
          bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
      default: 
        return {
          bg: 'bg-gradient-to-r from-gray-100 to-slate-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: <FileText className="w-4 h-4" />
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'High': 
        return {
          text: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          pulse: 'animate-pulse'
        };
      case 'Medium': 
        return {
          text: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          pulse: ''
        };
      case 'Low': 
        return {
          text: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          pulse: ''
        };
      default: 
        return {
          text: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          pulse: ''
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-gray-200 rounded-2xl w-1/3"></div>
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-3xl flex items-center justify-center">
            <FileText className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-4xl font-black text-red-900 mb-4">Error Loading Query</h1>
          <p className="text-xl text-red-600 mb-8">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => fetchQuery()}
              className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/service-provider')}
              className="px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Query Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The query you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/service-provider')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(query.status);
  const priorityConfig = getPriorityConfig(query.priority);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto animate-in slide-in-from-right-10 duration-500">
        <div className="mb-8">
          <button
            onClick={() => navigate('/service-provider')}
            className="group flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 rotate-180 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-black text-gray-900">{query.title}</h1>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border shadow-sm`}>
              {statusConfig.icon}
              <span className="ml-2">{query.status}</span>
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="font-bold text-gray-600">Query ID:</span>
                <p className="font-mono text-lg font-bold text-gray-900 mt-1">{query.id}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="font-bold text-gray-600">Submitted:</span>
                <p className="text-lg font-bold text-gray-900 mt-1">{new Date(query.submittedDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="font-bold text-gray-600">Last Updated:</span>
                <p className="text-lg font-bold text-gray-900 mt-1">{new Date(query.lastUpdated).toLocaleDateString()}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="font-bold text-gray-600">Client:</span>
                <p className="text-lg font-bold text-gray-900 mt-1">{query.clientName}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-xl">
                <span className="font-bold text-gray-600">Priority:</span>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border} border ${priorityConfig.pulse}`}>
                  {query.priority}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Description</h3>
              <p className="text-lg text-gray-700 leading-relaxed">{query.description}</p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Detailed Questions</h3>
              <p className="text-lg text-gray-700 leading-relaxed">{query.detailedQuestions}</p>
            </div>

            {query.attachments && query.attachments.length > 0 && (
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Attachments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {query.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center p-4 rounded-xl cursor-pointer group">
                      <FileText className="w-6 h-6 mr-3 text-blue-900 group-hover:text-blue-800" />
                      <span className="text-blue-600 font-semibold">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {query.quote && query.quote.status === 'Approved' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
                <h3 className="text-2xl font-black text-green-900 mb-4 flex items-center">
                  <CheckCircle className="w-8 h-8 mr-3" />
                  Approved Quote
                </h3>
                <div className="space-y-4">
                  {query.quote.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-4 px-6 bg-white/50 rounded-xl border border-green-100">
                      <div>
                        <span className="font-black text-green-900 text-lg">{item.country}</span>
                        <div className="text-sm text-green-700 font-semibold">
                          {item.hours} hours × ${item.rate}/hr
                        </div>
                      </div>
                      <span className="font-black text-green-900 text-xl">${item.total.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-6 font-black text-2xl border-t border-green-200">
                    <span className="text-green-900">Total Approved Amount:</span>
                    <span className="text-green-900">${query.quote.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {(!query.quote || query.quote.status !== 'Approved') && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-8">
                <h3 className="text-2xl font-black text-indigo-900 mb-6 flex items-center">
                  <FileText className="w-8 h-8 mr-3" />
                  Requirements
                </h3>
                <div className="space-y-4 text-indigo-800">
                  {[
                    'Review the client\'s detailed questions and requirements',
                    'Analyze the provided attachments and context',
                    'Prepare a comprehensive quote with country-wise breakdown',
                    'Include estimated hours, rates, and total costs',
                    'Provide detailed notes about your approach and expertise'
                  ].map((req, index) => (
                    <div key={index} className="flex items-start p-4 bg-white/50 rounded-xl">
                      <span className="font-black text-indigo-600 mr-3 text-lg">•</span>
                      <span className="font-semibold">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              {query.status === 'New' && (
                <button
                  onClick={() => navigate(`/submit-quote/${query.id}`)}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  Submit Quote
                </button>
              )}
              
              {query.status === 'Approved' && (
                <button
                  onClick={() => navigate(`/upload-deliverables/${query.id}`)}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  Upload Deliverables
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDetail;
