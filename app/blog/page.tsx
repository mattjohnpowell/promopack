import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog - Pharmaceutical Promotional Content Insights',
  description: 'Expert insights on FDA compliance, medical affairs best practices, MLR workflows, and pharmaceutical promotional content creation.',
  path: '/blog',
})

const blogPosts = [
  {
    slug: 'fda-compliance-promotional-materials',
    title: 'FDA Compliance Checklist for Pharmaceutical Promotional Materials',
    excerpt: 'A comprehensive guide to ensuring your pharmaceutical promotional content meets FDA OPDP regulations and industry standards.',
    date: '2025-10-01',
    category: 'FDA Compliance',
    readTime: '8 min read',
  },
  {
    slug: 'mlr-workflow-optimization',
    title: 'How to Optimize Your MLR Workflow in 2025',
    excerpt: 'Learn how medical affairs teams are reducing review cycles from weeks to days with modern MLR workflow automation.',
    date: '2025-09-28',
    category: 'Medical Affairs',
    readTime: '6 min read',
  },
  {
    slug: 'claim-extraction-automation',
    title: 'Automating Claim Extraction: A Game-Changer for Medical Writers',
    excerpt: 'Discover how AI-powered claim extraction is transforming the way medical writing teams create compliant promotional materials.',
    date: '2025-09-25',
    category: 'Technology',
    readTime: '7 min read',
  },
  {
    slug: 'reference-linking-best-practices',
    title: 'Reference Linking Best Practices for Pharma Promotional Content',
    excerpt: 'Essential guidelines for proper citation and reference management in pharmaceutical promotional materials.',
    date: '2025-09-22',
    category: 'Best Practices',
    readTime: '5 min read',
  },
  {
    slug: 'medical-affairs-collaboration',
    title: 'Cross-Functional Collaboration in Medical Affairs Teams',
    excerpt: 'How to streamline collaboration between medical, legal, and regulatory teams for faster content approvals.',
    date: '2025-09-18',
    category: 'Medical Affairs',
    readTime: '6 min read',
  },
  {
    slug: 'pharma-marketing-compliance-2025',
    title: 'Pharmaceutical Marketing Compliance Trends in 2025',
    excerpt: 'Stay ahead of evolving FDA regulations and industry standards for pharmaceutical promotional content.',
    date: '2025-09-15',
    category: 'FDA Compliance',
    readTime: '9 min read',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-pharma-slate mb-6">
            Pharmaceutical Promotional Content Insights
          </h1>
          <p className="text-xl text-pharma-gray max-w-3xl mx-auto">
            Expert guidance on FDA compliance, MLR workflows, medical affairs best practices,
            and the latest trends in pharmaceutical promotional content creation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-pharma-gray-light rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-pharma-blue bg-pharma-blue/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-pharma-gray">{post.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-pharma-slate mb-3 hover:text-pharma-blue transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-pharma-gray mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <time className="text-sm text-pharma-gray-light" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-pharma-blue font-semibold hover:text-pharma-blue-dark transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-pharma-gray-light/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">
              Stay Updated on FDA Compliance & Medical Affairs
            </h2>
            <p className="text-pharma-gray mb-6 max-w-2xl mx-auto">
              Subscribe to receive expert insights on pharmaceutical promotional content,
              MLR workflow optimization, and regulatory compliance updates.
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-pharma-gray-light focus:outline-none focus:ring-2 focus:ring-pharma-blue"
                required
              />
              <button
                type="submit"
                className="btn-primary px-6 py-3 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
