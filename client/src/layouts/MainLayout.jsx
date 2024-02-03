
import Header from "../components/Header.jsx";
import Logo from "../components/Logo.jsx";
import MenuModal from "../components/MenuModal.jsx";

function MainLayout({ children, className }) {


  return (
    <div className={`min-h-screen sm:max-w-[600px] mx-auto overflow-hidden ${className}`}>
      <div className="absolute sm:fixed top-7 left-7">
        <Logo />
      </div>
      <div className="fixed top-8 right-7 z-50">
        <MenuModal />
      </div>
      <div className="fixed bottom-0 left-0 right-0 sm:sticky sm:top-0 sm:left-0 z-10">
        <Header />
      </div>
      <div className="pt-20 sm:pt-0">{children}</div>
    </div>
  );
}

export default MainLayout;
