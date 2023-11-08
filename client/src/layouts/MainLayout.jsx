
import Header from "../components/Header.jsx";
import Logo from "../components/Logo.jsx";
import MenuModal from "../components/MenuModal.jsx";

function MainLayout({ children }) {


  return (
    <div className="min-h-screen sm:max-w-[600px] mx-auto relative">
      <div className="sticky top-0 left-0 sm:hidden">
        <div className="flex items-center justify-between py-4 px-4">
          <Logo />
          <MenuModal />
        </div>
      </div>
      <div className="opacity-0 sm:opacity-100 sm:fixed sm:right-28 sm:top-8">
        <MenuModal />
      </div>
      <div className="opacity-0 sm:opacity-100 sm:fixed sm:left-28 sm:top-7">
        <Logo />
      </div>
      <div className="fixed bottom-0 left-0 right-0 text-center sm:sticky sm:top-0 z-50 transition duration-300">
        <Header />
      </div>
      {children}
    </div>
  );
}

export default MainLayout;
