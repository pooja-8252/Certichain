import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const metadata = {
  title: "Certi-Chain",
  description: "Blockchain Certificate Verification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: "#f9f5ef", color: "#1e1a14" }}>
        <AuthProvider>
          <Navbar />
          <main className="pt-20 px-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}