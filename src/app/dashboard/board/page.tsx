const BoardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task Board</h1>
      <div className="grid grid-cols-3 gap-4">
        {["To Do", "In Progress", "Done"].map((col) => (
          <div key={col} className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{col}</h2>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-3 bg-white border rounded shadow-sm text-sm"
                >
                  {col} Task {i}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
