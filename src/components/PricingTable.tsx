"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  marketing_features: { name: string }[];
}

interface PricingTableProps {
  currentPlan?: string;
}

const PLAN_HIERARCHY = ["starter", "basic", "pro", "enterprise"];

export default function PricingTable({ currentPlan }: PricingTableProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/stripe/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  if (!products.length) {
    return <div className="text-center text-lg mt-8">No pricing plans currently available.</div>;
  }

  // Filter products so that we only expose those above the currently active plan
  const filteredProducts = products.filter((product) => {
    if (!currentPlan) return true;
    
    // Convert to lowercase to ensure comparison works regardless of casing
    const currentIdx = PLAN_HIERARCHY.indexOf(currentPlan.toLowerCase());
    const productIdx = PLAN_HIERARCHY.indexOf(product.name.toLowerCase());
    
    // If we can't determine the plan levels, err on the side of showing it
    if (currentIdx === -1 || productIdx === -1) return true;

    return productIdx > currentIdx;
  });

  if (!filteredProducts.length) {
    return (
      <div className="text-center mt-8 p-10 bg-base-100 rounded-2xl shadow-sm border border-base-200">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-primary mb-2">Congratulations!</h3>
        <p className="text-lg text-base-content/80">You have our best service we offer. Enjoy your unlimited access!</p>
      </div>
    );
  }

  // Calculate dynamic grid classes safely for Tailwind JIT to pick it up properly without dynamic string interpolation failing
  let gridClass = 'grid-cols-1 md:grid-cols-1';
  if (filteredProducts.length === 2) gridClass = 'grid-cols-1 md:grid-cols-2';
  if (filteredProducts.length >= 3) gridClass = 'grid-cols-1 md:grid-cols-3';

  return (
    <div className={`grid ${gridClass} gap-8 items-stretch justify-center max-w-4xl mx-auto`}>
      {filteredProducts.map((product, index) => {
        // Highlight specifically the "Pro" tier
        const isFeatured = product.name.toLowerCase() === 'pro';
        
        return (
          <div 
            key={product.id} 
            className={`card bg-base-100 shadow-xl relative flex flex-col h-full ${
              isFeatured ? 'border-2 border-primary md:-translate-y-4' : 'border border-base-200'
            }`}
          >
            {isFeatured && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full text-center">
                <span className="badge badge-primary px-4 py-1 font-semibold whitespace-nowrap">
                  {currentPlan ? "Upgrade Now" : "Most Popular"}
                </span>
              </div>
            )}
            
            <div className="card-body gap-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="text-5xl font-extrabold text-primary mb-2">
                ${product.price}
                <span className="text-lg text-base-content/60 font-normal">/{product.interval || 'month'}</span>
              </div>
              
              <p className="text-base-content/70 italic min-h-[3rem]">
                {product.description || `Perfect for ${product.name.toLowerCase()} usage.`}
              </p>
              
              <ul className="text-left space-y-3 mb-6 mx-auto w-full max-w-[250px] flex-1">
                {(product.marketing_features && product.marketing_features.length > 0 ? product.marketing_features : [
                  { name: `Basic access to ${product.name} features` },
                  { name: "Community support" },
                  { name: "Standard SLA" }
                ]).map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg> 
                    {feature.name}
                  </li>
                ))}
              </ul>

              <Link 
                href={`/checkout?price=${product.id}`} 
                className={`btn btn-lg w-full mt-auto ${isFeatured ? 'btn-primary shadow-md' : 'btn-outline btn-primary'}`}
              >
                Select {product.name}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
