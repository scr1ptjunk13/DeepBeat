import Link from 'next/link'
import { Music } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-white/10 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6" />
          <span className="font-mono text-lg">DeepBeat.ai</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {['Home','Feedback','About'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {item.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header

