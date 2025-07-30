"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function BreakingNewsBanner() {
  const [breaking, setBreaking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const res = await fetch("/api/breaking");
        const data = await res.json();

        if (Array.isArray(data.breaking)) {
          const latest = data.breaking.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )[0];
          setBreaking(latest || null);
        } else {
          setBreaking(data.breaking);
        }
      } catch (err) {
        console.error("Error fetching breaking news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBreaking();
    const interval = setInterval(fetchBreaking, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Skeleton loader
  if (loading) {
    return (
      <div className="absolute z-10 w-full">
        <div className="w-full max-w-fit mx-auto my-3 px-4 py-2 rounded-md flex items-center gap-2 bg-red-600 animate-pulse">
          <div className="w-3 h-3 rounded-full bg-white/80"></div>
          <div className="h-4 w-24 bg-white/80 rounded"></div>
          <div className="h-4 w-48 bg-white/50 rounded hidden sm:block"></div>
        </div>
      </div>
    );
  }

  if (!breaking) return null;

  return (
    <div className="sm:absolute z-10 w-full">
      <div className="w-[95%] sm:max-w-fit max-w-fit mx-auto my-3 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 sm:gap-3">
        {/* Pulsing dot */}
        <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>

        {/* Text */}
        <span className="font-bold text-sm sm:text-md whitespace-nowrap">
          Breaking News:
        </span>

        {/* Title (truncate for mobile) */}
        <Link
          href={"/article/" + breaking.link}
          className="font-semibold text-sm sm:text-md hover:underline truncate max-w-[250px] sm:max-w-none"
        >
          {breaking.title}
        </Link>
      </div>
    </div>
  );
}
