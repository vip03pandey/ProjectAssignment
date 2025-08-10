import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, CheckCircle } from 'lucide-react';

const ProviderQueryDetail = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);

  const mockQueries = [
    {
      id: 'RQ-1704067200001',
      title: 'FDA Drug Registration Requirements',
      description: 'Need comprehensive guidance on FDA drug registration process.',
      status: 'New',
      priority: 'High',
      clientName: 'PharmaCorp Inc.',
      submittedDate: '2024-01-01',
      attachments: ['drug-specifications.pdf']
    }
  ];

  useEffect(() => {
    const foundQuery = mockQueries.find(q => q.id === queryId);
    setQuery(foundQuery);
  }, [queryId]);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Query Not Found</h1>
          <button
            onClick={() => navigate('/service-provider')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/service-provider')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{query.title}</h1>
            <p className="text-gray-600">Query ID: {query.id}</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{query.description}</p>
            </div>

            <div className="flex justify-end space-x-4">
              {query.status === 'New' && (
                <button
                  onClick={() => navigate(`/submit-quote/${query.id}`)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg"
                >
                  Submit Quote
                </button>
              )}
              
              {query.status === 'Approved' && (
                <button
                  onClick={() => navigate(`/upload-deliverables/${query.id}`)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg"
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

export default ProviderQueryDetail;
