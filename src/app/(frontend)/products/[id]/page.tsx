import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  try {
    const product: any = await payload.findByID({
      collection: 'products',
      id: id,
    })

    
    if (!product || !product.isActive) return notFound()
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3004'
    const imageUrl = product.image?.url
    const finalImage = imageUrl?.startsWith('http') 
      ? imageUrl 
      : imageUrl ? `${baseUrl}${imageUrl}` : null

    return (
      <main className="relative w-full min-h-screen bg-[#0f172a] text-slate-200 overflow-x-hidden">

        <div className="fixed inset-0 bg-[#0f172a] -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Link 
            href="/products" 
            className="group text-slate-400 hover:text-white mb-10 inline-flex items-center gap-2 transition-all"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            Back to Collection
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              {finalImage ? (
                <img 
                  src={finalImage} 
                  alt={product.title} 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" 
                />
              ) : (
                <div className="h-96 flex items-center justify-center text-slate-700 font-bold uppercase tracking-widest bg-slate-800/20">
                  No Preview Available
                </div>
              )}
            </div>
            
        
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-600/10 text-blue-400 border border-blue-600/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {product.category}
                </span>
                {product.stock > 0 && (
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">
                    • In Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                {product.title}
              </h1>
              
              <p className="text-4xl font-bold text-blue-400 mb-10">
                ₹{product.price.toLocaleString()}
              </p>
              
              <div className="border-t border-slate-800/60 pt-10">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">
                  Description
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg mb-10">
                  {product.description}
                </p>
                
                <div className="bg-slate-800/30 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Available Stock
                    </p>
                    <p className="text-xl font-bold text-white">
                      {product.stock || 0} <span className="text-sm font-medium text-slate-400">Units left</span>
                    </p>
                  </div>
                  
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/10 active:scale-95">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Product fetching failed:", error)
    return notFound()
  }
}