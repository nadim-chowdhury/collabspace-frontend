const ChatPage = () => {
  return (
    <div className="flex flex-col h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Team Chat</h1>
      <div className="flex-1 overflow-y-auto space-y-2 bg-gray-50 p-4 rounded">
        {["Hello!", "Hi there!", "How's the project going?"]?.map(
          (msg, idx) => (
            <div key={idx} className="bg-white p-3 rounded shadow text-sm">
              {msg}
            </div>
          )
        )}
      </div>
      <div className="mt-4 flex">
        <input
          className="flex-1 p-3 border border-gray-300 rounded-l-md"
          placeholder="Type your message..."
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
