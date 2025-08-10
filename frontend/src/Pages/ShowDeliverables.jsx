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
    const iconClass = "w-6 h-6";
    
    switch (extension) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${iconClass} text-blue-500`} />;
      case 'xls':
      case 'xlsx':
        return <FileText className={`${iconClass} text-green-500`} />;
      case 'ppt':
      case 'pptx':
        return <FileText className={`${iconClass} text-orange-500`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Eye className={`${iconClass} text-purple-500`} />;
      case 'zip':
      case 'rar':
        return <FileText className={`${iconClass} text-gray-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-400`} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4 mr-1" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-gray-600">Loading deliverables...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Error Loading Deliverables
            </h2>
            <p className="text-center text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/client')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Back to Dashboard
              </button>
              <button
                onClick={fetchDeliverables}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/client')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Deliverables</h1>
          {query && (
            <div className="space-y-2">
              <p className="text-xl text-gray-600">{query.title}</p>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-sm text-gray-500">Query ID: {queryId}</span>
                {getStatusBadge(query.status)}
              </div>
            </div>
          )}
        </div>


        <div className="space-y-6">
          {query && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Project Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{query.description}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Service Provider</h4>
                    <div className="flex items-center mt-1">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        {query.assignedProvider?.name || 'Not assigned'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Created</h4>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {latestDeliverable ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Delivered Files</h2>
              {latestDeliverable.message && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-start">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900">Message from Provider</h4>
                      <p className="text-blue-800 mt-1">{latestDeliverable.message}</p>
                    </div>
                  </div>
                </div>
              )}


              {latestDeliverable.files && latestDeliverable.files.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Files ({latestDeliverable.files.length})
                  </h3>
                  {latestDeliverable.files.map((fileUrl, index) => {
                    const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(fileName)}
                          <div>
                            <p className="font-medium text-gray-800">{fileName}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded {new Date(latestDeliverable.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(fileUrl, fileName)}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No files have been uploaded yet.</p>
                </div>
              )}


              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Delivered on {new Date(latestDeliverable.submittedAt).toLocaleString()}
                  </div>
                  {latestDeliverable.provider && (
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      {latestDeliverable.provider.name}
                    </div>
                  )}
                </div>
              </div>


              {deliverables.length > 1 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Showing latest delivery. Total deliveries: {deliverables.length}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Deliverables Pending
                </h3>
                <p className="text-gray-500 mb-6">
                  Your service provider is still working on this project. 
                  Deliverables will appear here once they are uploaded.
                </p>
                <button
                  onClick={fetchDeliverables}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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