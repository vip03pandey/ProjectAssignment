import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
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
      detailedQuestions: 'What are the consent requirements under GDPR? How do we handle data subject access requests? What are the differences between GDPR and CCPA requirements?',
      attachments: ['privacy_policy_draft.pdf', 'data_flow_diagram.png'],
      response: null
    },
    {
      id: 'RQ-1704326400004',
      title: 'Financial Services Licensing Requirements',
      description: 'Questions about state licensing requirements for our fintech application that provides investment advisory services.',
      status: 'New',
      priority: 'Medium',
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
    },
    {
      id: 'RQ-1704499200006',
      title: 'Healthcare Data Security Compliance',
      description: 'Need guidance on HIPAA compliance requirements for our healthcare application that processes patient data.',
      status: 'In Progress',
      submittedDate: '2024-01-06',
      lastUpdated: '2024-01-22',
      priority: 'High',
      assignedTo: 'Alex Thompson',
      detailedQuestions: 'What are the specific HIPAA requirements for our application? How do we ensure data encryption and access controls?',
      attachments: ['app_architecture.pdf', 'data_flow.pdf'],
      response: null
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
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
    switch (priority) {
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

  const handleQueryClick = (query) => {
    if (query.status === 'Completed' || query.status === 'Approved') {
      navigate(`/query/${query.id}`);
    } else if (query.status === 'New' || query.status === 'In Progress') {
      navigate(`/quote-review?queryId=${query.id}`);
    } else {
      navigate(`/query/${query.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Regulatory Query Dashboard</h1>
        <button className="ml-6 bg-gradient-to-r from-black to-gray-600 text-white px-5 py-2.5 rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md"
        onClick={() => navigate('/new-query')}>
          + New Query
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        {/* Total Queries */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-5 rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h2 className="text-sm font-medium text-gray-600">Total Queries</h2>
            </div>
            <span className="text-xs bg-blue-500 text-white px-2.5 py-1 rounded-full">+5.2%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">182</p>
        </div>

        {/* In Progress Queries */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-5 rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="text-sm font-medium text-gray-600">In Progress</h2>
            </div>
            <span className="text-xs bg-yellow-500 text-white px-2.5 py-1 rounded-full">+1.3%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">68</p>
        </div>

        {/* Completed Queries */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-5 rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h2 className="text-sm font-medium text-gray-600">Completed</h2>
            </div>
            <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full">+3.8%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">114</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">Recent Queries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queries.map((query) => (
            <div
              key={query.id}
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-700 group"
              onClick={() => handleQueryClick(query)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <div className="relative flex justify-between items-start">
                <h3 className="text-lg font-semibold text-white pr-4">{query.title}</h3>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(query.status)}`}>
                  {query.status}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-3 line-clamp-3 leading-relaxed">{query.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Assigned to: <span className="text-gray-200">{query.assignedTo}</span></p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Last Updated: <span className="text-gray-200">{query.lastUpdated}</span></p>
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
      </div>
    </div>
  );
};

export default Dashboard;