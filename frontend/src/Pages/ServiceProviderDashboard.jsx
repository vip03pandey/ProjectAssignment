import React, { useState } from 'react';
import { Plus, Eye, Calendar, FileText, Search, Filter, ChevronRight, Clock, CheckCircle, AlertCircle, XCircle, DollarSign, Upload } from 'lucide-react';

const ServiceProviderDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for assigned queries
  const [queries] = useState([
    {
      id: 'RQ-1704067200001',
      title: 'FDA Medical Device Classification Requirements',
      description: 'Need guidance on Class II medical device registration process and 510(k) submission requirements for our new diagnostic equipment.',
      status: 'New',
      submittedDate: '2024-01-01',
      lastUpdated: '2024-01-15',
      priority: 'High',
      clientName: 'MedTech Solutions Inc.',
      detailedQuestions: 'What are the specific requirements for 510(k) submission? What documentation is needed for predicate device comparison? What are the typical review timelines?',
      attachments: ['device_specs.pdf', 'technical_drawings.pdf'],
      quote: null,
      deliverables: []
    },
    {
      id: 'RQ-1704153600002',
      title: 'Environmental Compliance for Manufacturing Facility',
      description: 'Questions regarding EPA regulations for our new manufacturing facility in California, specifically air quality permits and waste disposal requirements.',
      status: 'Quoted',
      submittedDate: '2024-01-02',
      lastUpdated: '2024-01-20',
      priority: 'Medium',
      clientName: 'Green Manufacturing Co.',
      detailedQuestions: 'What permits are required for volatile organic compound emissions? What are the waste classification requirements? Are there specific California state regulations we need to consider?',
      attachments: ['facility_plans.pdf'],
      quote: {
        items: [
          { country: 'United States', hours: 8, rate: 75, total: 600 },
          { country: 'California', hours: 4, rate: 85, total: 340 }
        ],
        total: 940,
        status: 'Pending'
      },
      deliverables: []
    },
    {
      id: 'RQ-1704240000003',
      title: 'Data Privacy Compliance - GDPR & CCPA',
      description: 'Seeking clarification on data privacy requirements for our SaaS platform that processes personal information of EU and California residents.',
      status: 'Approved',
      submittedDate: '2024-01-03',
      lastUpdated: '2024-01-03',
      priority: 'High',
      clientName: 'DataFlow Systems',
      detailedQuestions: 'What are the consent requirements under GDPR? How do we handle data subject access requests? What are the differences between GDPR and CCPA requirements?',
      attachments: ['privacy_policy_draft.pdf', 'data_flow_diagram.png'],
      quote: {
        items: [
          { country: 'EU', hours: 12, rate: 90, total: 1080 },
          { country: 'California', hours: 6, rate: 85, total: 510 }
        ],
        total: 1590,
        status: 'Approved'
      },
      deliverables: []
    },
    {
      id: 'RQ-1704326400004',
      title: 'Financial Services Licensing Requirements',
      description: 'Questions about state licensing requirements for our fintech application that provides investment advisory services.',
      status: 'Approved',
      submittedDate: '2024-01-04',
      lastUpdated: '2024-01-18',
      priority: 'Medium',
      clientName: 'FinTech Innovations',
      detailedQuestions: 'Which states require investment advisor licenses? What are the net capital requirements? Do we need to register with FINRA?',
      attachments: ['business_model.pdf'],
      quote: {
        items: [
          { country: 'United States', hours: 15, rate: 80, total: 1200 },
          { country: 'New York', hours: 8, rate: 95, total: 760 },
          { country: 'California', hours: 6, rate: 85, total: 510 }
        ],
        total: 2470,
        status: 'Approved'
      },
      deliverables: []
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Quoted': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Submitted': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New': return <Clock className="w-4 h-4" />;
      case 'Quoted': return <DollarSign className="w-4 h-4" />;
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Submitted': return <Upload className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const QuoteForm = ({ query }) => {
    const [quoteItems, setQuoteItems] = useState([
      { country: '', hours: '', rate: '', total: 0 }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addQuoteItem = () => {
      setQuoteItems([...quoteItems, { country: '', hours: '', rate: '', total: 0 }]);
    };

    const removeQuoteItem = (index) => {
      if (quoteItems.length > 1) {
        setQuoteItems(quoteItems.filter((_, i) => i !== index));
      }
    };

    const updateQuoteItem = (index, field, value) => {
      const updatedItems = [...quoteItems];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      
      // Calculate total for this item
      if (field === 'hours' || field === 'rate') {
        const hours = field === 'hours' ? value : updatedItems[index].hours;
        const rate = field === 'rate' ? value : updatedItems[index].rate;
        updatedItems[index].total = hours * rate;
      }
      
      setQuoteItems(updatedItems);
    };

    const calculateTotal = () => {
      return quoteItems.reduce((sum, item) => sum + (item.total || 0), 0);
    };

    const handleSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentView('dashboard');
        // In real app, would submit to backend
      }, 2000);
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Submit Quote</h2>
          <p className="text-gray-600 mt-2">Query: {query.title}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {quoteItems.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={item.country}
                  onChange={(e) => updateQuoteItem(index, 'country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., United States"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours *
                </label>
                <input
                  type="number"
                  value={item.hours}
                  onChange={(e) => updateQuoteItem(index, 'hours', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate ($/hr) *
                </label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateQuoteItem(index, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    ${item.total || 0}
                  </div>
                </div>
                
                {quoteItems.length > 1 && (
                  <button
                    onClick={() => removeQuoteItem(index)}
                    className="px-2 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addQuoteItem}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            + Add Another Country
          </button>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Quote:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quote'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const QueryDetail = ({ query }) => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{query.title}</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(query.status)}`}>
              {getStatusIcon(query.status)}
              <span className="ml-1">{query.status}</span>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Query ID:</span>
                <p className="font-mono text-gray-900">{query.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Submitted:</span>
                <p className="text-gray-900">{new Date(query.submittedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Last Updated:</span>
                <p className="text-gray-900">{new Date(query.lastUpdated).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Client:</span>
                <p className="text-gray-900">{query.clientName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Priority:</span>
                <p className={`font-medium ${getPriorityColor(query.priority)}`}>{query.priority}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{query.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Questions</h3>
              <p className="text-gray-700">{query.detailedQuestions}</p>
            </div>

            {query.attachments && query.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Attachments</h3>
                <div className="space-y-2">
                  {query.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="cursor-pointer">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show Approved Quote if available */}
            {query.quote && query.quote.status === 'Approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-green-900 mb-4">✅ Approved Quote</h3>
                <div className="space-y-3">
                  {query.quote.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-green-100">
                      <div>
                        <span className="font-medium text-green-900">{item.country}</span>
                        <div className="text-sm text-green-700">
                          {item.hours} hours × ${item.rate}/hr
                        </div>
                      </div>
                      <span className="font-semibold text-green-900">${item.total}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 font-bold text-lg border-t border-green-200">
                    <span className="text-green-900">Total Approved Amount:</span>
                    <span className="text-green-900">${query.quote.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Show Basic Requirements if no approved quote */}
            {(!query.quote || query.quote.status !== 'Approved') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4">📋 Requirements</h3>
                <div className="space-y-3 text-blue-800">
                  <div className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Review the client's detailed questions and requirements</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Analyze the provided attachments and context</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Prepare a comprehensive quote with country-wise breakdown</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Include estimated hours, rates, and total costs</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <span>Provide detailed notes about your approach and expertise</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DeliverableUpload = ({ query }) => {
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
      setFiles(Array.from(e.target.files));
    };

    const handleSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentView('dashboard');
        // In real app, would upload to backend
      }, 2000);
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Upload Deliverables</h2>
          <p className="text-gray-600 mt-2">Query: {query.title}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {files.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Deliverables'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Dashboard</h1>
          <p className="text-gray-600">Manage your assigned regulatory queries and deliverables</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assigned Queries</p>
                <p className="text-2xl font-bold text-gray-900">{queries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Quotes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queries.filter(q => q.status === 'New').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queries.filter(q => q.status === 'Approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ready for Delivery</p>
                <p className="text-2xl font-bold text-gray-900">
                  {queries.filter(q => q.status === 'Approved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Approved">Approved</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Queries List */}
          <div className="divide-y divide-gray-200">
            {filteredQueries.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredQueries.map((query) => (
                <div key={query.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{query.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                          {getStatusIcon(query.status)}
                          <span className="ml-1">{query.status}</span>
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(query.priority)}`}>
                          {query.priority} Priority
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{query.description}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Assigned: {new Date(query.submittedDate).toLocaleDateString()}
                        </span>
                        <span>ID: {query.id}</span>
                        <span>Client: {query.clientName}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {query.status === 'New' && (
                        <button
                          onClick={() => {
                            setSelectedQuery(query);
                            setCurrentView('quote-form');
                          }}
                          className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Submit Quote
                        </button>
                      )}
                      
                      {query.status === 'Approved' && (
                        <button
                          onClick={() => {
                            setSelectedQuery(query);
                            setCurrentView('deliverable-upload');
                          }}
                          className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Upload Deliverables
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedQuery(query);
                          setCurrentView('query-detail');
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'quote-form' && selectedQuery && <QuoteForm query={selectedQuery} />}
      {currentView === 'query-detail' && selectedQuery && <QueryDetail query={selectedQuery} />}
      {currentView === 'deliverable-upload' && selectedQuery && <DeliverableUpload query={selectedQuery} />}
    </div>
  );
};

export default ServiceProviderDashboard; 