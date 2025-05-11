"use client";

export default function Controls() {
  return (
    <div className="flex gap-4 mt-4">
      <button className="bg-red-500 text-white px-4 py-2 rounded-md">
        End
      </button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Mute
      </button>
      <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
        Video
      </button>
    </div>
  );
}
