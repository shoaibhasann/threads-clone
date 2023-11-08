import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-dark-background h-screen flex justify-center items-center flex-col gap-4">
      <img className="w-32 object-cover" src="/notfound.png" alt="Not-Found" />
      <h1 className="text-3xl text-white">
        Page Not Found <span className="animate-pulse">⛔</span>
      </h1>
      <button onClick={() => navigate(-1)} className="rounded-3xl bg-white text-black font-semibold px-6 py-2">Go Back</button>
    </div>
  );
}

export default NotFound;