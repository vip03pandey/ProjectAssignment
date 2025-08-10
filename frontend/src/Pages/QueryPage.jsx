import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, FileText, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'closed':
      case 'submitted':
        return { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: <CheckCircle className="w-5 h-5" /> };
      case 'approved':
        return { color: 'bg-sky-50 text-sky-700 border border-sky-200', icon: <CheckCircle className="w-5 h-5" /> };
      case 'quoted':
        return { color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: <FileText className="w-5 h-5" /> };
      case 'new':
      default:
        return { color: 'bg-slate-50 text-slate-700 border border-slate-200', icon: <Clock className="w-5 h-5" /> };
    }
  };

  const { color, icon } = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${color} transition-all duration-300 hover:shadow-md hover:scale-105`}
      role="status"
      aria-label={`Status: ${status || 'New'}`}
    >
      {icon}
      <span className="ml-2">{status || 'New'}</span>
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'medium':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'low':
        return 'bg-green-50 text-green-700 border border-green-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  if (!priority) return null;

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${getPriorityConfig(priority)} transition-all duration-300 hover:shadow-md hover:scale-105`}
      role="status"
      aria-label={`Priority: ${priority}`}
    >
      {priority} Priority
    </span>
  );
};

const QueryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/client/query/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuery(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch query details.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuery();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-slate-200 rounded-lg w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-rose-600 text-xl font-semibold">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all duration-300 font-medium text-lg hover:shadow-lg hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!query) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center text-slate-600 hover:text-slate-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-lg p-2 font-medium text-lg hover:bg-white hover:shadow-sm"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-6 h-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dashboard
          </button>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-6 gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2 leading-tight">
                {query.title || 'Untitled Query'}
              </h1>
              <p className="text-slate-500 text-lg font-medium">Query ID: {query._id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <StatusBadge status={query.status} />
              <PriorityBadge priority={query.priority} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-900">Query Details</h2>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-base">
                {query.regulatoryArea && (
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-600 text-lg">Regulatory Area</span>
                    <p className="text-slate-900 font-medium text-lg">{query.regulatoryArea}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-600 text-lg">Created</span>
                  <p className="text-slate-900 flex items-center font-medium text-lg">
                    <Calendar className="w-5 h-5 mr-3 text-slate-500" />
                    {formatDate(query.createdAt)}
                  </p>
                </div>
                {query.deadline && (
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-600 text-lg">Deadline</span>
                    <p className="text-slate-900 flex items-center font-medium text-lg">
                      <Calendar className="w-5 h-5 mr-3 text-rose-500" />
                      {formatDate(query.deadline)}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-600 text-lg">Status</span>
                  <p className="text-slate-900 font-medium text-lg">{query.status || 'New'}</p>
                </div>
              </div>

              {query.context && (
                <div className="bg-slate-50 p-6 rounded-xl border">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Context</h3>
                  <p className="text-slate-700 leading-relaxed text-lg font-medium">{query.context}</p>
                </div>
              )}

              {query.questions && query.questions.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Questions</h3>
                  <ul className="space-y-3">
                    {query.questions.map((question, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                          {index + 1}
                        </span>
                        <span className="text-slate-700 leading-relaxed text-lg font-medium">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {query.attachments && query.attachments.length > 0 && (
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Attachments</h3>
                  <div className="space-y-4">
                    {query.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center text-lg font-medium text-blue-600 hover:text-blue-800 transition-all duration-300 p-4 bg-white rounded-xl border hover:shadow-md hover:scale-[1.02]"
                        aria-label={`Download attachment: ${attachment}`}
                      >
                        <FileText className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform duration-300 text-blue-500" />
                        <span className="truncate">{attachment}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QueryDetail;