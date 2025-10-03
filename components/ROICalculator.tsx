"use client"

import { useState } from "react"

interface ROICalculatorProps {
  className?: string
}

export function ROICalculator({ className = "" }: ROICalculatorProps) {
  const [inputs, setInputs] = useState({
    projectsPerMonth: 5,
    hoursPerProject: 20,
    hourlyRate: 75,
    complianceErrors: 2,
    errorCost: 5000,
  })

  // Calculate savings
  const traditionalTime = inputs.projectsPerMonth * inputs.hoursPerProject
  const traditionalCost = traditionalTime * inputs.hourlyRate
  const complianceCost = inputs.complianceErrors * inputs.errorCost
  const totalTraditionalCost = traditionalCost + complianceCost

  // PromoPack efficiency gains
  const promoPackTime = traditionalTime * 0.6 // 40% time savings
  const promoPackCost = promoPackTime * inputs.hourlyRate
  const promoPackComplianceCost = complianceCost * 0.2 // 80% reduction in compliance errors
  const totalPromoPackCost = promoPackCost + promoPackComplianceCost

  const monthlySavings = totalTraditionalCost - totalPromoPackCost
  const annualSavings = monthlySavings * 12
  const roi = ((annualSavings / (totalTraditionalCost * 12)) * 100)

  const handleInputChange = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={`card-professional p-8 ${className}`}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">ROI Calculator</h2>
          <p className="text-gray-600">Calculate time and cost savings with PromoPack</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Current Process</h3>

          <div className="form-professional space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projects per Month
              </label>
              <input
                type="number"
                value={inputs.projectsPerMonth}
                onChange={(e) => handleInputChange('projectsPerMonth', Number(e.target.value))}
                className="w-full"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours per Project (Manual Work)
              </label>
              <input
                type="number"
                value={inputs.hoursPerProject}
                onChange={(e) => handleInputChange('hoursPerProject', Number(e.target.value))}
                className="w-full"
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Hourly Rate ($)
              </label>
              <input
                type="number"
                value={inputs.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', Number(e.target.value))}
                className="w-full"
                min="25"
                max="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance Errors per Month
              </label>
              <input
                type="number"
                value={inputs.complianceErrors}
                onChange={(e) => handleInputChange('complianceErrors', Number(e.target.value))}
                className="w-full"
                min="0"
                max="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Cost per Error ($)
              </label>
              <input
                type="number"
                value={inputs.errorCost}
                onChange={(e) => handleInputChange('errorCost', Number(e.target.value))}
                className="w-full"
                min="1000"
                max="50000"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Your Savings</h3>

          {/* Monthly Savings */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Monthly Savings</span>
              <span className="text-2xl font-bold text-green-600">${monthlySavings.toLocaleString()}</span>
            </div>
            <div className="text-xs text-green-700">
              {((monthlySavings / totalTraditionalCost) * 100).toFixed(1)}% of current costs
            </div>
          </div>

          {/* Annual Savings */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Annual Savings</span>
              <span className="text-2xl font-bold text-blue-600">${annualSavings.toLocaleString()}</span>
            </div>
            <div className="text-xs text-blue-700">
              Based on {inputs.projectsPerMonth * 12} projects per year
            </div>
          </div>

          {/* ROI */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-800">ROI</span>
              <span className="text-2xl font-bold text-purple-600">{roi.toFixed(0)}%</span>
            </div>
            <div className="text-xs text-purple-700">
              Return on investment in first year
            </div>
          </div>

          {/* Efficiency Gains */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Efficiency Improvements</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Time Savings:</span>
                <span className="font-medium text-green-600">
                  {((traditionalTime - promoPackTime) / traditionalTime * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Error Reduction:</span>
                <span className="font-medium text-green-600">
                  {((complianceCost - promoPackComplianceCost) / complianceCost * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Faster Time-to-Market:</span>
                <span className="font-medium text-green-600">60% faster</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-medical-blue/10 to-medical-green/10 rounded-lg border border-medical-blue/20">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-green rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why PromoPack Pays for Itself</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Based on your inputs, PromoPack saves you <strong>${annualSavings.toLocaleString()}</strong> annually
              through automated claim extraction, intelligent linking, and compliance validation.
              The system reduces manual work by 40%, eliminates costly compliance errors, and ensures
              faster regulatory approval cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}