const MeetPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Video Meet</h1>
      <div className="grid grid-cols-2 gap-4">
        {["You", "Teammate"].map((user) => (
          <div
            key={user}
            className="w-full h-[300px] bg-black text-white flex items-center justify-center rounded-lg"
          >
            {user}&apos;s Video
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetPage;
