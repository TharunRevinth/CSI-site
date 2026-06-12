"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GRID_SIZE = 20;

type GameMode = "MENU" | "SNAKE" | "TETRIS" | "INVADERS" | "PONG" | "RUNNER";

interface Position { x: number; y: number }
interface Invader { x: number; y: number; alive: boolean }
interface Bullet { x: number; y: number }
interface Obstacle { lane: number; y: number }

export function Arcade() {
  const [gameMode, setGameMode] = useState<GameMode>("MENU");
  const [menuIndex, setMenuIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Input references for key triggers
  const keysPressed = useRef<Record<string, boolean>>({});

  // Menu items list
  const MENU_ITEMS = [
    { id: "SNAKE", label: "🟢 CSI SNAKE" },
    { id: "TETRIS", label: "🧱 NEON TETRIS" },
    { id: "INVADERS", label: "👾 MATRIX INVADERS" },
    { id: "PONG", label: "🏓 CYBER PONG" },
    { id: "RUNNER", label: "🚀 CYBER RUNNER" }
  ];

  // Load high scores from localStorage
  useEffect(() => {
    const loadedScores: Record<string, number> = {};
    MENU_ITEMS.forEach(item => {
      const saved = localStorage.getItem(`csi_arcade_high_${item.id.toLowerCase()}`);
      loadedScores[item.id] = saved ? parseInt(saved, 10) : 0;
    });
    setHighScores(loadedScores);
  }, []);

  const updateHighScore = (mode: GameMode, newScore: number) => {
    const currentHigh = highScores[mode] || 0;
    if (newScore > currentHigh) {
      setHighScores(prev => ({ ...prev, [mode]: newScore }));
      localStorage.setItem(`csi_arcade_high_${mode.toLowerCase()}`, newScore.toString());
    }
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scroll on arrows/space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      keysPressed.current[e.key] = true;

      if (e.key === "Escape") {
        setGameMode("MENU");
        setIsPlaying(false);
        setIsGameOver(false);
        setScore(0);
        return;
      }

      if (gameMode === "MENU") {
        switch (e.key) {
          case "ArrowUp":
            setMenuIndex(prev => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
            break;
          case "ArrowDown":
            setMenuIndex(prev => (prev + 1) % MENU_ITEMS.length);
            break;
          case "Enter":
            const selectedMode = MENU_ITEMS[menuIndex].id as GameMode;
            setGameMode(selectedMode);
            setIsGameOver(false);
            setIsPlaying(false);
            break;
        }
      } else if (!isPlaying && !isGameOver) {
        if (e.key === "Enter") {
          startGame();
        }
      } else if (isGameOver) {
        if (e.key === "Enter") {
          startGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameMode, menuIndex, isPlaying, isGameOver]);

  // Game engine variables
  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const snakeDir = useRef<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const foodRef = useRef<Position>({ x: 5, y: 5 });

  // Tetris state
  const tetrisGrid = useRef<number[][]>([]);
  const currentPiece = useRef<{ matrix: number[][]; x: number; y: number }>({ matrix: [], x: 0, y: 0 });
  const tetrisTickCounter = useRef(0);

  // Invaders state
  const playerX = useRef(200);
  const invadersList = useRef<Invader[]>([]);
  const invaderDir = useRef(1); // 1 = right, -1 = left
  const bulletsList = useRef<Bullet[]>([]);
  const lastShot = useRef(0);

  // Pong state
  const pongBall = useRef({ x: 200, y: 200, vx: 3, vy: 2 });
  const paddlePlayerY = useRef(160);
  const paddleCpuY = useRef(160);

  // Runner state
  const runnerLane = useRef(1); // 0 = Left, 1 = Center, 2 = Right
  const runnerObstacles = useRef<Obstacle[]>([]);
  const runnerTickCounter = useRef(0);

  const startGame = () => {
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);

    const canvas = canvasRef.current;
    const w = canvas?.width || 400;
    const h = canvas?.height || 400;

    if (gameMode === "SNAKE") {
      snakeRef.current = [{ x: 10, y: 10 }];
      snakeDir.current = "RIGHT";
      foodRef.current = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } else if (gameMode === "TETRIS") {
      // 10 width, 20 height
      tetrisGrid.current = Array.from({ length: 20 }, () => Array(10).fill(0));
      spawnTetrisPiece();
      tetrisTickCounter.current = 0;
    } else if (gameMode === "INVADERS") {
      playerX.current = w / 2;
      bulletsList.current = [];
      invaderDir.current = 1;
      invadersList.current = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
          invadersList.current.push({ x: 40 + c * 40, y: 50 + r * 30, alive: true });
        }
      }
    } else if (gameMode === "PONG") {
      pongBall.current = { x: 200, y: 200, vx: Math.random() > 0.5 ? 3.5 : -3.5, vy: (Math.random() - 0.5) * 4 };
      paddlePlayerY.current = 160;
      paddleCpuY.current = 160;
    } else if (gameMode === "RUNNER") {
      runnerLane.current = 1;
      runnerObstacles.current = [];
      runnerTickCounter.current = 0;
    }
  };

  // Tetris piece helper
  const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]]  // S
  ];

  const spawnTetrisPiece = () => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    currentPiece.current = {
      matrix: shape,
      x: 5 - Math.floor(shape[0].length / 2),
      y: 0
    };
    // If it instantly collides, Game Over
    if (checkTetrisCollision(0, 0, shape)) {
      setIsPlaying(false);
      setIsGameOver(true);
    }
  };

  const checkTetrisCollision = (ax: number, ay: number, matrix: number[][]) => {
    const p = currentPiece.current;
    const grid = tetrisGrid.current;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const nextX = p.x + c + ax;
          const nextY = p.y + r + ay;
          if (nextX < 0 || nextX >= 10 || nextY >= 20) return true;
          if (nextY >= 0 && grid[nextY][nextX] !== 0) return true;
        }
      }
    }
    return false;
  };

  const rotateMatrix = (matrix: number[][]) => {
    const n = matrix.length;
    const m = matrix[0].length;
    const result = Array.from({ length: m }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < m; c++) {
        result[c][n - 1 - r] = matrix[r][c];
      }
    }
    return result;
  };

  const mergeTetrisPiece = () => {
    const p = currentPiece.current;
    const grid = tetrisGrid.current;
    for (let r = 0; r < p.matrix.length; r++) {
      for (let c = 0; c < p.matrix[r].length; c++) {
        if (p.matrix[r][c] !== 0) {
          const gridY = p.y + r;
          const gridX = p.x + c;
          if (gridY >= 0) grid[gridY][gridX] = 1;
        }
      }
    }

    // Line clearing
    let linesCleared = 0;
    for (let r = 20 - 1; r >= 0; r--) {
      if (grid[r].every(val => val !== 0)) {
        grid.splice(r, 1);
        grid.unshift(Array(10).fill(0));
        linesCleared++;
        r++; // check this row again
      }
    }

    if (linesCleared > 0) {
      setScore(s => {
        const reward = linesCleared === 4 ? 800 : linesCleared * 100;
        const nextScore = s + reward;
        updateHighScore("TETRIS", nextScore);
        return nextScore;
      });
    }

    spawnTetrisPiece();
  };

  // Main game tick update loop (60 FPS rendering + discrete updates)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let snakeTimer = 0;

    const gameLoop = (timestamp: number) => {
      // Clear screen
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameMode === "MENU") {
        drawMenu();
      } else if (!isPlaying) {
        drawPreGame();
      } else {
        // Active gameplay updates
        updatePhysics(timestamp);
        drawGame();
      }

      frameId = requestAnimationFrame(gameLoop);
    };

    const drawMenu = () => {
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = "#39ff14";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#39ff14";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CSI MULTI-ARCADE", canvas.width / 2, 80);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(57, 255, 20, 0.4)";
      ctx.font = "12px monospace";
      ctx.fillText("[USE ARROW KEYS & ENTER TO PLAY]", canvas.width / 2, 110);

      // Menu options
      ctx.textAlign = "left";
      ctx.font = "16px monospace";
      MENU_ITEMS.forEach((item, idx) => {
        const isSelected = idx === menuIndex;
        ctx.fillStyle = isSelected ? "#39ff14" : "rgba(57, 255, 20, 0.5)";
        if (isSelected) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#39ff14";
        }
        const cursor = isSelected ? " > " : "   ";
        const highVal = highScores[item.id] || 0;
        ctx.fillText(`${cursor}${item.label} (HI: ${highVal})`, 80, 170 + idx * 40);
        ctx.shadowBlur = 0;
      });
    };

    const drawPreGame = () => {
      ctx.fillStyle = "rgba(57, 255, 20, 0.8)";
      ctx.textAlign = "center";
      ctx.font = "bold 20px monospace";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#39ff14";

      if (isGameOver) {
        ctx.fillStyle = "#ff0055";
        ctx.shadowColor = "#ff0055";
        ctx.fillText("GAME OVER", canvas.width / 2, 160);
        ctx.fillStyle = "#39ff14";
        ctx.shadowColor = "#39ff14";
        ctx.font = "16px monospace";
        ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, 200);
        ctx.fillText("PRESS ENTER TO RESTART", canvas.width / 2, 240);
        ctx.font = "12px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText("PRESS ESC TO RETURN TO MENU", canvas.width / 2, 280);
      } else {
        ctx.fillText(`START ${gameMode}`, canvas.width / 2, 160);
        ctx.font = "16px monospace";
        ctx.fillText("PRESS ENTER TO START", canvas.width / 2, 210);
        ctx.font = "12px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText("PRESS ESC TO RETURN TO MENU", canvas.width / 2, 260);
      }
      ctx.shadowBlur = 0;
    };

    const updatePhysics = (timestamp: number) => {
      if (gameMode === "SNAKE") {
        snakeTimer++;
        if (snakeTimer >= 6) { // Every 6 frames (discrete tick rate)
          snakeTimer = 0;
          updateSnake();
        }
      } else if (gameMode === "TETRIS") {
        updateTetris();
      } else if (gameMode === "INVADERS") {
        updateInvaders(timestamp);
      } else if (gameMode === "PONG") {
        updatePong();
      } else if (gameMode === "RUNNER") {
        updateRunner();
      }
    };

    // Game Specific Updates
    const updateSnake = () => {
      // Keyboard input capture
      if (keysPressed.current["ArrowUp"] && snakeDir.current !== "DOWN") snakeDir.current = "UP";
      if (keysPressed.current["ArrowDown"] && snakeDir.current !== "UP") snakeDir.current = "DOWN";
      if (keysPressed.current["ArrowLeft"] && snakeDir.current !== "RIGHT") snakeDir.current = "LEFT";
      if (keysPressed.current["ArrowRight"] && snakeDir.current !== "LEFT") snakeDir.current = "RIGHT";

      const snakeArr = snakeRef.current;
      const head = { ...snakeArr[0] };

      switch (snakeDir.current) {
        case "UP": head.y -= 1; break;
        case "DOWN": head.y += 1; break;
        case "LEFT": head.x -= 1; break;
        case "RIGHT": head.x += 1; break;
      }

      // Border collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsPlaying(false);
        setIsGameOver(true);
        return;
      }

      // Self collision
      for (let segment of snakeArr) {
        if (segment.x === head.x && segment.y === head.y) {
          setIsPlaying(false);
          setIsGameOver(true);
          return;
        }
      }

      const newSnake = [head, ...snakeArr];

      // Food eating
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => {
          const nextScore = s + 10;
          updateHighScore("SNAKE", nextScore);
          return nextScore;
        });
        foodRef.current = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
    };

    const updateTetris = () => {
      tetrisTickCounter.current++;
      const p = currentPiece.current;

      // Handle horizontal moves (only on discrete keydown, throttle it slightly)
      if (keysPressed.current["ArrowLeft"]) {
        keysPressed.current["ArrowLeft"] = false; // consume
        if (!checkTetrisCollision(-1, 0, p.matrix)) p.x -= 1;
      }
      if (keysPressed.current["ArrowRight"]) {
        keysPressed.current["ArrowRight"] = false; // consume
        if (!checkTetrisCollision(1, 0, p.matrix)) p.x += 1;
      }
      if (keysPressed.current["ArrowUp"]) {
        keysPressed.current["ArrowUp"] = false; // consume
        const rotated = rotateMatrix(p.matrix);
        if (!checkTetrisCollision(0, 0, rotated)) p.matrix = rotated;
      }

      // Tick drop speed
      const dropThreshold = keysPressed.current["ArrowDown"] ? 3 : 25;
      if (tetrisTickCounter.current >= dropThreshold) {
        tetrisTickCounter.current = 0;
        if (!checkTetrisCollision(0, 1, p.matrix)) {
          p.y += 1;
        } else {
          mergeTetrisPiece();
        }
      }
    };

    const updateInvaders = (timestamp: number) => {
      // Move Player
      if (keysPressed.current["ArrowLeft"] && playerX.current > 20) playerX.current -= 4;
      if (keysPressed.current["ArrowRight"] && playerX.current < canvas.width - 20) playerX.current += 4;

      // Shoot
      if ((keysPressed.current[" "] || keysPressed.current["ArrowUp"]) && timestamp - lastShot.current > 350) {
        bulletsList.current.push({ x: playerX.current, y: canvas.height - 35 });
        lastShot.current = timestamp;
      }

      // Update Bullets
      bulletsList.current = bulletsList.current
        .map(b => ({ ...b, y: b.y - 6 }))
        .filter(b => b.y > 0);

      // Update Invaders
      let edgeReached = false;
      const invaders = invadersList.current;
      invaders.forEach(inv => {
        if (!inv.alive) return;
        inv.x += invaderDir.current * 0.8;
        if (inv.x < 15 || inv.x > canvas.width - 15) {
          edgeReached = true;
        }
      });

      if (edgeReached) {
        invaderDir.current *= -1;
        invaders.forEach(inv => {
          if (inv.alive) inv.y += 15;
        });
      }

      // Check bullet invader collisions
      bulletsList.current.forEach((bullet, bIdx) => {
        invaders.forEach(inv => {
          if (inv.alive && Math.abs(bullet.x - inv.x) < 16 && Math.abs(bullet.y - inv.y) < 12) {
            inv.alive = false;
            bulletsList.current.splice(bIdx, 1);
            setScore(s => {
              const nextScore = s + 30;
              updateHighScore("INVADERS", nextScore);
              return nextScore;
            });
          }
        });
      });

      // All invaders cleared check
      if (invaders.length > 0 && invaders.every(inv => !inv.alive)) {
        // Respawn next level
        setScore(s => s + 200);
        invaderDir.current = 1;
        invadersList.current = [];
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 8; c++) {
            invadersList.current.push({ x: 40 + c * 40, y: 50 + r * 30, alive: true });
          }
        }
        return;
      }

      // Invader reach bottom or hit player
      invaders.forEach(inv => {
        if (inv.alive && (inv.y > canvas.height - 50)) {
          setIsPlaying(false);
          setIsGameOver(true);
        }
      });
    };

    const updatePong = () => {
      const ball = pongBall.current;
      
      // Move paddles
      if (keysPressed.current["ArrowUp"] && paddlePlayerY.current > 10) paddlePlayerY.current -= 5;
      if (keysPressed.current["ArrowDown"] && paddlePlayerY.current < canvas.height - 90) paddlePlayerY.current += 5;

      // CPU Simple AI
      const cpuSpeed = 3.5;
      const targetY = ball.y - 40;
      if (paddleCpuY.current < targetY && paddleCpuY.current < canvas.height - 90) paddleCpuY.current += cpuSpeed;
      if (paddleCpuY.current > targetY && paddleCpuY.current > 10) paddleCpuY.current -= cpuSpeed;

      // Ball physics update
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Ball ceiling/floor collision
      if (ball.y < 10 || ball.y > canvas.height - 10) {
        ball.vy *= -1;
      }

      // Ball paddle collision
      // Player paddle (Left: x = 20)
      if (ball.vx < 0 && ball.x > 15 && ball.x < 30) {
        if (ball.y >= paddlePlayerY.current && ball.y <= paddlePlayerY.current + 80) {
          ball.vx *= -1.05; // speed up slightly on hit
          // change angle based on hit location
          const offset = (ball.y - (paddlePlayerY.current + 40)) / 40;
          ball.vy = offset * 4.5;
        }
      }

      // CPU paddle (Right: x = width - 30)
      if (ball.vx > 0 && ball.x > canvas.width - 30 && ball.x < canvas.width - 15) {
        if (ball.y >= paddleCpuY.current && ball.y <= paddleCpuY.current + 80) {
          ball.vx *= -1.05;
          const offset = (ball.y - (paddleCpuY.current + 40)) / 40;
          ball.vy = offset * 4.5;
        }
      }

      // Score check
      if (ball.x < 0) {
        // CPU scored - game over for player in solo mode
        setIsPlaying(false);
        setIsGameOver(true);
      } else if (ball.x > canvas.width) {
        // Player scored
        setScore(s => {
          const nextScore = s + 50;
          updateHighScore("PONG", nextScore);
          return nextScore;
        });
        // reset ball
        pongBall.current = { x: 200, y: 200, vx: -3.5, vy: (Math.random() - 0.5) * 4 };
      }
    };

    const updateRunner = () => {
      runnerTickCounter.current++;

      // Move player lanes
      if (keysPressed.current["ArrowLeft"]) {
        keysPressed.current["ArrowLeft"] = false; // consume
        if (runnerLane.current > 0) runnerLane.current -= 1;
      }
      if (keysPressed.current["ArrowRight"]) {
        keysPressed.current["ArrowRight"] = false; // consume
        if (runnerLane.current < 2) runnerLane.current += 1;
      }

      // Spawn obstacle
      if (runnerTickCounter.current % 40 === 0) {
        runnerObstacles.current.push({
          lane: Math.floor(Math.random() * 3),
          y: -20
        });
      }

      // Move obstacles
      const obstacleSpeed = 4 + Math.floor(score / 200);
      runnerObstacles.current.forEach(obs => {
        obs.y += obstacleSpeed;
      });

      // Remove out of bounds obstacles
      runnerObstacles.current = runnerObstacles.current.filter(obs => {
        if (obs.y > canvas.height) {
          setScore(s => {
            const nextScore = s + 10;
            updateHighScore("RUNNER", nextScore);
            return nextScore;
          });
          return false;
        }
        return true;
      });

      // Collision detection
      const laneWidth = canvas.width / 3;
      const playerY = canvas.height - 60;
      
      runnerObstacles.current.forEach(obs => {
        if (obs.lane === runnerLane.current && obs.y > playerY - 20 && obs.y < playerY + 30) {
          setIsPlaying(false);
          setIsGameOver(true);
        }
      });
    };

    // Drawing Game Views
    const drawGame = () => {
      if (gameMode === "SNAKE") {
        drawSnakeGame();
      } else if (gameMode === "TETRIS") {
        drawTetrisGame();
      } else if (gameMode === "INVADERS") {
        drawInvadersGame();
      } else if (gameMode === "PONG") {
        drawPongGame();
      } else if (gameMode === "RUNNER") {
        drawRunnerGame();
      }
    };

    const drawSnakeGame = () => {
      const cellW = canvas.width / GRID_SIZE;
      const cellH = canvas.height / GRID_SIZE;

      // Draw grid
      ctx.strokeStyle = "rgba(57, 255, 20, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, canvas.height); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellH); ctx.lineTo(canvas.width, i * cellH); ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = "#ff0055";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ff0055";
      ctx.fillRect(foodRef.current.x * cellW + 2, foodRef.current.y * cellH + 2, cellW - 4, cellH - 4);
      ctx.shadowBlur = 0;

      // Draw snake
      snakeRef.current.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? "#39ff14" : "#1fbc0a";
        ctx.shadowBlur = idx === 0 ? 10 : 0;
        ctx.shadowColor = "#39ff14";
        ctx.fillRect(segment.x * cellW + 1, segment.y * cellH + 1, cellW - 2, cellH - 2);
      });
      ctx.shadowBlur = 0;
    };

    const drawTetrisGame = () => {
      const cellW = canvas.width / 20; // smaller grid
      const startX = canvas.width / 2 - 5 * cellW; // centered
      const startY = 0;

      // Draw border
      ctx.strokeStyle = "#39ff14";
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, 10 * cellW, 20 * cellW);

      // Draw Grid elements
      const grid = tetrisGrid.current;
      ctx.fillStyle = "rgba(57, 255, 20, 0.5)";
      for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 10; c++) {
          if (grid[r] && grid[r][c] !== 0) {
            ctx.fillRect(startX + c * cellW + 1, startY + r * cellW + 1, cellW - 2, cellW - 2);
          }
        }
      }

      // Draw active piece
      const p = currentPiece.current;
      ctx.fillStyle = "#39ff14";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#39ff14";
      for (let r = 0; r < p.matrix.length; r++) {
        for (let c = 0; c < p.matrix[r].length; c++) {
          if (p.matrix[r][c] !== 0) {
            ctx.fillRect(startX + (p.x + c) * cellW + 1, startY + (p.y + r) * cellW + 1, cellW - 2, cellW - 2);
          }
        }
      }
      ctx.shadowBlur = 0;
    };

    const drawInvadersGame = () => {
      // Player ship
      ctx.fillStyle = "#39ff14";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#39ff14";
      ctx.beginPath();
      ctx.moveTo(playerX.current, canvas.height - 35);
      ctx.lineTo(playerX.current - 12, canvas.height - 15);
      ctx.lineTo(playerX.current + 12, canvas.height - 15);
      ctx.closePath();
      ctx.fill();

      // Draw Bullets
      ctx.fillStyle = "#ff0055";
      ctx.shadowColor = "#ff0055";
      bulletsList.current.forEach(bullet => {
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 12);
      });

      // Draw Invaders
      ctx.fillStyle = "#3b82f6";
      ctx.shadowColor = "#3b82f6";
      invadersList.current.forEach(inv => {
        if (!inv.alive) return;
        // Renders alien grid block
        ctx.fillRect(inv.x - 10, inv.y - 8, 20, 16);
        // Antennas
        ctx.fillRect(inv.x - 6, inv.y - 12, 4, 4);
        ctx.fillRect(inv.x + 2, inv.y - 12, 4, 4);
      });
      ctx.shadowBlur = 0;
    };

    const drawPongGame = () => {
      // Paddles
      ctx.fillStyle = "#39ff14";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#39ff14";
      
      // Player
      ctx.fillRect(15, paddlePlayerY.current, 10, 80);
      // CPU
      ctx.fillRect(canvas.width - 25, paddleCpuY.current, 10, 80);

      // Ball
      ctx.fillStyle = "#ff0055";
      ctx.shadowColor = "#ff0055";
      ctx.fillRect(pongBall.current.x - 5, pongBall.current.y - 5, 10, 10);
      
      ctx.shadowBlur = 0;
    };

    const drawRunnerGame = () => {
      const laneWidth = canvas.width / 3;

      // Draw Lane markers
      ctx.strokeStyle = "rgba(57, 255, 20, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(laneWidth, 0); ctx.lineTo(laneWidth, canvas.height);
      ctx.moveTo(laneWidth * 2, 0); ctx.lineTo(laneWidth * 2, canvas.height);
      ctx.stroke();

      // Draw Player runner
      ctx.fillStyle = "#39ff14";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#39ff14";
      const px = laneWidth * runnerLane.current + laneWidth / 2;
      ctx.beginPath();
      ctx.arc(px, canvas.height - 60, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw Obstacles
      ctx.fillStyle = "#ff0055";
      ctx.shadowColor = "#ff0055";
      runnerObstacles.current.forEach(obs => {
        const ox = laneWidth * obs.lane + laneWidth / 2;
        ctx.fillRect(ox - 15, obs.y - 15, 30, 30);
      });
      ctx.shadowBlur = 0;
    };

    frameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(frameId);
  }, [gameMode, menuIndex, isPlaying, isGameOver, score, highScores]);

  return (
    <div 
      style={{
        width: "100%",
        height: "100%",
        background: "#08080a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "monospace",
        color: "#39ff14"
      }}
    >
      {/* Dashboard */}
      <div 
        style={{
          width: "400px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
          fontSize: "1rem",
          textShadow: "0 0 8px rgba(57, 255, 20, 0.4)",
          borderBottom: "1px solid rgba(57, 255, 20, 0.2)",
          paddingBottom: "8px"
        }}
      >
        <div>
          {gameMode === "MENU" ? "MULTIPLAYER ARCADE" : `${gameMode} MODE`}
        </div>
        {gameMode !== "MENU" && (
          <div>
            SCORE: {score} | HI: {highScores[gameMode] || 0}
          </div>
        )}
      </div>

      {/* Screen Frame */}
      <div 
        style={{
          position: "relative",
          width: "400px",
          height: "400px",
          border: "4px solid #1f2937",
          boxShadow: "0 0 20px rgba(0, 255, 0, 0.15), inset 0 0 10px rgba(0, 255, 0, 0.1)",
          background: "#09090b",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          style={{ display: "block" }} 
        />
      </div>

      {/* Controller Guide */}
      <div 
        style={{ 
          marginTop: "16px", 
          fontSize: "0.8rem", 
          color: "rgba(57, 255, 20, 0.5)",
          textAlign: "center"
        }}
      >
        {gameMode === "MENU" 
          ? "[ARROW KEYS TO NAVIGATE • ENTER TO SELECT]"
          : "[ARROW KEYS TO MOVE • ESC TO MENU]"
        }
      </div>
    </div>
  );
}
