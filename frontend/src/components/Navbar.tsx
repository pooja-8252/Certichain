// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { Shield, Menu, X, LogOut, ArrowRight } from 'lucide-react';
// import AuthModal from "@/components/AuthModal";
// import { useAuth } from '@/lib/contexts/AuthContext';

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const [showAuth, setShowAuth] = useState(false);
  
//   // Use Auth Context instead of local state
//   const { isLoggedIn, userType, logout } = useAuth();

//   const publicLinks = [
//     { name: 'Home', href: '/' },
//     { name: 'Verify', href: '/verify' },
//     { name: 'About', href: '/about' },
//   ];

//   const authLinks = [
//     { name: 'Dashboard', href: '/student', show: isLoggedIn && userType === 'student' },
//     { name: 'Dashboard', href: '/institute', show: isLoggedIn && userType === 'institute' },
//   ];

//   const visibleLinks = [...publicLinks, ...authLinks.filter(l => l.show)];

//   const handleLogout = () => {
//     logout();
//     router.push('/');
//   };

//   return (
//     <>
//       <nav className="sticky top-0 z-50 bg-[#080c14]/80 backdrop-blur-xl border-b border-white/[0.05]">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="flex items-center justify-between h-16">

//             {/* Logo */}
//             <Link href="/" className="flex items-center gap-2.5 group shrink-0">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-md group-hover:bg-cyan-400/30 transition-all duration-300" />
//                 <div className="relative p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
//                   <Shield size={17} className="text-cyan-400" />
//                 </div>
//               </div>
//               <span className="font-bold text-[17px] tracking-tight">
//                 <span className="text-white">E-</span>
//                 <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Certify</span>
//               </span>
//             </Link>

//             {/* Desktop Nav */}
//             <div className="hidden md:flex items-center gap-7">
//               {visibleLinks.map(({ name, href }) => {
//                 const isActive = pathname === href;
//                 return (
//                   <Link key={name} href={href}
//                     className={`relative text-[13px] font-medium transition-all duration-200 group ${
//                       isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200'}`}>
//                     {name}
//                     <span className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${
//                       isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* Desktop Auth */}
//             <div className="hidden md:flex items-center gap-4 shrink-0">
//               {isLoggedIn ? (
//                 <>
//                   <div className="flex items-center gap-2">
//                     <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
//                     <span className="text-[11px] text-gray-500 tracking-widest uppercase">{userType}</span>
//                   </div>
//                   <button onClick={handleLogout}
//                     className="flex items-center gap-1.5 text-[13px] text-red-400 hover:text-red-300 transition-colors duration-200">
//                     <LogOut size={13} /> Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button onClick={() => setShowAuth(true)}
//                     className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors duration-200">
//                     Login
//                   </button>

//                   <button onClick={() => setShowAuth(true)}
//                     className="group flex items-center gap-2 px-4 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/25 text-white text-[13px] font-semibold transition-all duration-200">
//                     Get Started
//                     <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Mobile Toggle */}
//             <button onClick={() => setIsOpen(!isOpen)}
//               className="md:hidden p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:text-white transition-all duration-200">
//               {isOpen ? <X size={17} /> : <Menu size={17} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden border-t border-white/[0.05] px-6 py-4 space-y-1">
//             {visibleLinks.map(({ name, href }) => {
//               const isActive = pathname === href;
//               return (
//                 <Link key={name} href={href} onClick={() => setIsOpen(false)}
//                   className={`block px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
//                     isActive ? 'text-white bg-white/[0.04]' : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.02]'}`}>
//                   {name}
//                 </Link>
//               );
//             })}
//             <div className="pt-2 flex flex-col gap-2">
//               {isLoggedIn ? (
//                 <button onClick={handleLogout}
//                   className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/15 bg-red-500/5 text-red-400 text-sm">
//                   <LogOut size={14} /> Logout
//                 </button>
//               ) : (
//                 <>
//                   <button onClick={() => { setShowAuth(true); setIsOpen(false); }}
//                     className="w-full py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:bg-white/[0.04] transition-all">
//                     Login
//                   </button>
//                   <button onClick={() => { setShowAuth(true); setIsOpen(false); }}
//                     className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold">
//                     Get Started <ArrowRight size={13} />
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>

//       {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
//     </>
//   );
// }



'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu, X, LogOut, ArrowRight } from 'lucide-react';
import AuthModal from "@/components/AuthModal";
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const { isLoggedIn, userType, isAdmin, logout } = useAuth();

  const publicLinks = [
    { name: 'Home', href: '/' },
    { name: 'Verify', href: '/verify' },
    { name: 'About', href: '/about' },
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
      <nav className="sticky top-0 z-50 bg-[#080c14]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-md group-hover:bg-cyan-400/30 transition-all duration-300" />
                <div className="relative p-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
                  <Shield size={17} className="text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-[17px] tracking-tight">
                <span className="text-white">E-</span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Certify</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              {visibleLinks.map(({ name, href }) => {
                const isActive = pathname === href;
                // Special style for Admin link
                if (href === '/admin') {
                  return (
                    <Link key="admin" href="/admin"
                      className={`relative text-[13px] font-medium transition-all duration-200 group ${
                        isActive ? 'text-cyan-400' : 'text-cyan-500/70 hover:text-cyan-400'
                      }`}>
                      <span className="flex items-center gap-1">
                        <Shield size={12} />
                        Admin
                      </span>
                      <span className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </Link>
                  );
                }
                return (
                  <Link key={name + href} href={href}
                    className={`relative text-[13px] font-medium transition-all duration-200 group ${
                      isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200'}`}>
                    {name}
                    <span className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      isAdmin ? 'bg-cyan-400' : 'bg-cyan-400'
                    }`} />
                    <span className={`text-[11px] tracking-widest uppercase ${
                      isAdmin ? 'text-cyan-400' : 'text-gray-500'
                    }`}>
                      {isAdmin ? 'Admin' : userType}
                    </span>
                  </div>
                  <button onClick={handleLogout}
                    className="flex items-center gap-1.5 text-[13px] text-red-400 hover:text-red-300 transition-colors duration-200">
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowAuth(true)}
                    className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors duration-200">
                    Login
                  </button>
                  <button onClick={() => setShowAuth(true)}
                    className="group flex items-center gap-2 px-4 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/25 text-white text-[13px] font-semibold transition-all duration-200">
                    Get Started
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:text-white transition-all duration-200">
              {isOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/[0.05] px-6 py-4 space-y-1">
            {visibleLinks.map(({ name, href }) => {
              const isActive = pathname === href;
              return (
                <Link key={name + href} href={href} onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    href === '/admin'
                      ? isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/5'
                      : isActive ? 'text-white bg-white/[0.04]' : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.02]'
                  }`}>
                  {href === '/admin' && <Shield size={13} />}
                  {name}
                </Link>
              );
            })}
            <div className="pt-2 flex flex-col gap-2">
              {isLoggedIn ? (
                <button onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/15 bg-red-500/5 text-red-400 text-sm">
                  <LogOut size={14} /> Logout
                </button>
              ) : (
                <>
                  <button onClick={() => { setShowAuth(true); setIsOpen(false); }}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:bg-white/[0.04] transition-all">
                    Login
                  </button>
                  <button onClick={() => { setShowAuth(true); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold">
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