"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-slate-200 bg-gradient-to-r from-white via-blue-50 to-cyan-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo - Responsive boyutlar */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
              Harfiye
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/nasil-oynanir"
              className="text-slate-600 hover:text-cyan-600 transition-colors font-medium"
            >
              Nasıl Oynanır?
            </Link>
            <Link 
              href="/hakkimizda"
              className="text-slate-600 hover:text-cyan-600 transition-colors font-medium"
            >
              Hakkımızda
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-cyan-600 transition-colors p-2"
              aria-label="Menüyü aç/kapat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/nasil-oynanir"
                className="text-slate-600 hover:text-cyan-600 transition-colors font-medium text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Nasıl Oynanır?
              </Link>
              <Link 
                href="/hakkimizda"
                className="text-slate-600 hover:text-cyan-600 transition-colors font-medium text-center py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
} 