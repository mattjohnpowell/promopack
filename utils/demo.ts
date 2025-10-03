// Demo data for prospects to explore PromoPack functionality
export const demoData = {
  user: {
    email: "demo@pharmalabs.com",
    name: "Dr. Sarah Johnson",
    role: "Medical Affairs Director"
  },

  projects: [
    {
      id: "demo-project-1",
      name: "Q4 Oncology Campaign 2025",
      createdAt: new Date("2025-09-15"),
      documents: [
        {
          id: "demo-doc-1",
          name: "Oncology_Brochure_v3.pdf",
          type: "SOURCE" as const,
          url: "#demo",
          createdAt: new Date("2025-09-15")
        },
        {
          id: "demo-doc-2",
          name: "Clinical_Study_NCT0456789.pdf",
          type: "REFERENCE" as const,
          url: "#demo",
          createdAt: new Date("2025-09-16")
        },
        {
          id: "demo-doc-3",
          name: "FDA_Guidance_Oncology_2024.pdf",
          type: "REFERENCE" as const,
          url: "#demo",
          createdAt: new Date("2025-09-16")
        }
      ],
      claims: [
        {
          id: "demo-claim-1",
          text: "Treatment X demonstrated a 65% overall response rate in patients with advanced NSCLC",
          page: 12,
          links: [
            {
              id: "demo-link-1",
              claimId: "demo-claim-1",
              documentId: "demo-doc-2",
              document: {
                id: "demo-doc-2",
                name: "Clinical_Study_NCT0456789.pdf",
                type: "REFERENCE" as const,
                url: "#demo"
              }
            }
          ]
        },
        {
          id: "demo-claim-2",
          text: "Median progression-free survival was 8.2 months across all treatment arms",
          page: 15,
          links: [
            {
              id: "demo-link-2",
              claimId: "demo-claim-2",
              documentId: "demo-doc-2",
              document: {
                id: "demo-doc-2",
                name: "Clinical_Study_NCT0456789.pdf",
                type: "REFERENCE" as const,
                url: "#demo"
              }
            },
            {
              id: "demo-link-3",
              claimId: "demo-claim-2",
              documentId: "demo-doc-3",
              document: {
                id: "demo-doc-3",
                name: "FDA_Guidance_Oncology_2024.pdf",
                type: "REFERENCE" as const,
                url: "#demo"
              }
            }
          ]
        },
        {
          id: "demo-claim-3",
          text: "Adverse events were consistent with the known safety profile of Treatment X",
          page: 18,
          links: []
        },
        {
          id: "demo-claim-4",
          text: "Patient quality of life scores improved by 23% from baseline measurements",
          page: 22,
          links: [
            {
              id: "demo-link-4",
              claimId: "demo-claim-4",
              documentId: "demo-doc-2",
              document: {
                id: "demo-doc-2",
                name: "Clinical_Study_NCT0456789.pdf",
                type: "REFERENCE" as const,
                url: "#demo"
              }
            }
          ]
        }
      ]
    },
    {
      id: "demo-project-2",
      name: "Cardiovascular Risk Assessment Tool",
      createdAt: new Date("2025-08-20"),
      documents: [
        {
          id: "demo-doc-4",
          name: "CardioRisk_Assessment_Guide.pdf",
          type: "SOURCE" as const,
          url: "#demo",
          createdAt: new Date("2025-08-20")
        }
      ],
      claims: [
        {
          id: "demo-claim-5",
          text: "The risk assessment tool accurately predicts cardiovascular events with 89% sensitivity",
          page: 8,
          links: []
        }
      ]
    },
    {
      id: "demo-project-3",
      name: "Diabetes Management Protocol",
      createdAt: new Date("2025-07-10"),
      documents: [
        {
          id: "demo-doc-5",
          name: "Diabetes_Protocol_2025.pdf",
          type: "SOURCE" as const,
          url: "#demo",
          createdAt: new Date("2025-07-10")
        },
        {
          id: "demo-doc-6",
          name: "ADA_Guidelines_2024.pdf",
          type: "REFERENCE" as const,
          url: "#demo",
          createdAt: new Date("2025-07-11")
        }
      ],
      claims: []
    }
  ]
}

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('demo') === 'true'
}

export function getDemoProject(id: string) {
  return demoData.projects.find(p => p.id === id)
}