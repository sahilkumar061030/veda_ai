'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { formatDate, truncate } from '@/lib/utils';
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    assignments,
    stats,
    pagination,
    isLoading,
    fetchAssignments,
    fetchStats,
    deleteAssignment,
    regenerateAssignment,
  } = useAssignmentStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchStats();
    fetchAssignments();
  }, [fetchStats, fetchAssignments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssignments({ search, status: statusFilter });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, fetchAssignments]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
        toast.success('Assignment deleted');
        fetchStats();
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  const handleRegenerate = async (id: string) => {
    try {
      await regenerateAssignment(id);
      toast.success('Regeneration started');
    } catch {
      toast.error('Failed to regenerate');
    }
  };

  const statCards = [
    { label: 'Total Assignments', value: stats?.total || 0, icon: FileText, color: 'from-indigo-500 to-violet-500', change: '+12%' },
    { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', change: '+8%' },
    { label: 'Processing', value: stats?.processing || 0, icon: Clock, color: 'from-amber-500 to-orange-500', change: '' },
    { label: 'Avg Questions', value: stats?.avgQuestions || 0, icon: BarChart3, color: 'from-cyan-500 to-blue-500', change: '+5%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s an overview of your assessments
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button icon={<PlusCircle className="h-4 w-4" />} size="md">
            Create Assignment
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="p-5" hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'completed', 'failed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === s
                    ? 'gradient-primary text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Assignments Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Assignments</h2>
        </div>

        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No assignments yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first AI-powered question paper</p>
            <Link href="/dashboard/create">
              <Button icon={<PlusCircle className="h-4 w-4" />}>Create Assignment</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">Questions</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {assignments.map((assignment) => (
                  <motion.tr
                    key={assignment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {truncate(assignment.title, 30)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {assignment.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {assignment.grade}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {assignment.numberOfQuestions}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={assignment.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(assignment.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {assignment.status === 'completed' && (
                          <button
                            onClick={() => router.push(`/dashboard/assignment/${assignment._id}`)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-500 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRegenerate(assignment._id)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-500 transition-colors"
                          title="Regenerate"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => fetchAssignments({ page: i + 1, search, status: statusFilter })}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                    pagination.page === i + 1
                      ? 'gradient-primary text-white'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
