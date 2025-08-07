import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock, CheckCircle, FileText, Download, Eye, DollarSign, Star } from 'lucide-react';

const QueryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the specific query
  const query = {
    id: id,
    title: 'FDA Medical Device Classification Requirements',
    description: 'Need guidance on Class II medical device registration process and 510(k) submission requirements for our new diagnostic equipment.',
    status: 'Completed',
    submittedDate: '2024-01-01',
    lastUpdated: '2024-01-15',
    priority: 'High',
    clientName: 'MedTech Solutions Inc.',
    assignedTo: 'Sarah Johnson',
    providerInfo: {
      name: 'Sarah Johnson',
      company: 'Regulatory Solutions Inc.',
      rating: 4.8,
      experience: '15+ years',
      specialization: 'Medical Device Compliance'
    },
    detailedQuestions: 'What are the specific requirements for 510(k) submission? What documentation is needed for predicate device comparison? What are the typical review timelines?',
    attachments: ['device_specs.pdf', 'technical_drawings.pdf'],
    quote: {
      items: [
        { country: 'United States', hours: 10, rate: 85, total: 850 },
        { country: 'EU', hours: 8, rate: 95, total: 760 }
      ],
      total: 1610,
      status: 'Approved',
      submittedDate: '2024-01-05',
      approvedDate: '2024-01-08'
    },
    deliverables: [
      {
        id: 'DEL-001',
        name: 'FDA_510k_Submission_Guide.pdf',
        uploadedBy: 'Sarah Johnson',
        uploadedDate: '2024-01-12',
        size: '2.4 MB',
        description: 'Comprehensive guide for 510(k) submission process'
      },
      {
        id: 'DEL-002',
        name: 'Medical_Device_Classification_Analysis.docx',
        uploadedBy: 'Sarah Johnson',
        uploadedDate: '2024-01-13',
        size: '1.8 MB',
        description: 'Detailed analysis of device classification requirements'
      },
      {
        id: 'DEL-003',
        name: 'Documentation_Checklist.xlsx',
        uploadedBy: 'Sarah Johnson',
        uploadedDate: '2024-01-14',
        size: '0.5 MB',
        description: 'Complete checklist of required documentation'
      }
    ],
    response: 'Based on your device specifications, you will need to submit a 510(k) premarket notification. The process involves several key steps including predicate device comparison, clinical data requirements, and quality system compliance. I have prepared comprehensive documentation covering all aspects of the submission process.',
    completionDate: '2024-01-15'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-400/20 text-blue-300 border-blue-400/50';
      case 'In Progress': return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50';
      case 'Quoted': return 'bg-pink-400/20 text-pink-300 border-pink-400/50';
      case 'Approved': return 'bg-teal-400/20 text-teal-300 border-teal-400/50';
      case 'Completed': return 'bg-violet-400/20 text-violet-300 border-violet-400/50';
      default: return 'bg-gray-400/20 text-gray-300 border-gray-400/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <Eye className="w-4 h-4" />;
      case 'Quoted': return <DollarSign className="w-4 h-4" />;
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-pink-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-teal-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-black/90 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-4xl font-extrabold text-yellow-500 tracking-tight">
                {query.title}
              </h1>
              <p className="text-green-400 mt-2 text-sm">Query ID: {query.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(query.status)} backdrop-blur-sm transition-all duration-300 hover:shadow-glow`}>
                {getStatusIcon(query.status)}
                <span className="ml-2">{query.status}</span>
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(query.priority)} bg-white px-4 py-2 rounded-full border border-gray-300/50 backdrop-blur-sm`}>
                {query.priority} Priority
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Query Details */}
            <div className="bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-gray-300/50 transition-all duration-300 hover:shadow-glow">
              <div className="p-8 border-b border-gray-300">
                <h2 className="text-2xl font-semibold text-black">Query Details</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-bold text-gray-600">Client:</span>
                    <p className="text-gray-800">{query.clientName}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-600">Submitted:</span>
                    <p className="text-gray-800">{new Date(query.submittedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-600">Last Updated:</span>
                    <p className="text-gray-800">{new Date(query.lastUpdated).toLocaleDateString()}</p>
                  </div>
                  {query.completionDate && (
                    <div>
                      <span className="font-bold text-gray-600">Completed:</span>
                      <p className="text-gray-800">{new Date(query.completionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{query.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Detailed Questions</h3>
                  <p className="text-gray-700 leading-relaxed">{query.detailedQuestions}</p>
                </div>

                {query.attachments && query.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Original Attachments</h3>
                    <div className="space-y-3">
                      {query.attachments.map((attachment, index) => (
                        <div key={index} className="group flex items-center text-sm text-violet-600 hover:text-violet-500 transition-colors duration-300">
                          <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                          <span className="cursor-pointer">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {query.response && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Response</h3>
                    <div className="bg-gray-100/50 p-5 rounded-lg border border-gray-300/50 backdrop-blur-sm">
                      <p className="text-gray-700 leading-relaxed">{query.response}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Work / Deliverables */}
            {query.status === 'Completed' && query.deliverables && query.deliverables.length > 0 && (
              <div className="bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-gray-300/50 transition-all duration-300 hover:shadow-glow">
                <div className="p-8 border-b border-gray-300">
                  <h2 className="text-2xl font-semibold text-black">Completed Work</h2>
                  <p className="text-gray-600 mt-2">Deliverables and completed work for this query</p>
                </div>
                <div className="p-8 space-y-4">
                  {query.deliverables.map((deliverable) => (
                    <div key={deliverable.id} className="group bg-white border border-gray-300/50 rounded-lg p-5 hover:bg-white transition-all duration-300 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileText className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
                          <div>
                            <h3 className="font-medium text-gray-800">{deliverable.name}</h3>
                            <p className="text-sm text-gray-600">{deliverable.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Uploaded by: {deliverable.uploadedBy}</span>
                              <span>{new Date(deliverable.uploadedDate).toLocaleDateString()}</span>
                              <span>{deliverable.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button className="group inline-flex items-center px-4 py-2 border border-gray-400 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-white hover:text-violet-600 transition-all duration-300 backdrop-blur-sm">
                            <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            View
                          </button>
                          <button className="group inline-flex items-center px-4 py-2 border border-violet-400/50 rounded-lg text-sm font-medium text-violet-600 bg-violet-100/20 hover:bg-violet-100/30 hover:text-violet-500 transition-all duration-300 backdrop-blur-sm">
                            <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Assignment Information */}
            <div className="bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-gray-300/50 transition-all duration-300 hover:shadow-glow">
              <div className="p-6 border-b border-gray-300">
                <h2 className="text-lg font-semibold text-black">Assignment</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center ring-2 ring-violet-400/50">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{query.providerInfo.name}</h3>
                    <p className="text-sm text-gray-600">{query.providerInfo.company}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experience:</span>
                    <span className="text-sm font-medium text-gray-800">{query.providerInfo.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-800">{query.providerInfo.rating}/5.0</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Specialization:</span>
                    <span className="text-sm font-medium text-gray-800">{query.providerInfo.specialization}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Information */}
            {query.quote && (
              <div className="bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-gray-300/50 transition-all duration-300 hover:shadow-glow">
                <div className="p-6 border-b border-gray-300">
                  <h2 className="text-lg font-semibold text-black">Quote Details</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {query.quote.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-300">
                        <div>
                          <span className="font-medium text-gray-800">{item.country}</span>
                          <div className="text-sm text-gray-600">
                            {item.hours} hours × ${item.rate}/hr
                          </div>
                        </div>
                        <span className="font-semibold text-black">${item.total}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-3 font-bold text-lg border-t border-gray-300">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-black">${query.quote.total}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(query.quote.status)} backdrop-blur-sm`}>
                        {query.quote.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="text-gray-800">{new Date(query.quote.submittedDate).toLocaleDateString()}</span>
                    </div>
                    {query.quote.approvedDate && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Approved:</span>
                        <span className="text-gray-800">{new Date(query.quote.approvedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDetail;