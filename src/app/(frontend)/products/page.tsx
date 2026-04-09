import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; category?: string }> 
}) {
  const { page = '1', category } = await searchParams
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const query: any = { isActive: { equals: true } }
  if (category && category !== 'All') {
    query.category = { equals: category }
  }

  const { docs, totalPages, page: currentPage, hasPrevPage, hasNextPage, prevPage, nextPage } = await payload.find({
    collection: 'products',
    where: query,
    limit: 8,
    page: parseInt(page),
  })

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Other']

  return (
    <main className="relative w-full min-h-screen text-slate-200">
      <div className="fixed inset-0 bg-[#0f172a] -z-10"></div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-start mb-10">
          <Link 
            href="/" 
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-sm font-semibold transition-all shadow-sm"
          >
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Our Products
          </h1>
          <p className="mt-4 text-slate-400 font-medium max-w-xl mx-auto">
            Explore our curated selection of high-quality products.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat}`}
              className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest border transition-all ${
                category === cat || (!category && cat === 'All')
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {docs.map((product: any) => {
            const rawUrl = product.image?.url
            const displayImage = rawUrl?.startsWith('http') 
              ? rawUrl 
              : rawUrl ? `${baseUrl}${rawUrl}` : null

            return (
              <div key={product.id} className="group flex flex-col bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 rounded-xl overflow-hidden transition-all duration-300">
                
                <div className="relative aspect-4/5 overflow-hidden bg-slate-900">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-700 text-[10px] uppercase font-bold tracking-widest">
                      No Preview
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col grow">
                  <h2 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h2>
                  <p className="text-xl font-bold text-blue-400 mb-6">₹{product.price.toLocaleString()}</p>
                  
                  <Link 
                    href={`/products/${product.id}`} 
                    className="mt-auto w-full py-3 bg-slate-700 hover:bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg text-center transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-8 pt-10 border-t border-slate-800/50">
            {hasPrevPage ? (
              <Link 
                href={`/products?page=${prevPage}${category ? `&category=${category}` : ''}`} 
                className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                ← Previous
              </Link>
            ) : (
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Previous</span>
            )}

            <div className="text-[11px] font-black text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 uppercase">
              Page {currentPage} of {totalPages}
            </div>

            {hasNextPage ? (
              <Link 
                href={`/products?page=${nextPage}${category ? `&category=${category}` : ''}`} 
                className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                Next →
              </Link>
            ) : (
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Next</span>
            )}
          </div>
        )}
      </div>
    </main>
  )
}