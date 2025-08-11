import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Download, 
  FileText, 
  Calendar, 
  User, 
  MessageSquare,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import axios from 'axios';

const ClientDeliverables = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  
  const [deliverables, setDeliverables] = useState([]);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeliverables();
  }, [queryId]);

  const fetchDeliverables = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch deliverables
      const deliverablesResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/provider/query/${queryId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const queryResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/client/query/${queryId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      console.log('Deliverables response:', deliverablesResponse.data);
      setDeliverables(deliverablesResponse.data); 
      setQuery(queryResponse.data);
    } catch (error) {
      console.error('Error fetching deliverables:', error);
      setError(error.response?.data?.message || 'Failed to fetch deliverables');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconClass = "w-7 h-7";
    
    switch (extension) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-600`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${iconClass} text-blue-600`} />;
      case 'xls':
      case 'xlsx':
        return <FileText className={`${iconClass} text-emerald-600`} />;
      case 'ppt':
      case 'pptx':
        return <FileText className={`${iconClass} text-orange-600`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Eye className={`${iconClass} text-purple-600`} />;
      case 'zip':
      case 'rar':
        return <FileText className={`${iconClass} text-slate-600`} />;
      default:
        return <FileText className={`${iconClass} text-slate-500`} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-4 h-4 mr-2" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            {status}
          </span>
        );
    }
  };

if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex items-center space-x-2 text-indigo-600 animate-pulse">
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-lg font-medium">Loading ...</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="flex items-center justify-center text-red-600 mb-6">
              <AlertCircle className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-3 font-serif">
              Error Loading Deliverables
            </h2>
            <p className="text-center text-slate-600 mb-8 text-lg leading-relaxed">{error}</p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Back to Dashboard
              </button>
              <button
                onClick={fetchDeliverables}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const latestDeliverable = deliverables.length > 0 ? deliverables[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-indigo-700 hover:text-indigo-900 mb-8 font-medium transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 font-serif leading-tight">
            Project Deliverables
          </h1>
          {query && (
            <div className="space-y-4">
              <p className="text-2xl text-slate-700 font-bold leading-relaxed">{query.title}</p>
              <div className="flex items-center justify-center space-x-6 flex-wrap gap-2">
                <span className="text-sm text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-lg">
                  Query ID: {queryId}
                </span>
                {getStatusBadge(query.status)}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {query && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 font-serif">Project Details</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">Description</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{query.context}</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-lg mb-2">Service Provider</h4>
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-slate-400 mr-3" />
                      <span className="text-slate-600 font-medium text-lg">
                        {latestDeliverable?.provider?.name || 'Not assigned'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-lg mb-2">Created</h4>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                      <span className="text-slate-600 font-medium text-lg">
                        {new Date(query.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {latestDeliverable ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 font-serif">Delivered Files</h2>
              
              {latestDeliverable.message && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <MessageSquare className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900 text-lg mb-2">Message from Provider</h4>
                      <p className="text-blue-800 leading-relaxed text-lg">{latestDeliverable.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {latestDeliverable.files && latestDeliverable.files.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-slate-800 mb-6">
                    Files ({latestDeliverable.files.length})
                  </h3>
                  {latestDeliverable.files.map((fileUrl, index) => {
                    const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all duration-300 border border-slate-200 hover:border-slate-300"
                      >
                        <div className="flex items-center space-x-4">
                          {getFileIcon(fileName)}
                          <div>
                            <p className="font-semibold text-slate-900 text-lg">{fileName}</p>
                            <p className="text-slate-500 font-medium">
                              Uploaded {new Date(latestDeliverable.submittedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(fileUrl, fileName)}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-xl font-medium">No files have been uploaded yet.</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center text-slate-500 font-medium">
                    <Calendar className="w-5 h-5 mr-3" />
                    Delivered on {new Date(latestDeliverable.submittedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {latestDeliverable.provider && (
                    <div className="flex items-center text-slate-500 font-medium">
                      <User className="w-5 h-5 mr-3" />
                      {latestDeliverable.provider.name}
                    </div>
                  )}
                </div>
              </div>

              {deliverables.length > 1 && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-600 font-medium">
                    Showing latest delivery. Total deliveries: <span className="font-bold text-slate-800">{deliverables.length}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="text-center py-16">
                <Clock className="w-20 h-20 mx-auto text-slate-300 mb-6" />
                <h3 className="text-3xl font-bold text-slate-800 mb-4 font-serif">
                  Deliverables Pending
                </h3>
                <p className="text-slate-500 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                  Your service provider is still working on this project. 
                  Deliverables will appear here once they are uploaded.
                </p>
                <button
                  onClick={fetchDeliverables}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDeliverables;