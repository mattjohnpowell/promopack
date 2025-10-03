"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target?: string // CSS selector for highlighting
  action?: string // What action to perform
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PromoPack! 🎉',
    description: 'Your professional tool for creating compliant pharmaceutical promotional content. Let\'s get you started with a quick tour.',
  },
  {
    id: 'create-project',
    title: 'Create Your First Project',
    description: 'Start by creating a project for your promotional campaign. Click the "Create New Project" button to begin.',
    target: '[data-onboarding="create-project"]',
    action: 'highlight',
  },
  {
    id: 'upload-documents',
    title: 'Upload Your Documents',
    description: 'Add your source promotional materials and reference documents. We support PDF files with drag-and-drop upload.',
    target: '[data-onboarding="upload-section"]',
    action: 'highlight',
  },
  {
    id: 'extract-claims',
    title: 'Extract Medical Claims',
    description: 'Our AI will automatically extract medical claims from your source documents for verification.',
    target: '[data-onboarding="extract-claims"]',
    action: 'highlight',
  },
  {
    id: 'link-references',
    title: 'Link to References',
    description: 'Connect each claim to supporting reference documents using our intuitive drag-and-drop interface.',
    target: '[data-onboarding="claim-linking"]',
    action: 'highlight',
  },
  {
    id: 'generate-pack',
    title: 'Generate Your Pack',
    description: 'Create a comprehensive PDF pack with all verified claims and their references, ready for regulatory review.',
    target: '[data-onboarding="generate-pack"]',
    action: 'highlight',
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'You now know the basics of PromoPack. Create your first project and start building compliant promotional content.',
  },
]

interface OnboardingContextType {
  currentStep: number
  isActive: boolean
  steps: OnboardingStep[]
  nextStep: () => void
  prevStep: () => void
  skipOnboarding: () => void
  completeOnboarding: () => void
  startOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompleted = localStorage.getItem('promopack-onboarding-completed')
    const hasStarted = localStorage.getItem('promopack-onboarding-started')

    if (!hasCompleted && !hasStarted) {
      // First time user - start onboarding
      setIsActive(true)
      localStorage.setItem('promopack-onboarding-started', 'true')
    }
  }, [])

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    setIsActive(false)
    localStorage.setItem('promopack-onboarding-completed', 'true')
  }

  const completeOnboarding = () => {
    setIsActive(false)
    localStorage.setItem('promopack-onboarding-completed', 'true')
  }

  const startOnboarding = () => {
    setIsActive(true)
    setCurrentStep(0)
    localStorage.removeItem('promopack-onboarding-completed')
    localStorage.setItem('promopack-onboarding-started', 'true')
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        isActive,
        steps: onboardingSteps,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
        startOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}