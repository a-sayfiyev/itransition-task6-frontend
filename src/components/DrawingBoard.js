import React, { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import Toolbar from "./Toolbar";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import "./drawingboard.css";
import "bootstrap/dist/css/bootstrap.css";

const DrawingBoard = ({ boardId }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const socketRef = useRef(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("black");
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState("white");

  useEffect(() => {
    socketRef.current = io("https://itransition-task6-backend.onrender.com");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (boardId) {
      fetchBoardAndDrawings(boardId);
    }
  }, [boardId]);

  const fetchBoardAndDrawings = async (boardId) => {
    try {
      const response = await fetch(`https://itransition-task6-backend.onrender.com/drawings/${boardId}`);
      const drawings = await response.json();
      drawings.forEach(drawLine);
    } catch (error) {
      console.error("Error fetching drawings:", error);
    }
  };

const drawLine = ({ x1, y1, x2, y2, color, tool }) => {
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");

  context.globalCompositeOperation =
    tool === "eraser" ? "destination-out" : "source-over";

  context.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : color;
  context.lineWidth = getLineWidth(tool);
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
};

  const getLineWidth = (tool) => {
    switch (tool) {
      case "pen":
        return 2;
      case "marker":
        return 5;
      case "brush":
        return 10;
      case "highlighter":
        return 15;
      default:
        return 2;
    }
  };

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setLastPosition({ x, y });
  };

const draw = (e) => {
  if (!isDrawing) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const context = canvasRef.current.getContext("2d");

  context.globalCompositeOperation =
    tool === "eraser" ? "destination-out" : "source-over";

  context.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : color;
  context.lineWidth = getLineWidth(tool);
  context.beginPath();
  context.moveTo(lastPosition.x, lastPosition.y);
  context.lineTo(x, y);
  context.stroke();

  debounceUpdateDrawing({
    boardId,
    x1: lastPosition.x,
    y1: lastPosition.y,
    x2: x,
    y2: y,
    color: tool === "eraser" ? "white" : color,
    tool,
  });

  setLastPosition({ x, y });
};


  const debounceUpdateDrawing = useCallback(
    debounce((drawing) => {
      socketRef.current.emit("draw", drawing);
    }, 10),
    [socketRef.current]
  );

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    draw(e);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    socketRef.current.emit("clearBoard", { boardId });
  }, [boardId]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on("draw", drawLine);

    socket.on("clear", () => {
      clearCanvas();
    });

    return () => {
      socket.off("draw", drawLine);
      socket.off("clear");
    };
  }, [clearCanvas]);

  return (
    <div className="drawing-board d-flex flex-column align-items-center justify-content-center">
      <h1 className="title-login text-center text-white">Drawing Board</h1>
      <button className="login-btn save-btn mb-1" onClick={() => navigate("/boards")}>Go Back</button>
      <Toolbar
        onToolChange={setTool}
        onColorChange={setColor}
        onBackgroundChange={(color) => {
          setCurrentBackgroundColor(color);
          canvasRef.current.style.background = color;
        }}
        onClear={clearCanvas}
      />
      <canvas
        ref={canvasRef}
        width={1200}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        style={{
          border: "1px solid black",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default DrawingBoard;