import Link from "next/link"
import { Button } from "./ui/button"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const Footer = () => {
    return <footer className="bg-[#1b1b1b] mt-20 text-gray-300 pt-10 pb-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Logo & About */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <span className="text-xl text-white font-semibold">Meindesk</span>
                </div>
                <p className="text-sm text-gray-400 leading-6">
                    Οι πιο έγκυρες ειδήσεις από την Ελλάδα και τον κόσμο.
                    Άμεση ενημέρωση για όλα τα γεγονότα που σε ενδιαφέρουν.
                </p>
            </div>

            {/* Navigation Links */}
            <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Σύνδεσμοι</h3>
                <ul className="space-y-2">
                    <li><Link href="/" className="hover:text-white">Αρχική</Link></li>
                    <li><Link href="/greece" className="hover:text-white">Ελλάδα</Link></li>
                    <li><Link href="/world" className="hover:text-white">Κόσμος</Link></li>
                    <li><Link href="/sports" className="hover:text-white">Αθλητικά</Link></li>
                    <li><Link href="/tech" className="hover:text-white">Τεχνολογία</Link></li>
                </ul>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Κατηγορίες</h3>
                <ul className="space-y-2">
                    <li><Link href="/entertainment" className="hover:text-white">Ψυχαγωγία</Link></li>
                    <li><Link href="/local" className="hover:text-white">Τοπικά</Link></li>
                    <li><Link href="/showcase" className="hover:text-white">Showcase</Link></li>
                    <li><Link href="/following" className="hover:text-white">Ακολουθώ</Link></li>
                </ul>
            </div>

            {/* Social Media */}
            <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Ακολουθήστε μας</h3>
                <div className="flex gap-4">
                    <Link href="#" className="hover:text-white">
                        <Facebook className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="hover:text-white">
                        <Twitter className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="hover:text-white">
                        <Instagram className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="hover:text-white">
                        <Youtube className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Meindesk. Όλα τα δικαιώματα διατηρούνται.</p>
        </div>
    </footer>

}

export default Footer