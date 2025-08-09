import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0
  });


  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://localhost:5000/api',
  });


  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });


  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching queries from:', `${api.defaults.baseURL}/client/my-queries`);
      
      const startTime = Date.now();
      const response = await api.get('/client/my-queries');
      const endTime = Date.now();
      
      console.log(`API call took ${endTime - startTime}ms`);
      console.log('Response data:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setQueries(response.data);
        calculateStats(response.data);
        console.log(`Loaded ${response.data.length} queries successfully`);
      } else {
        setQueries([]);
        calculateStats([]);
        console.log('No queries found or invalid response format');
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      setError(error.response?.data?.message || 'Failed to fetch queries');
      
      
      if (process.env.NODE_ENV === 'development') {
        const mockQueries = [
          {
            _id: 'RQ-1704067200001',
            title: 'FDA Medical Device Classification Requirements',
            context: 'Need guidance on Class II medical device registration process and 510(k) submission requirements for our new diagnostic equipment.',
            status: 'completed',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-15',
            priority: 'high',
            regulatoryArea: 'FDA Compliance',
            questions: ['What are the specific requirements for 510(k) submission?', 'What documentation is needed for predicate device comparison?'],
            attachments: ['device_specs.pdf', 'technical_drawings.pdf']
          },
          {
            _id: 'RQ-1704153600002',
            title: 'Environmental Compliance for Manufacturing Facility',
            context: 'Questions regarding EPA regulations for our new manufacturing facility in California, specifically air quality permits and waste disposal requirements.',
            status: 'in-progress',
            createdAt: '2024-01-02',
            updatedAt: '2024-01-20',
            priority: 'medium',
            regulatoryArea: 'Environmental',
            questions: ['What permits are required for volatile organic compound emissions?'],
            attachments: ['facility_plans.pdf']
          }
        ];
        setQueries(mockQueries);
        calculateStats(mockQueries);
      }
    } finally {
      setLoading(false);
    }
  };

  
  const calculateStats = (queriesData) => {
    const total = queriesData.length;
    const inProgress = queriesData.filter(q => 
      q.status === 'in-progress' || q.status === 'pending' || q.status === 'under-review'
    ).length;
    const completed = queriesData.filter(q => 
      q.status === 'completed' || q.status === 'approved'
    ).length;

    setStats({ total, inProgress, completed });
  };


  useEffect(() => {
    fetchQueries();
  }, []);

  const formatStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'under-review':
        return 'Under Review';
      case 'pending':
        return 'New';
      default:
        return 'New';
    }
  };


  const formatPriority = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Medium';
    }
  };

  const getStatusColor = (status) => {
    const formattedStatus = formatStatus(status);
    switch (formattedStatus) {
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'In Progress':
        return 'bg-yellow-500 text-white';
      case 'Under Review':
        return 'bg-blue-500 text-white';
      case 'New':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority) => {
    const formattedPriority = formatPriority(priority);
    switch (formattedPriority) {
      case 'High':
        return 'bg-red-500 text-white';
      case 'Medium':
        return 'bg-orange-500 text-white';
      case 'Low':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleQueryClick = async (query) => {
    try {
      if (query.status === 'completed' || query.status === 'approved') {
        navigate(`/query/${query._id}`);
      } 
      
      else if (query.status === 'pending' || query.status === 'in-progress' || query.status === 'new') {
        navigate(`/quote-review?queryId=${query._id}`);
      } 
     
      else {
        navigate(`/query/${query._id}`);
      }
    } catch (error) {
      console.error('Error navigating to query:', error);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.context?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.regulatoryArea?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         formatStatus(query.status).toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your queries...</p>
        </div>
      </div>
    );
  }

  if (error && queries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error loading queries</p>
            <p>{error}</p>
            <button 
              onClick={fetchQueries}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Regulatory Query Dashboard</h1>
        <button 
          className="ml-6 bg-gradient-to-r from-black to-gray-600 text-white px-5 py-2.5 rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md"
          onClick={() => navigate('/new-query')}
        >
          + New Query
        </button>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">

        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-5 rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h2 className="text-sm font-medium text-gray-600">Total Queries</h2>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">{stats.total}</p>
        </div>


        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-5 rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="text-sm font-medium text-gray-600">In Progress</h2>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">{stats.inProgress}</p>
        </div>


        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-5 rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h2 className="text-sm font-medium text-gray-600">Completed</h2>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">{stats.completed}</p>
        </div>
      </div>


      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="in progress">In Progress</option>
              <option value="under review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queries Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {filteredQueries.length > 0 ? `Your Queries (${filteredQueries.length})` : 'No Queries Found'}
          </h2>
          {error && (
            <button 
              onClick={fetchQueries}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Retry
            </button>
          )}
        </div>

        {filteredQueries.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No queries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first regulatory query.'}
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/new-query')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Create New Query
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQueries.map((query) => (
              <div
                key={query._id}
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-700 group"
                onClick={() => handleQueryClick(query)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white pr-4 line-clamp-2">{query.title}</h3>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(query.status)} flex-shrink-0`}>
                      {formatStatus(query.status)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(query.priority)}`}>
                      {formatPriority(query.priority)} Priority
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                    {query.context || query.description}
                  </p>

                  {query.regulatoryArea && (
                    <div className="mb-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {query.regulatoryArea}
                      </span>
                    </div>
                  )}

                  {query.questions && query.questions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400">
                        {query.questions.length} question{query.questions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {query.attachments && query.attachments.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400">
                        📎 {query.attachments.length} attachment{query.attachments.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <div>
                      <p className="font-medium">
                        Created: <span className="text-gray-200">{formatDate(query.createdAt)}</span>
                      </p>
                      {query.updatedAt && query.updatedAt !== query.createdAt && (
                        <p className="font-medium mt-1">
                          Updated: <span className="text-gray-200">{formatDate(query.updatedAt)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;