import { useSelector } from "react-redux";

function Logo() {
  const { themeMode } = useSelector((state) => state?.theme);

  return (
    <div style={{ 
      userSelect: "none",
      WebkitTapHighlightColor: "transparent"
       }}>
      <img
        className="w-8 cursor-pointer hover:scale-110 transition-transform"
        src={themeMode === "dark" ? "/light-logo.svg" : "dark-logo.svg"}
        alt="logo"
      />
    </div>
  );
}

export default Logo;
