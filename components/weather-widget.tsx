"use client"

import { ChevronLeft, MapPin, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function WeatherWidget() {
  return (
    <div>
      <div className="relative flex items-center rounded-2xl bg-[#1f1f1f] gap-4 max-w-2xl">
        {/* Notification Card */}
        {/* <Card className="bg-white px-5 py-2 rounded-2xl shadow-lg max-w-xs relative">
          <div className="space-y-2">
            <h3 className="text-red-600 font-medium text-sm leading-tight">Ειδοποίηση για μέτρια υψηλή ...</h3>
            <p className="text-gray-700 text-xs leading-relaxed">
              Υψηλές τιμές της θερμοκρασίας με τιμές που αναμένεται να κυμαίνονται...
            </p>
          </div>
        </Card> */}

        {/* Weather Display */}
        <div className="relative flex gap-2 items-center bg-[#1f1f1f] rounded-2xl px-5 py-2 text-white">
          <div className="relative">
            <Sun style={{
              animation: "spin 10s linear infinite",
            }} className="h-12 w-12  text-yellow-400 fill-yellow-400" />
          </div>
          <div className="flex flex-col">
            {/* Location with notification dot */}
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xs text-gray-300">Ο καιρός στην τοποθεσία σας</span>
              <MapPin className="h-4 w-4 text-gray-300" />
            </div>

            {/* Weather Icon and Temperature */}
            <div className="flex items-center gap-4">
              <div className="text-2xl font-semibold">26°C</div>
            </div>

            {/* Attribution */}
            <div>
              <span className="text-blue-400 text-xs">καιρός Google</span>
            </div>
        </div>
      </div>
    </div>
    </div >
  )
}
