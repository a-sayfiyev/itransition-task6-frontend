import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import Login from "./components/Login";
import BoardList from "./components/BoardList";
import DrawingBoard from "./components/DrawingBoard";

function App() {
  const [nickname, setNickname] = useState("");

  const handleLogin = (nickname) => {
    setNickname(nickname);
  };

  const DrawingBoardWrapper = () => {
    const { id: boardId } = useParams();
    return <DrawingBoard boardId={boardId} />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/boards" element={<BoardList nickname={nickname} />} />
        <Route path="/board/:id" element={<DrawingBoardWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;