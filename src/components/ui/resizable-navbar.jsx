import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = ({ children, className }) => {
  return (
    <div className={cn("sticky top-0 z-50 w-full   bg-gradient-to-br from-orange-100 via-amber-500 to-yellow-600 border-b border-neutral-200 dark:border-neutral-800", className)}>
      {children}
    </div>
  );
};

export const NavBody = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mx-auto hidden max-w-7xl items-center justify-between gap-4 px-4 py-4 md:flex",
        className
      )}
    >
      {children}
    </div>
  );
};

export const NavbarLogo = ({ children, to = "/", className }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 text-xl font-bold  ",
        className
      )}
    >
      {children || (
        <>
          <span>
            <span className="text-indigo-900  ">Event</span>
            <span className="text-rose-950">Hub</span>
          </span>
        </>
      )}
    </Link>
  );
};

export const NavItems = ({ items, className }) => {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      {items.map((item, idx) => (
        <Link
          key={`nav-${idx}`}
          to={item.link}
          className="relative text-rose-900 font-bold transition-colors hover:text-indigo-600 "
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export const NavbarButton = ({ 
  children, 
  variant = "primary", 
  className, 
  onClick,
  to 
}) => {
  const baseStyles = "rounded-lg px-4 py-2 text-sm font-medium transition-all";
  const variants = {
    primary: "border border-rose-700   text-rose-900 font-bold   ",
    secondary: "border border-rose-700 text-rose-900 font-bold hover:bg-neutral-100     ",
  };

  const Component = to ? Link : "button";
  
  return (
    <Component
      to={to}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], className)}
    >
      {children}
    </Component>
  );
};

export const MobileNav = ({ children, className }) => {
  return (
    <div className={cn("md:hidden", className)}>
      {children}
    </div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div className={cn("flex items-center justify-between px-4 py-4", className)}>
      {children}
    </div>
  );
};

export const MobileNavToggle = ({ isOpen, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg p-2 text-rose-900 font-bold",
        className
      )}
      aria-label="Toggle menu"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
};

export const MobileNavMenu = ({ isOpen, onClose, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "overflow-hidden border-t border-neutral-200 dark:border-neutral-800",
            className
          )}
        >
          <div className="flex flex-col gap-4 px-4 py-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
