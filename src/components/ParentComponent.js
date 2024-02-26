import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BoardList from "./BoardList";
import DrawingBoard from "./DrawingBoard";

function ParentComponent() {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Reset selectedBoard when the user navigates back to the main page
    if (location.pathname === "/") {
      setSelectedBoard(null);
    }
  }, [location]);

  const handleSelectBoard = (boardId) => {
    setSelectedBoard(boardId);
  };

  return (
    <div>
      {selectedBoard ? (
        <DrawingBoard boardId={selectedBoard} />
      ) : (
        <BoardList onSelectBoard={handleSelectBoard} />
      )}
    </div>
  );
}

export default ParentComponent;