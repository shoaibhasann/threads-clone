
function CreateThread() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
      <div className="bg-white rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold mb-4">Modal Title</h2>
        <p className="text-gray-700 mb-4">Modal content goes here.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
}

export default CreateThread