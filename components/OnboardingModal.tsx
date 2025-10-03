"use client"

import { useOnboarding } from './OnboardingProvider'
import { useEffect, useState } from 'react'

export function OnboardingModal() {
  const { currentStep, isActive, steps, nextStep, prevStep, skipOnboarding } = useOnboarding()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(isActive)
  }, [isActive])

  if (!isVisible) return null

  const step = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 animate-fade-in-up">
          {/* Progress bar */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-pharma-gray">
                Step {currentStep + 1} of {steps.length}
              </span>
              <button
                onClick={skipOnboarding}
                className="text-pharma-gray-light hover:text-pharma-gray transition-colors text-sm"
              >
                Skip tour
              </button>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-pharma-blue"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pharma-blue to-pharma-blue-dark rounded-2xl flex items-center justify-center mb-6">
                {isFirstStep && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )}
                {currentStep === 1 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                {currentStep === 2 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
                {currentStep === 3 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
                {currentStep === 4 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
                {currentStep === 5 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {isLastStep && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={isFirstStep}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFirstStep
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-pharma-gray hover:text-pharma-blue hover:bg-pharma-blue/5'
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {!isLastStep && (
                  <button
                    onClick={skipOnboarding}
                    className="px-4 py-2 text-pharma-gray hover:text-pharma-gray-dark transition-colors font-medium"
                  >
                    Skip
                  </button>
                )}

                <button
                  onClick={nextStep}
                  className="btn-primary"
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight overlay for target elements */}
      {step.target && (
        <OnboardingHighlight selector={step.target} />
      )}
    </>
  )
}

function OnboardingHighlight({ selector }: { selector: string }) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const updateTarget = () => {
      const element = document.querySelector(selector)
      if (element) {
        const rect = element.getBoundingClientRect()
        setTargetRect(rect)
      }
    }

    updateTarget()
    window.addEventListener('resize', updateTarget)
    window.addEventListener('scroll', updateTarget)

    return () => {
      window.removeEventListener('resize', updateTarget)
      window.removeEventListener('scroll', updateTarget)
    }
  }, [selector])

  if (!targetRect) return null

  return (
    <div
      className="fixed z-40 pointer-events-none animate-pulse"
      style={{
        top: targetRect.top - 8,
        left: targetRect.left - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
        background: 'rgba(30, 64, 175, 0.1)',
        border: '2px solid var(--pharma-blue)',
        borderRadius: '12px',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
      }}
    />
  )
}