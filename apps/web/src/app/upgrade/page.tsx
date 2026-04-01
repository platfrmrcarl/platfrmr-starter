"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PricingTable from "@/components/PricingTable";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function UpgradePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string | undefined>(undefined);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchUserPlan() {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.subscription) {
              setCurrentPlan(data.subscription);
            } else {
              setCurrentPlan("starter");
            }
          }
        } catch (error) {
          console.error("Failed to fetch user plan:", error);
        }
      }
      setDataLoaded(true);
    }
    
    if (user && !loading) {
      fetchUserPlan();
    }
  }, [user, loading]);

  if (loading || !user || !dataLoaded) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-12 text-primary">Upgrade Your Account</h1>
        
        <PricingTable currentPlan={currentPlan} />
      </div>
    </div>
  );
}
