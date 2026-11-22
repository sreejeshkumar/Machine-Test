import { useEffect, useState } from "react";

import {
  FolderKanban,
  CheckSquare,
  CheckCircle,
  Clock,
  Activity,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);

  const [loading, setLoading] = useState(true);

 
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard");

      setStats(response.data.stats);
      setRecentProjects(response.data.recentProjects);
      setRecentTasks(response.data.recentTasks);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchDashboard();
  }, []);

  
  const cards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "bg-blue-50 text-blue-600",
      description: "Projects created",
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: CheckSquare,
      color: "bg-purple-50 text-purple-600",
      description: "Tasks assigned or created",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      description: "Successfully completed",
    },
    {
      title: "Pending",
      value: stats.pendingTasks,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      description: "Todo and review tasks",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: Activity,
      color: "bg-indigo-50 text-indigo-600",
      description: "Currently working",
    },
  ];

 
  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

 
  const getStatusStyle = (status) => {
    const styles = {
      Planning: "bg-blue-50 text-blue-700",
      "In Progress": "bg-indigo-50 text-indigo-700",
      Completed: "bg-green-50 text-green-700",
      "On Hold": "bg-orange-50 text-orange-700",
      Todo: "bg-gray-100 text-gray-700",
      Review: "bg-yellow-50 text-yellow-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

    
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            to="/projects"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Projects
          </Link>

          <Link
            to="/tasks"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            View Tasks
          </Link>
        </div>
      </div>

      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-gray-900">
                {card.value}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                {card.description}
              </p>
            </div>
          );
        })}

      </div>

   
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Projects
            </h2>
          </div>

          <Link
            to="/projects"
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FolderKanban
              size={35}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 font-medium text-gray-700">
              No projects yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Due Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {project.projectName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {project.description || "No description"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {project.priority}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(project.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

   
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Tasks
            </h2>
          </div>

          <Link
            to="/tasks"
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CheckSquare
              size={35}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 font-medium text-gray-700">
              No tasks yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Your recent tasks will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Due Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {task.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {task.priority} priority
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.project?.projectName || "No project"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.assignedTo?.name || "Unassigned"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(task.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;