import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="mt-16 flex-grow">
          {children}
        </main>
          <Footer />
      </div>
  );
}
