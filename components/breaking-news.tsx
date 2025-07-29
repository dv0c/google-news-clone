"use client";
import { useEffect, useState } from "react";

export function BreakingNewsBanner() {
  const [breaking, setBreaking] = useState<any>(null);

  useEffect(() => {
    const fetchBreaking = async () => {
      const res = await fetch("/api/breaking");
      const data = await res.json();

      // If API returns multiple articles, pick the latest one
      if (Array.isArray(data.breaking)) {
        // Sort by createdAt (just in case) and pick the first
        const latest = data.breaking.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        setBreaking(latest || null);
      } else {
        // If API already returns a single article
        setBreaking(data.breaking);
      }
    };

    fetchBreaking();
    const interval = setInterval(fetchBreaking, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  if (!breaking) return null;

  return (
    <div className="bg-red-600 text-white text-center p-2 font-bold">
      BREAKING NEWS:{" "}
      <a href={'/article/'+breaking.id} target="_blank" className="underline ml-1">
        {breaking.title}
      </a>
    </div>
  );
}
