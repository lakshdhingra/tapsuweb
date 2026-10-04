"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/members", label: "Members" },
  { href: "/leadership", label: "Leadership" },
  { href: "/news", label: "News" },
  { href: "/announcements", label: "Announcements" },
  { href: "/resources", label: "Resources" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // If we are not on the homepage, we might want it to always have a background, 
  // but let's stick to the scroll logic for now or adapt based on pathname.
  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navClasses = cn(
    "fixed top-0 inset-x-0 z-50 transition-all duration-300",
    isScrolled || !isHomepage || isMobileMenuOpen
      ? "bg-background/95 backdrop-blur-md border-b py-3 shadow-sm"
      : "bg-transparent py-5"
  );

  const textClasses = cn(
    "transition-colors",
    isScrolled || !isHomepage || isMobileMenuOpen ? "text-foreground" : "text-white"
  );

  return (
    <header className={navClasses}>
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className={cn("font-heading text-2xl font-bold tracking-tight", textClasses)}>
            TASPU
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium hover:text-primary transition-colors",
                  textClasses,
                  pathname.startsWith(link.href) && isScrolled && "text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button asChild variant={isScrolled || !isHomepage ? "default" : "secondary"}>
              <Link href="/membership/apply">Become a Member</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={cn("lg:hidden p-2 -mr-2", textClasses)}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Nav Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg h-screen"
          >
            <div className="flex flex-col p-6 space-y-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xl font-medium",
                    pathname.startsWith(link.href) ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border w-full my-4" />
              <Button asChild size="lg" className="w-full">
                <Link href="/membership/apply">Become a Member</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
