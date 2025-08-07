import React, { useState } from 'react';
import {
  Plus, Eye, Calendar, FileText, Search, Filter, ChevronRight, Clock, CheckCircle, AlertCircle, XCircle
} from 'lucide-react';

const ClientDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [queries] = useState([
    {
      id: 'RQ-1704067200001',
      title: 'FDA Medical Device Classification Requirements',
      description: 'Need guidance on Class II medical device registration process and 510(k) submission requirements for our new diagnostic equipment.',
      status: 'Completed',
      submittedDate: '2024-01-01',
      lastUpdated: '2024-01-15',
      priority: 'High',
      assignedTo: 'Sarah Johnson',
      detailedQuestions: 'What are the specific requirements for 510(k) submission? What documentation is needed for predicate device comparison? What are the typical review timelines?',
      attachments: ['device_specs.pdf', 'technical_drawings.pdf'],
      response: 'Based on your device specifications, you will need to submit a 510(k) premarket notification...'
    },
    {
      id: 'RQ-1704153600002',
      title: 'Environmental Compliance for Manufacturing Facility',
      description: 'Questions regarding EPA regulations for our new manufacturing facility in California, specifically air quality permits and waste disposal requirements.',
      status: 'In Progress',
      submittedDate: '2024-01-02',
      lastUpdated: '2024-01-20',
      priority: 'Medium',
      assignedTo: 'Michael Chen',
      detailedQuestions: 'What permits are required for volatile organic compound emissions? What are the waste classification requirements? Are there specific California state regulations we need to consider?',
      attachments: ['facility_plans.pdf'],
      response: null
    },
    {
      id: 'RQ-1704240000003',
      title: 'Data Privacy Compliance - GDPR & CCPA',
      description: 'Seeking clarification on data privacy requirements for our SaaS platform that processes personal information of EU and California residents.',
      status: 'New',
      submittedDate: '2024-01-03',
      lastUpdated: '2024-01-03',
      priority: 'High',
      assignedTo: 'Emily Rodriguez',
      detailedQuestions: 'What are the consent requirements under GDPR? How do we handle data subject access requests? What are the differences between GDPR and CCPA requirements?',
      attachments: ['privacy_policy_draft.pdf', 'data_flow_diagram.png'],
      response: null
    },
    {
      id: 'RQ-1704326400004',
      title: 'Financial Services Licensing Requirements',
      description: 'Questions about state licensing requirements for our fintech application that provides investment advisory services.',
      status: 'Under Review',
      submittedDate: '2024-01-04',
      lastUpdated: '2024-01-18',
      priority: 'Medium',
      assignedTo: 'David Kim',
      detailedQuestions: 'Which states require investment advisor licenses? What are the net capital requirements? Do we need to register with FINRA?',
      attachments: ['business_model.pdf'],
      response: null
    },
    {
      id: 'RQ-1704412800005',
      title: 'Import/Export Compliance Documentation',
      description: 'Need assistance with customs documentation and trade compliance for importing electronic components from Asia.',
      status: 'Completed',
      submittedDate: '2024-01-05',
      lastUpdated: '2024-01-12',
      priority: 'Low',
      assignedTo: 'Lisa Wang',
      detailedQuestions: 'What harmonized codes apply to our products? What origin documentation is required? Are there any trade restrictions we should be aware of?',
      attachments: ['product_catalog.pdf', 'supplier_info.xlsx'],
      response: 'For your electronic components, you will need to use the appropriate HTS codes...'
    }
  ]);

  const getStatusColor = (status) => {
    const map = {
      'New': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Under Review': 'bg-purple-100 text-purple-700',
      'Completed': 'bg-green-100 text-green-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const map = {
      'New': <Clock className="w-4 h-4" />,
      'In Progress': <AlertCircle className="w-4 h-4" />,
      'Under Review': <Eye className="w-4 h-4" />,
      'Completed': <CheckCircle className="w-4 h-4" />
    };
    return map[status] || <XCircle className="w-4 h-4" />;
  };

  const getPriorityColor = (priority) => {
    const map = {
      'High': 'text-red-600',
      'Medium': 'text-yellow-600',
      'Low': 'text-green-600'
    };
    return map[priority] || 'text-gray-600';
  };

  const filteredQueries = queries.filter(q => {
    const searchMatch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || q.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const sharedCardClass = "bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300";

  const Dashboard = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-800">Query Dashboard</h1>
        <p className="text-gray-500">Track and manage your regulatory queries efficiently.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Queries', icon: <FileText />, value: queries.length, color: 'blue' },
          { title: 'In Progress', icon: <Clock />, value: queries.filter(q => ['In Progress', 'Under Review'].includes(q.status)).length, color: 'yellow' },
          { title: 'Completed', icon: <CheckCircle />, value: queries.filter(q => q.status === 'Completed').length, color: 'green' },
          { title: 'High Priority', icon: <AlertCircle />, value: queries.filter(q => q.priority === 'High').length, color: 'red' },
        ].map((card, idx) => (
          <div key={idx} className={`${sharedCardClass} p-5 flex items-center`}>
            <div className={`p-3 bg-${card.color}-100 rounded-full`}>{card.icon}</div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${sharedCardClass} p-4 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => setCurrentView('new-query')}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> New Query
          </button>

          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {['all', 'New', 'In Progress', 'Under Review', 'Completed'].map(status => (
                  <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {filteredQueries.length === 0 ? (
            <div className="text-center p-6 text-gray-500">
              <p>No queries found. Adjust filters or search again.</p>
            </div>
          ) : (
            filteredQueries.map(query => (
              <div key={query.id} className="p-4 flex justify-between hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedQuery(query); setCurrentView('query-detail'); }}>
                <div>
                  <h3 className="font-medium text-lg text-gray-900">{query.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{query.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500 mt-2">
                    <span><Calendar className="inline w-3 h-3 mr-1" /> {query.submittedDate}</span>
                    <span>ID: {query.id}</span>
                    <span>Assigned: {query.assignedTo}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>{getStatusIcon(query.status)}<span className="ml-1">{query.status}</span></span>
                  <p className={`text-xs font-semibold ${getPriorityColor(query.priority)}`}>{query.priority}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'new-query' && <div className="text-center py-12">(New Query Form here)</div>}
      {currentView === 'query-detail' && selectedQuery && <div className="text-center py-12">(Query Detail here)</div>}
    </div>
  );
};

export default ClientDashboard;
