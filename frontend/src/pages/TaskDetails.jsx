
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  User,
  FolderKanban,
  Flag,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const TaskDetails = () => {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/tasks/${id}`);

      setTask(response.data.task);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load task"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const statusStyle = {
    Todo: "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Review: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
  };

  const priorityStyle = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  };

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
        Loading task details...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Task not found
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          This task may have been deleted or you may not have access.
        </p>
        <Link
          to="/tasks"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          <ArrowLeft size={16} />
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

   
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
         

          <h1 className="text-2xl font-bold text-gray-900">
            Task Details
          </h1>
        </div>

        <Link
          to="/tasks"
          className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 "
        >
      <ArrowLeft size={16} /> Back
        </Link>
      </div>

    
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
          
            <h2 className="text-xl font-bold text-gray-900">
              {task.title}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle[task.status] || "bg-gray-100 text-gray-700"}`}
            >
              {task.status}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${priorityStyle[task.priority] || "bg-gray-100 text-gray-700"}`}
            >
              {task.priority} Priority
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
              <FolderKanban size={19} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Project</p>
              <p className="mt-1 font-medium text-gray-800">
                {task.project?.projectName || "No project"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
              <User size={19} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Assigned To</p>
              <p className="mt-1 font-medium text-gray-800">
                {task.assignedTo?.name || "Unassigned"}
              </p>
              <p className="text-xs text-gray-500">
                {task.assignedTo?.email || ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-orange-50 p-2.5 text-orange-600">
              <Flag size={19} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Priority</p>
              <p className="mt-1 font-medium text-gray-800">
                {task.priority}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
              <CalendarDays size={19} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="mt-1 font-medium text-gray-800">
                {formatDate(task.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
              <Clock size={19} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Created Date</p>
              <p className="mt-1 font-medium text-gray-800">
                {formatDate(task.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
              <ClipboardList size={19} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Created By</p>
              <p className="mt-1 font-medium text-gray-800">
                {task.createdBy?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">
                {task.createdBy?.email || ""}
              </p>
            </div>
          </div>

        </div>
      </div>

    
      {task.project && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-semibold text-gray-900">
            Project Description:
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {task.project.description || "No project description available."}
          </p>
        
        </div>
      )}

    </div>
  );
};

export default TaskDetails;
