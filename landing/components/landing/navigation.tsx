"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "01. Dashboard", href: "/dashboard" },
  { name: "02. Map View", href: "/map" },
  { name: "03. Volunteer", href: "/volunteer" },
  { name: "04. Report Issue", href: "/reports" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-200 border-b-4 border-swiss-border ${
        isScrolled ? "bg-swiss-bg/95 backdrop-blur-none py-4" : "bg-swiss-bg py-8"
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="group">
          <span className="text-4xl font-black uppercase tracking-tighter leading-none">
            Community<span className="text-swiss-accent">Sync</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-bold uppercase tracking-widest text-swiss-fg hover:text-swiss-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-sm font-bold uppercase tracking-widest hover:text-swiss-accent transition-colors px-4">
            Sign in
          </a>
          <Button
            asChild
            className="bg-swiss-fg hover:bg-swiss-accent text-swiss-bg rounded-none border-none h-12 px-8 text-sm font-bold uppercase tracking-widest transition-all"
          >
            <a href="/reports">Report Issue</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 border-2 border-swiss-border"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[108px] bg-swiss-bg z-40 p-8 flex flex-col gap-8 swiss-grid-pattern">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-4xl font-black uppercase tracking-tighter hover:text-swiss-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-4 mt-auto">
            <Button asChild className="bg-swiss-fg text-swiss-bg h-16 text-lg font-black uppercase rounded-none">
                <a href="/reports" onClick={() => setIsMobileMenuOpen(false)}>Report Issue</a>
            </Button>
            <Button asChild variant="outline" className="border-4 border-swiss-border h-16 text-lg font-black uppercase rounded-none">
                <a href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
