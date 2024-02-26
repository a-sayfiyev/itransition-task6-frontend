import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./boardlist.css";
import "bootstrap/dist/css/bootstrap.css";

const BoardList = ({ nickname }) => {
  const [boards, setBoards] = useState([]);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate(); // Use navigate to programmatically change routes

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch("http://localhost:3000/boards");
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const addBoard = async () => {
    try {
      const response = await fetch("http://localhost:3000/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "New Board" }),
      });
      const newBoard = await response.json();
      setBoards([...boards, newBoard]);
    } catch (error) {
      console.error("Error adding board:", error);
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await fetch(`http://localhost:3000/boards/${boardId}`, {
        method: "DELETE",
      });
      setBoards(boards.filter((board) => board._id !== boardId));
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  const startEditing = (boardId, currentName) => {
    setEditingBoardId(boardId);
    setNewBoardName(currentName);
  };

  const updateBoardName = async (boardId) => {
    try {
      const response = await fetch(`http://localhost:3000/boards/${boardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newBoardName }),
      });
      const updatedBoard = await response.json();
      setBoards(
        boards.map((board) => (board._id === boardId ? updatedBoard : board))
      );
      setEditingBoardId(null);
      setNewBoardName("");
    } catch (error) {
      console.error("Error updating board name:", error);
    }
  };

  // This function navigates to the selected board
  const onSelectBoard = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="loginWrapper d-flex flex-column align-items-center justify-content-center">
      <div className="innerWrapper">
        <h1 className="title-login text-white">Welcome, {nickname} !</h1>
        <ul>
          {boards.map((board) => (
            <li className="d-flex justify-content-between align-items-center mt-3" key={board._id}>
              {editingBoardId === board._id ? (
                <>
                  <input
                    className="input-login mb-2 p-1 me-2"
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    aria-label="Edit board name"
                  />
                  <button
                    className="login-btn save-btn"
                    onClick={() => updateBoardName(board._id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  {/* Using onClick with navigate instead of Link's to property for onSelectBoard */}
                  <span
                    onClick={() => onSelectBoard(board._id)}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {board.name}
                  </span>
                  <div className="btns-wrapper">
                    <button
                      className="ms-3 me-1 login-btn edit-btn"
                      onClick={() => startEditing(board._id, board.name)}
                    >
                      Edit
                    </button>
                    <button
                      className="login-btn edit-btn"
                      onClick={() => deleteBoard(board._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <button className="login-btn add-btn" onClick={addBoard}>
          Add Board
        </button>
      </div>
    </div>
  );
};

export default BoardList;