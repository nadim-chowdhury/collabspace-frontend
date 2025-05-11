"use client";

import { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialData = {
  columns: {
    todo: {
      name: "To Do",
      items: [
        { id: "1", content: "Task 1" },
        { id: "2", content: "Task 2" },
      ],
    },
    inProgress: {
      name: "In Progress",
      items: [{ id: "3", content: "Task 3" }],
    },
    done: {
      name: "Done",
      items: [{ id: "4", content: "Task 4" }],
    },
  },
};

export default function KanbanBoard() {
  const [boardData, setBoardData] = useState(initialData);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = boardData.columns[source.droppableId];
    const destColumn = boardData.columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    if (source.droppableId === destination.droppableId) {
      const [removed] = sourceItems.splice(source.index, 1);
      sourceItems.splice(destination.index, 0, removed);
      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
        },
      });
    } else {
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        },
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trello-Like Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(boardData.columns).map(([columnId, column]) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`bg-[#fbe9e7] rounded-lg p-4 shadow min-h-[300px] border border-[#d7ccc8]`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#3e2723]">
                      {column.name}
                    </h2>
                    <button className="text-[#6d4c41] hover:text-[#3e2723]">
                      <Plus size={18} />
                    </button>
                  </div>
                  {column.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 mb-3 rounded shadow border flex items-center gap-2 text-sm"
                        >
                          <GripVertical size={16} className="text-gray-400" />
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
