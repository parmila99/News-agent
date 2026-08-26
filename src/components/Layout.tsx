import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BreakingNewsTicker from "./BreakingNewsTicker";
import BottomMobileNav from "./BottomMobileNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans selection:bg-[#AA0000] selection:text-white">
      <Header />
      <BreakingNewsTicker />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <BottomMobileNav />
    </div>
  );
}
