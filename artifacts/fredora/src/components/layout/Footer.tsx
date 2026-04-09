import { Link } from "wouter";
import { useListDivisions } from "@workspace/api-client-react";

export function Footer() {
  const { data: divisions } = useListDivisions();

  return (
    <footer className="bg-slate-950 text-slate-200 py-12 border-t border-slate-900 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold font-serif text-white">Fredora</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4 max-w-xs">
              Giving you the best of your needs. A proudly Nigerian conglomerate rooted in quality and community.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Divisions</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {divisions?.map((div) => (
                <li key={div.slug}>
                  <Link href={`/divisions/${div.slug}`} className="hover:text-primary transition-colors">
                    {div.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <address className="not-italic text-sm text-slate-400 space-y-2">
              <p>Enugu, Nigeria</p>
              <p>Email: info@fedoramulticoncept.com</p>
              <p>Phone: +234 (0) 800 000 0000</p>
            </address>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fredora Multiconcept. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
