'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Plus, X, Send, AlertCircle, Calendar, User, Loader2 } from 'lucide-react';
import { Boxes } from '../Components/ui/background-boxes';

const NewQuery = () => {
  const [queryData, setQueryData] = useState({
    title: '',
    regulatoryArea: '',
    priority: 'medium',
    deadline: '',
    context: '',
    questions: [''],
    attachments: [],
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorityLevels = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' },
  ];


  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  });


  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const handleInputChange = (field, value) => {
    setQueryData((prev) => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    setQueryData((prev) => ({
      ...prev,
      questions: [...prev.questions, ''],
    }));
  };

  const updateQuestion = (index, value) => {
    setQueryData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? value : q)),
    }));
  };

  const removeQuestion = (index) => {
    if (queryData.questions.length > 1) {
      setQueryData((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileUpload = (files) => {
    const maxFileSize = 10 * 1024 * 1024; 
    const validFiles = [];
    const invalidFiles = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxFileSize) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          file,
        });
      }
    });

    if (invalidFiles.length > 0) {
      alert(`The following files exceed 10MB limit and were not added:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      setQueryData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles],
      }));
    }
  };

  const removeAttachment = (id) => {
    setQueryData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== id),
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const createFormData = () => {
    const formData = new FormData();
    

    formData.append('title', queryData.title);
    formData.append('regulatoryArea', queryData.regulatoryArea);
    formData.append('priority', queryData.priority);
    formData.append('deadline', queryData.deadline);
    formData.append('context', queryData.context);
    

    const validQuestions = queryData.questions.filter(q => q.trim() !== '');
    formData.append('questions', JSON.stringify(validQuestions));
    queryData.attachments.forEach((attachment) => {
      formData.append('attachments', attachment.file);
    });

    return formData;
  };

  const handleSubmit = async () => {
    const validQuestions = queryData.questions.filter(q => q.trim() !== '');
    
    if (!queryData.title.trim()) {
      alert('Please enter a query title.');
      return;
    }
    
    if (!queryData.regulatoryArea.trim()) {
      alert('Please enter a regulatory area.');
      return;
    }
    
    if (!queryData.context.trim()) {
      alert('Please provide context and background.');
      return;
    }
    
    if (validQuestions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = createFormData();
      
      const response = await api.post('api/client/new', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 201) {
        alert('Regulatory query submitted successfully!');
        setQueryData({
          title: '',
          regulatoryArea: '',
          priority: 'medium',
          deadline: '',
          context: '',
          questions: [''],
          attachments: [],
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.response) {
        const message = error.response.data?.message || 'Failed to submit query';
        alert(`Error: ${message}`);
      } else if (error.request) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black flex flex-col items-center justify-center">

      <div className="absolute inset-0 w-full h-full bg-black/70 z-20 [mask-image:radial-gradient(transparent_40%,black)] pointer-events-none" />


      <div className="absolute inset-0 z-0">
        <Boxes className="!z-0" />
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>


      <div className="hidden md:block absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="hidden md:block absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="hidden md:block absolute bottom-20 left-20 w-28 h-28 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" />


      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 z-30 mt-10 mb-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-teal-100 transition-all hover:shadow-2xl ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Submit New Regulatory Query</h1>
              <p className="text-slate-500 text-sm mt-1">Provide details for your regulatory consultation</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
              <User className="w-5 h-5 text-teal-600" />
              <span>Client Portal</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* Query Info */}
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 border-b border-teal-100 pb-3">Query Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Query Title *</label>
                  <input
                    type="text"
                    value={queryData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 md:py-3 text-sm md:text-base border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-900 placeholder-slate-400"
                    placeholder="Brief description of your query"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Regulatory Area *</label>
                  <input
                    type="text"
                    value={queryData.regulatoryArea}
                    onChange={(e) => handleInputChange('regulatoryArea', e.target.value)}
                    className="w-full px-4 py-2 md:py-3 text-sm md:text-base border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-900 placeholder-slate-400"
                    placeholder="e.g., Data Privacy, Financial Compliance"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority Level</label>
                  <select
                    value={queryData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-2 md:py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900"
                    disabled={isSubmitting}
                  >
                    {priorityLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1 text-teal-600" />
                    Required Deadline
                  </label>
                  <input
                    type="date"
                    value={queryData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full px-4 py-2 md:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-900"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 border-b border-teal-100 pb-3">Context & Background</h2>
              <textarea
                value={queryData.context}
                onChange={(e) => handleInputChange('context', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-900 placeholder-slate-400"
                placeholder="Describe the situation, relevant regulations, current understanding, and any specific circumstances..."
                disabled={isSubmitting}
              />
            </div>

           
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 border-b border-teal-100 pb-3">Detailed Questions</h2>
                <button
                  onClick={addQuestion}
                  disabled={isSubmitting}
                  className="flex items-center space-x-1 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>
              {queryData.questions.map((question, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Question {index + 1}</label>
                    <textarea
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-900 placeholder-slate-400"
                      placeholder="What specific question do you need answered?"
                      disabled={isSubmitting}
                    />
                  </div>
                  {queryData.questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(index)}
                      disabled={isSubmitting}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

           
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 border-b border-teal-100 pb-3">Document Attachments</h2>
              <div
                className={`border-2 border-dashed rounded-xl p-6 md:p-8 transition-all duration-200 ${
                  isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
                } ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">
                    Drag and drop files here, or{' '}
                    <label className="text-teal-600 hover:text-teal-700 cursor-pointer font-medium">
                      browse to upload
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                        disabled={isSubmitting}
                      />
                    </label>
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Supported formats: PDF, DOC, XLS, PPT, Images (Max 10MB per file)
                  </p>
                </div>
              </div>

              {queryData.attachments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-700">Uploaded Files:</h3>
                  {queryData.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAttachment(file.id)}
                        disabled={isSubmitting}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          
          <div className="border-t border-teal-100 bg-slate-50 px-6 md:px-8 py-6 rounded-b-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>All required fields (*) must be completed before submission</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !queryData.title.trim() || !queryData.regulatoryArea.trim() || !queryData.context.trim() || queryData.questions.filter(q => q.trim() !== '').length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Query</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewQuery;