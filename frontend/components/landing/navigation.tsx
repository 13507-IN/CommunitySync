"use client";

import { useState, useEffect } from "react";
import { 
  Show,
  SignInButton, 
  SignUpButton, 
  UserButton 
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Map", href: "#map" },
  { name: "Impact", href: "#impact" },
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
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>CommunitySync</span>
            <span className={`text-muted-foreground font-mono transition-all duration-500 ${isScrolled ? "text-[10px] mt-0.5" : "text-xs mt-1"}`}>TM</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop Auth/CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className={`text-foreground/70 hover:text-foreground transition-all duration-500 cursor-pointer ${isScrolled ? "text-xs" : "text-sm"}`}>
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 cursor-pointer ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
                >
                  Join Sync
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Button
                size="sm"
                variant="outline"
                asChild
                className={`rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
              >
                <a href="/report">Report Issue</a>
              </Button>
              <div className="flex items-center justify-center ml-2 border-2 border-foreground rounded-full p-0.5">
                <UserButton afterSignOutUrl="/" />
              </div>
            </Show>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>
          
          {/* Bottom CTAs */}
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-full h-14 text-base cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button 
                  className="flex-1 bg-foreground text-background rounded-full h-14 text-base cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Sync
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Button
                variant="outline"
                className="flex-1 rounded-full h-14 text-base"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <a href="/report">Report Issue</a>
              </Button>
              <div className="flex items-center justify-center border-2 border-foreground rounded-full p-1 bg-foreground/5">
                <UserButton afterSignOutUrl="/" />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}
