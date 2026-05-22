import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function NavMenu({ menu , title }: { menu: {title: string, icon: React.ReactNode, href: string}[] , title: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border border-white/5 rounded-xl bg-[#040914]/80 backdrop-blur-xl shadow-lg mb-8 group/header">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8 relative">
        <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tighter hover:scale-105 transition-transform duration-300">
          <Link href="/" className="text-white hover:text-glow transition-all">
            {title}
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {menu && menu.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="px-3 py-2 rounded-md transition-all text-foreground/80 hover:text-primary hover:bg-primary/10 hover:text-glow"
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle (No JS required) */}
        <details className="md:hidden group">
          <summary className="p-2 text-foreground/80 hover:text-white cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
            <Menu className="w-6 h-6 block group-open:hidden" />
            <X className="w-6 h-6 hidden group-open:block" />
          </summary>
          
          <div className="absolute top-full left-0 right-0 w-full bg-[#040914]/95 backdrop-blur-xl border border-white/5 rounded-b-xl shadow-2xl flex flex-col p-4 space-y-2 z-[100]">
            {menu && menu.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="px-4 py-4 rounded-lg transition-all text-foreground/90 hover:text-primary hover:bg-primary/10 hover:text-glow font-semibold text-lg active:bg-primary/20"
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  )
}