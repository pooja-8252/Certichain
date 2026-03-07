'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu, X, LogOut, ArrowRight, ChevronDown } from 'lucide-react';
import AuthModal from "@/components/AuthModal";
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isLoggedIn, userType, isAdmin, logout } = useAuth();

  // Dynamic scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const publicLinks = [
    { name: 'Home',   href: '/' },
    { name: 'Verify', href: '/verify' },
    { name: 'About',  href: '/about' },
  ];

  const authLinks = [
    { name: 'Dashboard', href: '/student',   show: isLoggedIn && userType === 'student' },
    { name: 'Dashboard', href: '/institute',  show: isLoggedIn && userType === 'institute' },
    { name: 'Admin',     href: '/admin',      show: isAdmin },
  ];

  const visibleLinks = [...publicLinks, ...authLinks.filter(l => l.show)];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .nav-font   { font-family: 'Outfit', sans-serif; }
        .logo-font  { font-family: 'Playfair Display', serif; }

        .navbar {
          background: rgba(249, 245, 239, 0.82);
          border-bottom: 1px solid rgba(184,137,58,0.13);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(249, 245, 239, 0.95);
          box-shadow: 0 4px 32px rgba(120,90,40,0.08);
        }

        /* Active nav link underline */
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, #b8893a, #c9a24a);
          border-radius: 2px;
        }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1.5px;
          background: linear-gradient(90deg, #b8893a, #c9a24a);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .nav-link-hover:hover::after { transform: scaleX(1); }

        /* Mobile menu */
        .mobile-menu {
          border-top: 1px solid rgba(184,137,58,0.12);
          background: rgba(252,249,244,0.98);
          backdrop-filter: blur(16px);
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Btn styles */
        .btn-login {
          color: #7a6d5e;
          transition: color 0.2s ease;
        }
        .btn-login:hover { color: #1e1a14; }

        .btn-getstarted {
          background: linear-gradient(135deg, #c9a24a 0%, #b8893a 100%);
          color: #fff;
          box-shadow: 0 2px 12px rgba(184,137,58,0.28);
          transition: all 0.25s ease;
        }
        .btn-getstarted:hover {
          box-shadow: 0 4px 20px rgba(184,137,58,0.42);
          transform: translateY(-1px);
        }

        .btn-logout {
          color: #b45309;
          transition: color 0.2s ease;
          display: flex; align-items: center; gap: 5px;
        }
        .btn-logout:hover { color: #92400e; }

        /* Role badge */
        .role-badge {
          background: rgba(184,137,58,0.08);
          border: 1px solid rgba(184,137,58,0.2);
          border-radius: 999px;
          padding: 2px 10px;
          display: flex; align-items: center; gap: 6px;
        }
        .role-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #b8893a;
          animation: rolepulse 2s ease-in-out infinite;
        }
        @keyframes rolepulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(184,137,58,0.4); }
          50%       { opacity: 0.8; box-shadow: 0 0 0 4px rgba(184,137,58,0); }
        }

        /* Admin special badge */
        .admin-badge {
          background: rgba(184,137,58,0.1);
          border: 1px solid rgba(184,137,58,0.25);
          border-radius: 999px;
          padding: 2px 10px;
          display: flex; align-items: center; gap: 5px;
          color: #b8893a;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Mobile link */
        .mobile-link {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 400;
          color: #6b5f4e;
          transition: all 0.2s ease;
        }
        .mobile-link:hover {
          background: rgba(184,137,58,0.07);
          color: #1e1a14;
        }
        .mobile-link.active {
          background: rgba(184,137,58,0.1);
          color: #b8893a;
          font-weight: 500;
        }
        .mobile-link.admin-link { color: #b8893a; }
        .mobile-link.admin-link:hover { background: rgba(184,137,58,0.1); }

        /* Mobile toggle */
        .mobile-toggle {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(184,137,58,0.18);
          color: #7a6d5e;
          transition: all 0.2s ease;
        }
        .mobile-toggle:hover {
          background: rgba(255,255,255,0.9);
          color: #1e1a14;
          border-color: rgba(184,137,58,0.35);
        }
      `}</style>

      <nav className={`nav-font navbar sticky top-0 z-50 ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-[60px]">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center relative"
                style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}
              >
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(184,137,58,0.15)" }}
                />
                <Shield size={15} style={{ color: "#b8893a" }} />
              </div>

              {/* Wordmark */}
              <span className="logo-font font-normal text-[18px] tracking-wide" style={{ color: "#1e1a14" }}>
                E&#8209;<em className="font-semibold italic" style={{ color: "#b8893a" }}>Certify</em>
              </span>
            </Link>

            {/* ── Desktop Nav links ── */}
            <div className="hidden md:flex items-center gap-8">
              {visibleLinks.map(({ name, href }) => {
                const isActive = pathname === href;
                const isAdminLink = href === '/admin';

                return (
                  <Link
                    key={name + href}
                    href={href}
                    className={`relative text-[13px] font-medium transition-colors duration-200
                      ${isAdminLink
                        ? isActive ? 'nav-link-active' : 'nav-link-hover'
                        : isActive ? 'nav-link-active' : 'nav-link-hover'
                      }`}
                    style={{
                      color: isAdminLink
                        ? isActive ? '#b8893a' : 'rgba(184,137,58,0.7)'
                        : isActive ? '#1e1a14' : '#9a8a78',
                    }}
                  >
                    {isAdminLink && (
                      <span className="inline-flex items-center gap-1">
                        <Shield size={11} />
                        {name}
                      </span>
                    )}
                    {!isAdminLink && name}
                  </Link>
                );
              })}
            </div>

            {/* ── Desktop Auth ── */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {isLoggedIn ? (
                <>
                  {/* Role badge */}
                  <div className={isAdmin ? "admin-badge" : "role-badge"}>
                    {!isAdmin && <span className="role-dot" />}
                    {isAdmin && <Shield size={11} />}
                    <span
                      className="text-[11px] font-medium tracking-[0.13em] uppercase"
                      style={{ color: isAdmin ? "#b8893a" : "#9a8a78" }}
                    >
                      {isAdmin ? "Admin" : userType}
                    </span>
                  </div>

                  {/* Logout */}
                  <button onClick={handleLogout} className="btn-logout text-[13px] font-medium">
                    <LogOut size={13} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowAuth(true)} className="btn-login text-[13px] font-medium">
                    Login
                  </button>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="btn-getstarted group flex items-center gap-2 px-4 py-[7px] rounded-lg text-[13px] font-medium"
                  >
                    Get Started
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </>
              )}
            </div>

            {/* ── Mobile toggle ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden mobile-toggle p-2 rounded-xl"
            >
              {isOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {isOpen && (
          <div className="mobile-menu md:hidden px-5 py-3 space-y-0.5">
            {visibleLinks.map(({ name, href }) => {
              const isActive = pathname === href;
              const isAdminLink = href === '/admin';
              return (
                <Link
                  key={name + href}
                  href={href}
                  className={`mobile-link ${isActive ? 'active' : ''} ${isAdminLink ? 'admin-link' : ''}`}
                >
                  {isAdminLink && <Shield size={13} />}
                  {name}
                  {isActive && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: "#b8893a" }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Mobile auth */}
            <div className="pt-3 mt-1 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(184,137,58,0.1)" }}>
              {isLoggedIn ? (
                <div className="flex items-center justify-between px-2">
                  <div className={isAdmin ? "admin-badge" : "role-badge"}>
                    {!isAdmin && <span className="role-dot" />}
                    {isAdmin && <Shield size={11} />}
                    <span className="text-[11px] font-medium tracking-[0.13em] uppercase"
                      style={{ color: isAdmin ? "#b8893a" : "#9a8a78" }}>
                      {isAdmin ? "Admin" : userType}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                      color: "#b45309",
                      background: "rgba(180,83,9,0.06)",
                      border: "1px solid rgba(180,83,9,0.15)"
                    }}
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setShowAuth(true); setIsOpen(false); }}
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      border: "1px solid rgba(184,137,58,0.2)",
                      background: "rgba(255,255,255,0.5)",
                      color: "#6b5f4e"
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setShowAuth(true); setIsOpen(false); }}
                    className="btn-getstarted w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                  >
                    Get Started <ArrowRight size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}