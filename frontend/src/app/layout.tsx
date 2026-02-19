// import "./globals.css";
// import Navbar from "@/components/Navbar";

// export const metadata = {
//   title: "E-Certify",
//   description: "Blockchain Certificate Verification"
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//   <body className="min-h-screen bg-slate-950 text-white">
//   <Navbar />
//   <main className="pt-32 px-4">
//     {children}
//   </main>


// </body>

//     </html>
//   );
// }




import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const metadata = {
  title: "E-Certify",
  description: "Blockchain Certificate Verification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white">
        <AuthProvider>
          <Navbar />
          <main className="pt-32 px-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
