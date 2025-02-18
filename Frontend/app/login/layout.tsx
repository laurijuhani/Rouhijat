import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login",
  description: "Login to rouhijat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="bg-gray-800">
        {children}
      </body>
    </html>
  );
}
