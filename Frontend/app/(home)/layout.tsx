import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
//import DevelopmentPopup from "@/components/home/DevelopmentPopup";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
        <Navbar />

        {/* <DevelopmentPopup /> */}
        
        <main className="mt-16 flex-grow">
          {children}
        </main>
          <Footer />
      </div>
  );
}
