
function NotFound() {
  return (
    <div className="bg-dark-background h-screen flex justify-center items-center flex-col gap-4">
      <img className="w-32 object-cover" src="/notfound.png" alt="Not-Found" />
      <h1 className="text-3xl text-white">
        Page Not Found <span className="animate-pulse">⛔</span>
      </h1>
    </div>
  );
}

export default NotFound;