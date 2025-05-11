"use client";

type Props = {
  documents: string[];
  selected: string;
  onSelect: (doc: string) => void;
};

export default function DocSidebar({ documents, selected, onSelect }: Props) {
  return (
    <aside className="w-64 h-full border-r bg-[#f3e5ab] p-4">
      <h3 className="font-semibold text-[#4e342e] mb-4">📄 Documents</h3>
      <ul className="space-y-2 text-sm text-[#3e2723]">
        {documents.map((doc) => (
          <li
            key={doc}
            onClick={() => onSelect(doc)}
            className={`cursor-pointer px-3 py-2 rounded hover:bg-[#efebe9] ${
              selected === doc ? "bg-[#d7ccc8] font-medium" : ""
            }`}
          >
            {doc}
          </li>
        ))}
      </ul>
    </aside>
  );
}
