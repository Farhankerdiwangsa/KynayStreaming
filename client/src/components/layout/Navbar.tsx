import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Sedang Tayang", path: "/sedang-tayang" },
  { label: "Jadwal Tayang", path: "/jadwal-tayang" },
  { label: "Terbaru", path: "/terbaru" },
  { label: "Populer", path: "/populer" },
  { label: "Genre", path: "/genre" },
  { label: "Sudah Tamat", path: "/sudah-tamat" },
  { label: "Simpanan", path: "/simpanan" },
];

export function Navbar() {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <motion.span
              className="text-3xl font-black text-primary cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
            >
              KynayStreams
            </motion.span>
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-primary"
                onClick={() => setSearchOpen(!searchOpen)}
                data-testid="button-search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="py-3 space-y-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02, type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
                  >
                    <Link href={item.path}>
                      <Button
                        variant={location === item.path ? "default" : "ghost"}
                        className="w-full justify-start text-foreground font-semibold"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
              className="overflow-hidden border-t border-border py-3"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
              >
                <Input
                  type="text"
                  placeholder="Cari anime..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyDown={handleSearchSubmit}
                  autoFocus
                  className="w-full bg-secondary text-foreground placeholder:text-muted-foreground border-2 border-border focus-visible:ring-1 focus-visible:ring-primary font-medium transition-all duration-200"
                  style={{ borderRadius: "6px" }}
                  data-testid="input-search"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
