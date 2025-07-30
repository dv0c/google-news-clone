"use client";
import Link from "next/link";
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
    <div className="absolute z-10 w-full">
      <div className="w-full max-w-fit mx-auto my-3 bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
        {/* Pulsing dot */}
        <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>

        {/* Text */}
        <span className="font-bold text-md">Breaking News:</span>
        <Link href={'/article/' + breaking.link} className="font-semibold text-md hover:underline truncate">
          {breaking.title}
        </Link>
      </div>
    </div>
  );
}
