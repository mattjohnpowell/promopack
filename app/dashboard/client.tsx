"use client"

import { useState } from "react"
import { createProject } from "./actions"
import toast from "react-hot-toast"

interface Project {
  id: string
  name: string
  createdAt: Date
}

interface DashboardClientProps {
  projects: Project[]
  userEmail: string
  isDemo?: boolean
}

export function DashboardClient({ projects, userEmail, isDemo = false }: DashboardClientProps) {
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateProject = async (formData: FormData) => {
    setIsCreating(true)
    try {
      await createProject(formData)
      toast.success("Project created successfully!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create project")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-lg text-gray-600">Welcome back, {userEmail}</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/pricing"
                className="btn-secondary"
              >
                Pricing
              </a>
              <a
                href="/account"
                className="btn-primary"
              >
                Account
              </a>
              {isDemo && (
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-lg px-4 py-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-purple-800">Demo Mode</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create New Project */}
        <div className="card-professional p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Create Project</h3>
          </div>
          <p className="text-gray-600 mb-4">Start a new promotional content project</p>
          <form action={handleCreateProject} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Project name"
              required
              className="form-professional w-full"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary w-full"
            >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>

        {/* Projects List */}
        <div className="card-professional p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
            <span className="text-sm text-gray-600">{projects.length} projects</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600">Create your first project to get started with promotional content management</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pharma-blue hover:bg-pharma-blue/5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-pharma-blue transition-colors">
                      {project.name}
                    </h3>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-pharma-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
