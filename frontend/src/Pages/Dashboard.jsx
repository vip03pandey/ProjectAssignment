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
import { SparklesCore } from "../Components/ui/sparkles";

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
      navigate(`/assigned-to/${query._id || "unknown"}`);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-white/60 backdrop-blur-sm rounded-2xl w-1/3 shadow-sm"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20">
                  <div className="h-5 bg-slate-200 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20">
              <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-slate-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-white/20 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Something went wrong</h2>
            <p className="text-xl text-slate-600 mb-8">{error}</p>
            <button
              onClick={fetchQueries}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredQueries = queries.filter(query => {
    if (statusFilter === "all") return true;
    return query.status?.toLowerCase() === statusFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 font-sans">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20">
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.name || 'Client'}! 
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Here's what's happening with your queries today.
            </p>
          </div>
          <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          onClick={() => navigate('/new-query')}>
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-medium font-medium text-white backdrop-blur-3xl">
          <Plus size={24} />
            New Query
          </span>
        </button>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-inner">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">{stats.total}</div>
            <p className="text-slate-600 font-semibold text-sm">All Queries</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl shadow-inner">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New</span>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">{stats.new}</div>
            <p className="text-slate-600 font-semibold text-sm">Pending Review</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-xl shadow-inner">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active</span>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">{stats.inProgress}</div>
            <p className="text-slate-600 font-semibold text-sm">In Progress</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl shadow-inner">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Done</span>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">{stats.completed}</div>
            <p className="text-slate-600 font-semibold text-sm">Completed</p>
          </div>
        </div>

        {/* Queries Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-slate-800">Recent Queries</h3>
              <button className="flex items-center gap-3 text-slate-600 hover:text-slate-800 font-semibold transition-colors rounded-2xl px-6 py-3 hover:bg-white/60 backdrop-blur-sm border border-white/30">
                <Download size={20} />
                Export Data
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100/50 to-blue-100/50 border-b border-slate-200/50">
                  <th className="text-left p-8 text-sm font-black text-slate-700 uppercase tracking-wider">
                    Query Title
                  </th>
                  <th className="text-left p-8 text-sm font-black text-slate-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left p-8 text-sm font-black text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-8 text-sm font-black text-slate-700 uppercase tracking-wider">
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {queries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="p-8 bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl shadow-inner">
                          <TrendingUp className="w-12 h-12 text-slate-400" />
                        </div>
                        <p className="text-2xl font-bold text-slate-600">No queries found</p>
                        <p className="text-lg text-slate-500 font-medium">Create your first query to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  queries.map((q) => (
                    <tr
                      key={q._id}
                      className="hover:bg-white/60 cursor-pointer transition-all duration-200 group backdrop-blur-sm"
                      onClick={() => handleQueryClick(q)}
                    >
                      <td className="p-8">
                        <div className="font-bold text-slate-800 text-xl group-hover:text-blue-600 transition-colors">
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
                          className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-sm ${getStatusBadge(q.status)}`}
                        >
                          {q.status || 'New'}
                        </span>
                      </td>
                      <td className="p-8">
                        <span className="text-slate-600 font-semibold text-xl">
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