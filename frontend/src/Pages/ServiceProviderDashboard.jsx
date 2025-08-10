import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, Calendar, FileText, Search, Filter, ChevronRight, Clock, CheckCircle, DollarSign, Upload, TrendingUp, Users, Award } from 'lucide-react';

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQueries: 0,
    hasNextPage: false,
    hasPrevPage: false
  });


  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';


  const fetchQueries = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true);
      setError(null);
      

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      if (status !== 'all') {
        params.append('status', status);
      }
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/api/provider/queries?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setQueries(response.data.queries || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalQueries: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    } catch (err) {
      console.error('Error fetching queries:', err);
      setError(err.response?.data?.error || 'Failed to fetch queries');
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchQueries();
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQueries(1, searchTerm, statusFilter);
    }, 500); 
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

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


  const filteredQueries = queries;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black">
            Dashboard Overview
          </h1>
          <p className="text-2xl font-semibold text-gray-600 max-w-2xl mx-auto">
            Manage your assigned regulatory queries with <span className="text-blue-600">precision</span> and <span className="text-blue-600">efficiency</span>
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            {
              icon: <FileText className="w-8 h-8" />,
              label: 'Assigned Queries',
              value: queries.length,
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50'
            },
            {
              icon: <DollarSign className="w-8 h-8" />,
              label: 'Pending Quotes',
              value: queries.filter(q => q.status === 'New').length,
              gradient: 'from-amber-500 to-orange-500',
              bgGradient: 'from-amber-50 to-orange-50'
            },
            {
              icon: <CheckCircle className="w-8 h-8" />,
              label: 'Approved Projects',
              value: queries.filter(q => q.status === 'Approved').length,
              gradient: 'from-green-500 to-emerald-500',
              bgGradient: 'from-green-50 to-emerald-50'
            },
            {
              icon: <Upload className="w-8 h-8" />,
              label: 'Ready for Delivery',
              value: queries.filter(q => q.status === 'Approved').length,
              gradient: 'from-purple-500 to-violet-500',
              bgGradient: 'from-purple-50 to-violet-50'
            }
          ].map((stat, index) => (
            <div key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-3xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group`}>
              <div className="flex items-center justify-between">
                <div className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 mb-8">
          <div className="p-8 border-b border-gray-200/50">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Active Queries</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search queries by title, description, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg font-semibold"
                />
              </div>
              
              <div className="relative">
                <Filter className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-12 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white text-lg font-semibold min-w-48"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Approved">Approved</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronRight className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>


          <div className="divide-y divide-gray-200/50">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading queries...</h3>
                <p className="text-gray-500 font-semibold">Please wait while we fetch your assigned queries</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-3xl flex items-center justify-center">
                  <FileText className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-3">Error loading queries</h3>
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <button
                  onClick={() => fetchQueries(1, searchTerm, statusFilter)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredQueries.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No queries found</h3>
                <p className="text-gray-500 font-semibold">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredQueries.map((query, index) => {
                const statusConfig = getStatusConfig(query.status);
                const priorityConfig = getPriorityConfig(query.priority);
                
                return (
                  <div key={query.id} className="p-8 hover:bg-gray-50/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-2xl font-black text-gray-900">
                            {query.title}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border shadow-sm`}>
                            {statusConfig.icon}
                            <span className="ml-1.5">{query.status}</span>
                          </span>
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border} border ${priorityConfig.pulse}`}>
                            {query.priority} Priority
                          </span>
                        </div>
                        <p className="text-gray-600 text-lg mb-4 line-clamp-2 font-semibold leading-relaxed">
                          {query.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-6 font-semibold">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Assigned: {new Date(query.submittedDate).toLocaleDateString()}
                          </span>
                          <span className="font-mono">ID: {query.id}</span>
                          <span className="text-gray-600">Client: {query.clientName}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 ml-8">
                        {query.status === 'New' && (
                          <button
                            onClick={() => navigate(`/submit-quote/${query.id}`)}
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
                          >
                            <DollarSign className="w-5 h-5 mr-2" />
                            Submit Quote
                          </button>
                        )}
                        
                        {query.status === 'Approved' && (
                          <button
                            onClick={() => navigate(`/upload-deliverables/${query.id}`)}
                            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:-translate-y-0.5"
                          >
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Deliverables
                          </button>
                        )}
                        
                        <button
                          onClick={() => navigate(`/query/${query.id}`)}
                          className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 rounded-2xl font-bold text-gray-700 "
                        >
                          <Eye className="w-5 h-5 mr-2 " />
                          View Details
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
