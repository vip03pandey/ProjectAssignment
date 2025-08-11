import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const UploadDeliverables = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setUploadStatus(null);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      if (message.trim()) {
        formData.append('message', message);
      }

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/provider/query/${queryId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setUploadStatus('success');
        toast.success('Deliverables uploaded successfully!');
        setTimeout(() => {
          navigate('/service-provider');
        }, 2000);
      }
    } catch (error) {
      toast.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'success':
        return { text: 'Deliverables uploaded successfully!', color: 'text-green-600' };
      case 'error':
        return { text: 'Failed to upload deliverables. Please try again.', color: 'text-red-600' };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/service-provider')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
          Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Deliverables</h1>
          <p className="text-xl text-gray-600">Query ID: {queryId}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {statusMessage && (
            <div className={`flex items-center justify-center p-4 rounded-lg ${
              uploadStatus === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {uploadStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${statusMessage.color}`}>
                {statusMessage.text}
              </span>
            </div>
          )}

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isUploading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Select multiple files to upload as deliverables
            </p>
          </div>


          <div>
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Additional Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={4}
              placeholder="Add any additional notes or descriptions for your deliverables..."
              disabled={isUploading}
            />
          </div>

          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Selected Files:</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600 mr-3" />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/service-provider')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading || files.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Deliverables
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDeliverables;