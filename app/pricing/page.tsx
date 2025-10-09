import { Metadata } from 'next'
import { PricingComponent } from "@/components/Pricing"

export const metadata: Metadata = {
  title: 'PMCPA Reference Pack Software Pricing | Save 12hrs Per Pack',
  description: 'Automate PMCPA reference pack creation from £99/month. Save 10-15 hours per pack with AI claim extraction, compliance checking & one-click PDF generation. 14-day free trial, no credit card required.',
  keywords: [
    'PMCPA reference pack software',
    'PMCPA software pricing',
    'pharmaceutical compliance tool',
    'medical affairs automation',
    'reference pack creation tool UK',
    'PMCPA submission software',
    'pharmaceutical promotional compliance',
    'ABPI code compliance software',
    'medical affairs software pricing',
    'pharmaceutical document automation',
  ],
  openGraph: {
    title: 'PromoPack Pricing | PMCPA Reference Pack Software from £99/month',
    description: 'Save 12 hours per PMCPA reference pack. Pricing starts at £99/month. AI-powered claim extraction, compliance checking, and automated pack generation. Start your 14-day free trial today.',
    type: 'website',
  },
  alternates: {
    canonical: '/pricing',
  },
}

export default function PricingPage() {
  return <PricingComponent />
}