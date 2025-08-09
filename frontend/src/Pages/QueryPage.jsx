import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, FileText, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'closed':
      case 'submitted':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
      case 'approved':
        return { color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-4 h-4" /> };
      case 'quoted':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <FileText className="w-4 h-4" /> };
      case 'new':
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const { color, icon } = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color} transition-all duration-300 hover:shadow-md`}
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
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!priority) return null;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityConfig(priority)} transition-all duration-300 hover:shadow-md`}
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!query) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {query.title || 'Untitled Query'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Query ID: {query._id}</p>
            </div>
            <div className="flex items-center space-x-3">
              <StatusBadge status={query.status} />
              <PriorityBadge priority={query.priority} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Query Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                {query.regulatoryArea && (
                  <div>
                    <span className="font-medium text-gray-600">Regulatory Area:</span>
                    <p className="text-gray-900">{query.regulatoryArea}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {formatDate(query.createdAt)}
                  </p>
                </div>
                {query.deadline && (
                  <div>
                    <span className="font-medium text-gray-600">Deadline:</span>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {formatDate(query.deadline)}
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-gray-900">{query.status || 'New'}</p>
                </div>
              </div>

              {query.context && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Context</h3>
                  <p className="text-gray-600 leading-relaxed">{query.context}</p>
                </div>
              )}

              {query.questions && query.questions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {query.questions.map((question, index) => (
                      <li key={index} className="leading-relaxed">{question}</li>
                    ))}
                  </ul>
                </div>
              )}

              {query.attachments && query.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                  <div className="space-y-3">
                    {query.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
                        aria-label={`Download attachment: ${attachment}`}
                      >
                        <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
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