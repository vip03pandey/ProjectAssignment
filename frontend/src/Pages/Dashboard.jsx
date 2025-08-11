import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Filter,
  Download,
  Calendar,
  ArrowUpRight,
  Plus,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
  });

  const api = axios.create({
    baseURL:
      `${import.meta.env.VITE_BACKEND_URL}/api` || "http://localhost:5000/api",
  });

  api.interceptors.request.use((config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/client/my-queries");
      const data = res.data || [];
      
      setQueries(data);
      calculateStats(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      new: data.filter(
        (q) =>
          ["pending", "new"].includes(q.status?.toLowerCase())
      ).length,
      inProgress: data.filter(
        (q) => q.status?.toLowerCase() === "in-progress"
      ).length,
      completed: data.filter(
        (q) => ["completed", "approved"].includes(q.status?.toLowerCase())
      ).length,
    });
  };

  const handleQueryClick = (query) => {
    const status = query.status?.toLowerCase();
    if (status === "pending" || status === "new" ) {
      navigate(`/quote-review?queryId=${query._id}`);
    } else if (status === "in-progress" || status === "approved") {
      navigate(`/assigned-to/${query.assignedTo || "unknown"}`);
    } else if (status === "completed" || status === "submitted") {
      navigate(`/deliverables/${query._id}`);
    } else {
      navigate(`/query/${query._id}`);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-700 border-0";
      case "in-progress":
        return "bg-indigo-100 text-indigo-700 border-0";
      case "pending":
      case "new":
        return "bg-amber-100 text-amber-700 border-0";
      default:
        return "bg-gray-100 text-gray-700 border-0";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 font-black";
      case "medium":
        return "text-amber-600 font-black";
      case "low":
        return "text-green-600 font-black";
      default:
        return "text-gray-600 font-black";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-gray-200 rounded-2xl w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-8 bg-gray-200 rounded-2xl w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-3 tracking-tight">
              Overview
            </h1>
            <p className="text-2xl text-gray-600 font-semibold">
              Welcome back, {user?.name || 'User'}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700 hover:shadow-sm">
              <Filter size={20} />
              Filter
            </button>
            <button className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700 hover:shadow-sm">
              <Calendar size={20} />
              Monthly
            </button>
            <button className="flex items-center gap-3 bg-indigo-600 text-white rounded-2xl px-6 py-4 hover:bg-indigo-700 transition-all duration-200 font-semibold hover:shadow-lg"
            onClick={() => navigate("/new-query")}
            >
              <Plus size={20} />
              Add Query
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-indigo-50 rounded-2xl">
                <TrendingUp className="w-7 h-7 text-indigo-600" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 font-medium text-lg">Total Queries</p>
              <h2 className="text-4xl font-black text-gray-900">{stats.total}</h2>
              <p className="text-sm text-green-600 font-semibold">+12% from last month</p>
            </div>
          </div>


          <div className="bg-white p-8 rounded-3xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-amber-50 rounded-2xl">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 font-medium text-lg">New Queries</p>
              <h2 className="text-4xl font-black text-gray-900">{stats.new}</h2>
              <p className="text-sm text-amber-600 font-semibold">Pending review</p>
            </div>
          </div>


          <div className="bg-white p-8 rounded-3xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 font-medium text-lg">In Progress</p>
              <h2 className="text-4xl font-black text-gray-900">{stats.inProgress}</h2>
              <p className="text-sm text-blue-600 font-semibold">Being processed</p>
            </div>
          </div>


          <div className="bg-white p-8 rounded-3xl shadow-sm border-0 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-green-50 rounded-2xl">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 font-medium text-lg">Completed</p>
              <h2 className="text-4xl font-black text-gray-900">{stats.completed}</h2>
              <p className="text-sm text-green-600 font-semibold">Successfully resolved</p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-gray-900">Recent Queries</h3>
              <button className="flex items-center gap-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors rounded-2xl px-4 py-2 hover:bg-gray-50">
                <Download size={20} />
                Export Data
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-8 text-sm font-black text-gray-700 uppercase tracking-wider">
                    Query Title
                  </th>
                  <th className="text-left p-8 text-sm font-black text-gray-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left p-8 text-sm font-black text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-8 text-sm font-black text-gray-700 uppercase tracking-wider">
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-6 bg-gray-50 rounded-3xl">
                          <TrendingUp className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-xl font-bold text-gray-600">No queries found</p>
                        <p className="text-lg text-gray-500 font-medium">Create your first query to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  queries.map((q) => (
                    <tr
                      key={q._id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                      onClick={() => handleQueryClick(q)}
                    >
                      <td className="p-8">
                        <div className="font-bold text-gray-900 text-xl group-hover:text-indigo-600 transition-colors">
                          {q.title || 'Untitled Query'}
                        </div>
                      </td>
                      <td className="p-8">
                        <span className={`font-bold text-xl ${getPriorityColor(q.priority)}`}>
                          {q.priority || 'Normal'}
                        </span>
                      </td>
                      <td className="p-8">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold ${getStatusBadge(q.status)}`}
                        >
                          {q.status || 'New'}
                        </span>
                      </td>
                      <td className="p-8">
                        <span className="text-gray-600 font-semibold text-xl">
                          {new Date(q.createdAt).toLocaleDateString("en-GB", {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;