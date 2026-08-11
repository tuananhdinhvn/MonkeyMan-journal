import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Monkey Man",
    template: "%s | Monkey Man",
  },
  description: "Personal portfolio & blog of Monkey Man.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6">
          <header className="flex items-center justify-between py-8">
            <a href="/" className="font-semibold">
              Monkey Man
            </a>
            <nav className="flex gap-6 text-sm">
              <a href="/">Home</a>
              <a href="/blog">Blog</a>
              <a href="/#contact">Contact</a>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="py-10 text-sm text-neutral-500">
            © {new Date().getFullYear()} Monkey Man
          </footer>
        </div>
      </body>
    </html>
  );
}
