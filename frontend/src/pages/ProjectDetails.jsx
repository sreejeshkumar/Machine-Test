import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  FolderKanban,
  ListTodo,
  Clock,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

     
      const projectResponse = await api.get(`/projects/${id}`);

     
      const taskResponse = await api.get("/tasks", {
        params: {
          page: 1,
          limit: 100,
        },
      });

      setProject(
        projectResponse.data.project ||
          projectResponse.data.data ||
          projectResponse.data,
      );

      const allTasks = taskResponse.data.tasks || [];

      setTasks(
        allTasks.filter((task) => {
          const projectId = task.project?._id || task.project;

          return String(projectId) === String(id);
        }),
      );
    } catch (error) {
      console.error("Project Details Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load project details",
      );

      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const priorityStyle = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-green-50 text-green-600",
  };

  const statusStyle = {
    Planning: "bg-blue-50 text-blue-600",
    "In Progress": "bg-indigo-50 text-indigo-600",
    Completed: "bg-green-50 text-green-600",
    "On Hold": "bg-gray-100 text-gray-600",
    Todo: "bg-gray-100 text-gray-600",
    Review: "bg-purple-50 text-purple-600",
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      </div>
    );
  }

  if (!project) return null;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {project.projectName}
            </h1>
          </div>

          <button
            onClick={() => navigate("/projects")}
            className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 "
          >
            <ArrowLeft size={17} />
            Back
          </button>
        </div>
      </div>

     
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <FolderKanban size={23} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Project Overview
          </h2>
        </div>

        <p className="mb-6 text-sm leading-6 text-gray-600">
          {project.description || "No description available."}
        </p>

        <div className="grid grid-cols-1 gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-2 text-xs text-gray-500">Priority</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                priorityStyle[project.priority]
              }`}
            >
              {project.priority}
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs text-gray-500">Status</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusStyle[project.status]
              }`}
            >
              {project.status}
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs text-gray-500">Start Date</p>
            <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar size={16} className="text-gray-400" />
              {formatDate(project.startDate)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs text-gray-500">Due Date</p>
            <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock size={16} className="text-gray-400" />
              {formatDate(project.dueDate)}
            </p>
          </div>
        </div>
      </div>

     
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {tasks.length}
          </h3>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed Tasks</p>
          <h3 className="mt-2 text-2xl font-bold text-green-600">
            {completedTasks}
          </h3>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Remaining Tasks</p>
          <h3 className="mt-2 text-2xl font-bold text-blue-600">
            {tasks.length - completedTasks}
          </h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="font-semibold text-gray-800">Project Tasks</h2>
            <p className="mt-1 text-xs text-gray-500">
              All tasks associated with this project
            </p>
          </div>

          <ListTodo size={21} className="text-gray-400" />
        </div>

        {tasks.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center">
            <ListTodo size={36} className="text-gray-300" />

            <p className="mt-3 font-medium text-gray-700">No tasks available</p>

            <p className="mt-1 text-sm text-gray-500">
              Tasks created for this project will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Due Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {task.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      <span className="flex items-center gap-2">
                        <User size={15} />
                        {task.assignedTo?.name || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyle[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
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

export default ProjectDetails;
