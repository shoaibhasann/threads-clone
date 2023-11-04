import Logo from "./header/Logo.jsx";
import MenuModal from "./header/MenuModal.jsx";

function MainLayout() {
  return (
    <div className="bg-light-background dark:bg-dark-background min-h-screen">
      <div className="absolute right-8 sm:right-28 top-8">
        <MenuModal />
      </div>
      <div className="absolute left-8 sm:left-28 top-7">
        <Logo />
      </div>
    </div>
  );
}

export default MainLayout