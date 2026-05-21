import Link from "next/link"

export default function NavMenu({ menu , title }: { menu: {title: string, href: string}[] , title: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#040914]/80 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto flex h-16 items-center px-4 lg:px-8">
        <div className="mr-8 flex items-center gap-2 text-2xl font-bold tracking-tighter hover:scale-105 transition-transform duration-300">
          <Link href="/" className="text-white hover:text-glow transition-all">
            {title}
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {menu && menu.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="px-3 py-2 rounded-md transition-all text-foreground/80 hover:text-primary hover:bg-primary/10 hover:text-glow"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}