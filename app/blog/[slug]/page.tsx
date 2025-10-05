import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { generateBreadcrumbSchema } from '@/lib/structured-data'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  readTime: string
  author: string
  keywords: string[]
}

const blogPosts: Record<string, BlogPost> = {
  'fda-compliance-promotional-materials': {
    slug: 'fda-compliance-promotional-materials',
    title: 'FDA Compliance Checklist for Pharmaceutical Promotional Materials',
    excerpt: 'A comprehensive guide to ensuring your pharmaceutical promotional content meets FDA OPDP regulations and industry standards.',
    content: `
      <h2>Understanding FDA OPDP Regulations</h2>
      <p>The FDA's Office of Prescription Drug Promotion (OPDP) oversees pharmaceutical promotional materials to ensure they are truthful, balanced, and adequately substantiated. This guide covers essential compliance requirements.</p>

      <h2>Key FDA Compliance Requirements</h2>
      <ul>
        <li>Fair balance between benefits and risks</li>
        <li>Adequate substantiation for all claims</li>
        <li>Proper reference citation</li>
        <li>Clear indication and usage information</li>
        <li>Complete prescribing information (PI) or brief summary</li>
      </ul>

      <h2>Common Compliance Pitfalls</h2>
      <p>Medical affairs teams often encounter challenges with claim substantiation, overstating efficacy, minimizing risks, and inadequate reference documentation. Understanding these pitfalls helps ensure compliant promotional materials.</p>

      <h2>Best Practices for Compliance</h2>
      <p>Implement automated compliance checking, maintain comprehensive audit trails, establish clear MLR workflows, and regularly train your medical affairs team on current FDA regulations.</p>
    `,
    date: '2025-10-01',
    category: 'FDA Compliance',
    readTime: '8 min read',
    author: 'Medical Affairs Team',
    keywords: ['FDA compliance', 'OPDP', 'pharmaceutical promotional materials', 'regulatory compliance', 'claim substantiation'],
  },
  'mlr-workflow-optimization': {
    slug: 'mlr-workflow-optimization',
    title: 'How to Optimize Your MLR Workflow in 2025',
    excerpt: 'Learn how medical affairs teams are reducing review cycles from weeks to days with modern MLR workflow automation.',
    content: `
      <h2>The Medical Legal Regulatory (MLR) Review Challenge</h2>
      <p>Traditional MLR workflows often take 3-4 weeks, creating bottlenecks in pharmaceutical promotional content creation. Modern automation can reduce this to 3-5 days.</p>

      <h2>Key Workflow Optimization Strategies</h2>
      <ul>
        <li>Automated claim extraction and validation</li>
        <li>Real-time collaboration between medical, legal, and regulatory teams</li>
        <li>Integrated reference management and linking</li>
        <li>Automated compliance pre-checks</li>
        <li>Complete audit trail documentation</li>
      </ul>

      <h2>Technology Solutions</h2>
      <p>AI-powered platforms can automate routine MLR tasks, allowing medical affairs teams to focus on strategic review and scientific accuracy rather than administrative overhead.</p>

      <h2>Measuring MLR Efficiency</h2>
      <p>Track key metrics including review cycle time, compliance error rates, team collaboration efficiency, and time-to-approval for promotional materials.</p>
    `,
    date: '2025-09-28',
    category: 'Medical Affairs',
    readTime: '6 min read',
    author: 'Medical Affairs Team',
    keywords: ['MLR workflow', 'medical legal regulatory', 'workflow optimization', 'medical affairs', 'pharmaceutical review'],
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="mb-8 text-sm">
            <Link href="/blog" className="text-pharma-blue hover:text-pharma-blue-dark">
              ← Back to Blog
            </Link>
          </nav>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-pharma-blue bg-pharma-blue/10 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <time className="text-sm text-pharma-gray" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              <span className="text-sm text-pharma-gray">{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-pharma-slate mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-pharma-gray">
              {post.excerpt}
            </p>
          </header>

          <div
            className="prose prose-lg max-w-none prose-headings:text-pharma-slate prose-a:text-pharma-blue prose-strong:text-pharma-slate"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-16 pt-8 border-t border-pharma-gray-light">
            <div className="bg-pharma-gray-light/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                Ready to Streamline Your MLR Workflow?
              </h3>
              <p className="text-pharma-gray mb-6">
                Try PromoPack's FDA-compliant pharmaceutical promotional content platform.
                Reduce review cycles by 75% with automated claim extraction and compliance checking.
              </p>
              <Link href="/dashboard?demo=true" className="btn-primary inline-block">
                Try Free Demo
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}
