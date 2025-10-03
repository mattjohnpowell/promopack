"use client"

interface WorkflowStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'pending' | 'active' | 'completed'
}

interface WorkflowProgressProps {
  steps: WorkflowStep[]
}

export function WorkflowProgress({ steps }: WorkflowProgressProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Project Workflow</h2>
        <span className="text-sm text-gray-600">
          {steps.filter(s => s.status === 'completed').length} of {steps.length} steps completed
        </span>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
              step.status === 'completed'
                ? 'bg-green-500 border-green-500 text-white'
                : step.status === 'active'
                ? 'bg-pharma-blue border-pharma-blue text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              {step.status === 'completed' ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.icon
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {step.title}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>

            {/* Step Info */}
            <div className="ml-3 flex-1 min-w-0">
              <h3 className={`text-sm font-medium ${
                step.status === 'completed' ? 'text-green-700' :
                step.status === 'active' ? 'text-pharma-blue' :
                'text-gray-500'
              }`}>
                {step.title}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{step.description}</p>
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <svg className="w-5 h-5 text-gray-400 mx-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}