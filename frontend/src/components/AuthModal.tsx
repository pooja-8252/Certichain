"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Shield, X, ArrowRight, Mail, Lock, GraduationCap, Building2 } from "lucide-react";

export default function AuthModal({ onClose }: any) {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<"student" | "institute">("student");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUserRedirect(user: any) {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || null,
        role,
        createdAt: serverTimestamp(),
      });
    }
    const finalSnap = await getDoc(userRef);
    const userRole = finalSnap.data()?.role as "student" | "institute";
    login(userRole);
    router.push(userRole === "student" ? "/student" : "/institute");
    onClose();
  }

  async function loginWithGoogle() {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleUserRedirect(result.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailAuth() {
    try {
      setLoading(true);
      setError("");
      let result;
      if (isLogin) {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
      }
      await handleUserRedirect(result.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .modal-font    { font-family: 'Outfit', sans-serif; }
        .modal-heading { font-family: 'Playfair Display', serif; }

        .modal-overlay {
          background: rgba(30, 26, 20, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .modal-box {
          background: linear-gradient(160deg, #fdfaf5 0%, #f8f3ec 100%);
          border: 1px solid rgba(184,137,58,0.18);
          box-shadow: 0 32px 80px rgba(100,70,20,0.18), 0 0 0 1px rgba(255,255,255,0.6) inset;
          animation: slideUp 0.25s cubic-bezier(0.34,1.2,0.64,1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* Role toggle */
        .role-track {
          background: rgba(184,137,58,0.07);
          border: 1px solid rgba(184,137,58,0.15);
          border-radius: 12px;
          padding: 4px;
        }
        .role-btn {
          border-radius: 9px;
          padding: 9px 0;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          color: #9a8a78;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .role-btn.active {
          background: linear-gradient(135deg, #c9a24a 0%, #b8893a 100%);
          color: #fff;
          box-shadow: 0 3px 12px rgba(184,137,58,0.35);
        }
        .role-btn:not(.active):hover { color: #b8893a; background: rgba(184,137,58,0.07); }

        /* Inputs */
        .auth-input-wrap {
          position: relative;
        }
        .auth-input-icon {
          position: absolute;
          left: 14px; top: 50%; transform: translateY(-50%);
          color: #c9b99a;
          pointer-events: none;
        }
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(184,137,58,0.18);
          border-radius: 12px;
          padding: 12px 14px 12px 40px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          color: #1e1a14;
          outline: none;
          transition: all 0.2s ease;
        }
        .auth-input::placeholder { color: #c9b99a; }
        .auth-input:focus {
          border-color: rgba(184,137,58,0.5);
          background: rgba(255,255,255,0.95);
          box-shadow: 0 0 0 3px rgba(184,137,58,0.1);
        }

        /* Primary button */
        .btn-primary {
          background: linear-gradient(135deg, #c9a24a 0%, #b8893a 100%);
          color: #fff;
          box-shadow: 0 4px 20px rgba(184,137,58,0.32);
          transition: all 0.25s ease;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
        }
        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 6px 28px rgba(184,137,58,0.45);
          transform: translateY(-1px);
        }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Google button */
        .btn-google {
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(184,137,58,0.18);
          color: #4a3f30;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-google:hover {
          background: rgba(255,255,255,0.95);
          border-color: rgba(184,137,58,0.35);
          box-shadow: 0 4px 16px rgba(120,90,40,0.08);
        }

        /* Divider */
        .or-divider {
          display: flex; align-items: center; gap: 12px;
          color: #c9b99a;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .or-divider::before, .or-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(184,137,58,0.15);
        }

        /* Close button */
        .close-btn {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(184,137,58,0.15);
          color: #9a8a78;
          transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .close-btn:hover {
          background: rgba(255,255,255,0.95);
          color: #1e1a14;
          border-color: rgba(184,137,58,0.3);
        }

        /* Switch link */
        .switch-link {
          color: #b8893a;
          cursor: pointer;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .switch-link:hover { color: #8B6914; text-decoration: underline; }

        /* Loading spinner */
        .spin {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Overlay */}
      <div
        className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-5"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-box modal-font relative w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-2xl px-8 py-8">

          {/* Close */}
          <button onClick={onClose} className="close-btn absolute top-4 right-4 w-8 h-8 rounded-lg">
            <X size={15} />
          </button>

          {/* Header */}
          <div className="text-center mb-7">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}
            >
              <Shield size={22} style={{ color: "#b8893a" }} />
            </div>

            <h2 className="modal-heading font-normal text-[1.6rem] leading-tight mb-1.5" style={{ color: "#1e1a14" }}>
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-[13px] font-light" style={{ color: "#7a6d5e" }}>
              {isLogin
                ? "Sign in to your E-Certify account"
                : "Join the decentralized certificate platform"}
            </p>
          </div>

          {/* Role toggle */}
          <div className="role-track flex mb-6">
            {(["student", "institute"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`role-btn flex-1 ${role === r ? "active" : ""}`}
              >
                {r === "student" ? <GraduationCap size={14} /> : <Building2 size={14} />}
                {r === "student" ? "Student" : "Institute"}
              </button>
            ))}
          </div>

          {/* Email input */}
          <div className="auth-input-wrap mb-3">
            <Mail size={15} className="auth-input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="auth-input"
              onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
            />
          </div>

          {/* Password input */}
          <div className="auth-input-wrap mb-5">
            <Lock size={15} className="auth-input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="auth-input"
              onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-4 text-sm"
              style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)", color: "#b91c1c" }}
            >
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="font-light leading-snug">{error}</p>
            </div>
          )}

          {/* Primary CTA */}
          <button
            onClick={handleEmailAuth}
            disabled={loading || !email || !password}
            className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 mb-5"
          >
            {loading ? (
              <><span className="spin" /> Processing…</>
            ) : (
              <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight size={14} /></>
            )}
          </button>

          {/* Divider */}
          <div className="or-divider mb-5">or</div>

          {/* Google */}
          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="btn-google w-full py-3 rounded-xl"
          >
            {/* Google SVG */}
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Switch mode */}
          <p className="text-center text-[13px] font-light mt-5" style={{ color: "#7a6d5e" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="switch-link" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
              {isLogin ? "Create one" : "Sign in"}
            </span>
          </p>

        </div>
      </div>
    </>
  );
}