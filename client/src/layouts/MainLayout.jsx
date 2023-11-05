import Header from "../components/Header.jsx";
import Logo from "../components/Logo.jsx";
import MenuModal from "../components/MenuModal.jsx";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen sm:max-w-[600px] mx-auto relative">
      <div className="fixed right-8 sm:right-28 top-8">
        <MenuModal />
      </div>
      <div className="fixed left-8 sm:left-28 top-7">
        <Logo />
      </div>
      <div className="fixed bottom-0 left-0 right-0 text-center sm:sticky sm:top-0">
        <Header />
      </div>
      { children }
    </div>
  );
}

export default MainLayout;
