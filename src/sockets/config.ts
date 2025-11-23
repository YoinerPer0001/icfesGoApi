import { Server, Socket } from "socket.io";
import type Questions from "../models/questionsModel.js";
import { customAlphabet } from "nanoid";
import { ApiResponse } from "../core/responseSchedule.js";
import { FirebaseTokenVerification } from "../middlewares/authFirebase.js";
import type Answers from "../models/answersModel.js";
import { start } from "repl";
import userRepository from "../repository/userRepository.js";
import intentosService, { type IntentosDto } from "../services/intentosService.js";
import questionRepository from "../repository/questionRepository.js";
import simulacrosService from "../services/simulacrosService.js";

interface Room {
  hostId: string;
  simulacro_id: string;
  type: "public" | "private";
  players: Player[];
  questions: Array<Questions>;
  actualQuestionIndex: number;
  state: "pending" | "inProgress" | "finished";
  time: number;
}

interface Player {
  id: string;
  name: string;
  score: number;
  answers?: Array<{
    question_id: string;
    answer_id: string | null;
  }>;
}

export interface GameSocket extends Socket {
  user_id?: string;
  room_code?: string;
}

let rooms = new Map<string, Room>();

// función que registra los eventos de conexión
export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`🟢 Cliente conectado: ${socket.id}`);

    createRoom(io, socket);
    JoinRoomSocket(io, socket);
    LeaveRoom(io, socket);
    getQuestionsRooms(io, socket);
    CheckQuestion(io, socket);
    StartGame(io, socket);

    socket.on("disconnect", async () => {
      console.log(`🔴 Cliente desconectado: ${socket.id}`);

      const roomCode = socket.data.roomCode;
      const uid = socket.data.uid;
      const userName = socket.data.name;

      if (roomCode && uid) {
        await handlePlayerLeave(io, socket, roomCode, uid, userName);
      }
    });
  });
};

//first create the room

function createRoom(io: Server, socket: GameSocket) {
  socket.on("create_room", async (data, callback) => {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const userData = await FirebaseTokenVerification(data.token);
      const user = await userRepository.findByFirebaseId(userData.data?.uid ?? "");

      if (user && userData.data != null) {
        const userName = user?.dataValues.name + " " + user?.dataValues.last_name;
        const uid = userData.data.uid;

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const nanoidLetters = customAlphabet(alphabet, 6);
        const roomCode = nanoidLetters();

        //fetch questions from database
        const simulacro = await simulacrosService.getById(data.simulacro_id)

        if(simulacro.code != 200){
          callback(new ApiResponse(simulacro.code, simulacro.message, null));
          return
        }

        const questions = simulacro.data?.dataValues.questions

        console.log(questions)

        const room: Room = {
          hostId: uid,
          type: data.type || "public", // 'public' o 'private'
          players: [],
          questions: questions ?? [],
          actualQuestionIndex: 0,
          state: "pending",
          time: simulacro.data?.dataValues.time_question,
          simulacro_id: data.simulacro_id,
        };



        const player = {
          id: uid,
          name: userName,
          score: 0,
          answers: [],
        };

        room.players.push(player);

        rooms.set(roomCode, room);

        console.log(room)

        socket.join(roomCode);

        // ✅ Guarda los datos del jugador en el socket
        socket.data.roomCode = roomCode;
        socket.data.uid = uid;
        socket.data.name = userName;

        const dataSend = {
          roomCode,
          numberQuestions: room.questions.length,
          hostId: room.hostId,
          players: room.players,
        };

        callback(new ApiResponse(200, "success", dataSend));
      } else {
        callback(new ApiResponse(403, "Token error", null));
      }
    } catch (error) {
      console.error("Error creating room:", error);
      if (callback) {
        callback(new ApiResponse(500, (error as Error).message, null));
      }
    }
  });
}

export function JoinRoomSocket(io: Server, socket: GameSocket) {
  socket.on("join_server", async (data, callback) => {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      const userData = await FirebaseTokenVerification(data.token);

      if (userData.data == null) {
        callback(new ApiResponse(403, "Token error", null));
        return;
      }

      const userName = userData.data.name;
      const uid = userData.data.uid;

      const player = {
        id: uid,
        name: userName,
        score: 0,
        answers: [],
      };

      const room = rooms.get(data.code);

      if (room) {
        const dataSend = {
          roomCode: data.code,
          hostId: room.hostId,
          players: room.players,
        };

        if (
          room.players.length < 10 &&
          room.state == "pending"
        ) {
          console.log("ENTRO PREMIUM");
          const playerisRegistered = room.players.find((p) => p.id === uid);

          if (playerisRegistered) {
            io.to(data.code).emit("new_joined", {
              roomCode: data.code,
              players: room.players,
            });

            callback(new ApiResponse(201, "success", dataSend));
          } else {
            room.players.push(player);

            socket.join(data.code);

            // ✅ Guarda los datos del jugador en el socket
            socket.data.roomCode = data.code;
            socket.data.uid = uid;
            socket.data.name = userName;

            io.to(data.code).emit("new_joined", {
              roomCode: data.code,
              players: room.players,
            });

            callback(new ApiResponse(201, "success", dataSend));
          }
        } else if (
          room.players.length < 2 &&
          room.state == "pending"
        ) {
          console.log("ENTRO NO PREMIUM");
          const playerisRegistered = room.players.find((p) => p.id === uid);

          if (playerisRegistered) {
            io.to(data.code).emit("new_joined", {
              roomCode: data.code,
              players: room.players,
            });

            callback(new ApiResponse(201, "success", dataSend));
          } else {
            room.players.push(player);

            socket.join(data.code);

            // ✅ Guarda los datos del jugador en el socket
            socket.data.roomCode = data.code;
            socket.data.uid = uid;
            socket.data.name = userName;

            io.to(data.code).emit("new_joined", {
              roomCode: data.code,
              players: room.players,
            });

            callback(new ApiResponse(201, "success", dataSend));
          }
        } else {
          callback(new ApiResponse(409, "Room is full", null));
          return;
        }
      } else {
        callback(new ApiResponse(404, "Room not found", null));
      }
    } catch (error) {
      console.error("Error", error);
      callback(new ApiResponse(500, "server error", null));
    }
  });
}

export function LeaveRoom(io: Server, socket: GameSocket) {
  socket.on("leave_room", async (data) => {
    try {
      if (typeof data === "string") data = JSON.parse(data);

      const { roomCode, token } = data;
      const room = rooms.get(roomCode);
      const userData = await FirebaseTokenVerification(token);
      const uid = userData.data?.uid ?? "";
      const userName = userData.data?.name ?? "";

      if (room && userData.data != null) {
        await handlePlayerLeave(io, socket, roomCode, uid, userName);
      }
    } catch (error) {
      console.error("Error", error);
    }
  });
}

export function getQuestionsRooms(io: Server, socket: GameSocket) {
  socket.on("get_question", async (data) => {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const room = rooms.get(data.code);

      const userData = await FirebaseTokenVerification(data.token);

      const uid = userData.data?.uid ?? "";

      if (room && uid == room.hostId) {
        const index = room.actualQuestionIndex;

        if (index < room.questions.length) {
          const question = room.questions[index];

          io.to(data.code).emit("actual_question", {
            hostId: room.hostId,
            question: question,
            questionIndex: index + 1,
            totalQuestions: room.questions.length,
            totalPlayers: room.players.length,
            time: room.time,
          });
          room.actualQuestionIndex++; // Incrementa solo en esa sala
        } else {
          // ✅ Solo 1 vez: respuesta general
          console.log("finalizo");
          room.state = "finished";

          for (const p of room.players) {
            const dataSend = {
              user_id: p.id,
              simulacro_id: room.simulacro_id,
              score: p.score || 0,
              answersOptions: (p.answers || []).map((a) => ({
                question_id: a.question_id,
                answer_id: a.answer_id,
              })),
            };

            const intento: IntentosDto = {
              intento : {
                simulacro_id: dataSend.simulacro_id,
                score : p.score
              },
              answers: dataSend.answersOptions
            }

            const saveAttempts = await intentosService.create(uid, intento)

            if (saveAttempts.code != 201) {
              console.log("Error saving attempt:", saveAttempts.message);
            }
          }

          io.to(data.code).emit("game_finished", {
            players: room.players.map((p) => ({
              id: p.id,
              name: p.name,
              score: p.score || 0,
            })),
          });
        }
      }
    } catch (error) {
      console.error("Error", error);
    }
  });
}

export function CheckQuestion(io: Server, socket: GameSocket) {
  socket.on("check_question", async (data, callback) => {
    try {
      if (typeof data === "string") data = JSON.parse(data);

      console.log(data)

      const userData = await FirebaseTokenVerification(data.token);
      const uid = userData.data?.uid ?? "";
      const name = userData.data?.name ?? "";

      const room = rooms.get(data.code);
      if (!room) return;

      console.log(room)

      const index = room.actualQuestionIndex - 1;
      const question = room.questions[index];

      console.log(question)

      const selectedAnswer = question?.dataValues.answers.find(
        (a: Answers) => a.dataValues.id === data.answer_id
      );

      console.log(selectedAnswer)

      const player = room.players.find((p) => p.id === uid);

      if (!player) return;

      if (!selectedAnswer) {
        player.answers?.push({
          answer_id: null,
          question_id: question?.dataValues.id,
        });

        callback({
          isCorrect: false,
          score: player.score,
        });
        return;
      }

      player.answers?.push({
        answer_id: selectedAnswer.id,
        question_id: question?.dataValues.id,
      });

      const isCorrect = selectedAnswer.is_correct;

      if (isCorrect) {
        player.score += 400 + Math.trunc(400 * parseFloat(data.percent));
      }

      // ✅ Solo 1 vez: respuesta personal
      callback({
        isCorrect,
        score: player.score,
      });
    } catch (error) {
      console.error("Error", error);
    }
  });
}

export function StartGame(io: Server, socket: GameSocket) {
  socket.on("start_Game", async (data, callback) => {
    console.log("LLEGO START GAME");
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const userData = await FirebaseTokenVerification(data.token);
      const uid = userData.data?.uid ?? "";

      const room = rooms.get(data.code);

      if (room && room.hostId == uid) {
        room.state = "inProgress";

        io.to(data.code).emit("game_Started", {
          success: true,
          hostId: room.hostId,
        });

        console.log("EMITIO GAME STARTED");
      } else {
        callback(new ApiResponse(403, "Error to start", null));
      }
    } catch (error) {
      console.error("Error", error);
    }
  });
}

async function handlePlayerLeave(
  io: Server,
  socket: Socket,
  roomCode: string,
  uid: string,
  userName: string
) {
  const room = rooms.get(roomCode);
  if (!room) return;

  room.players = room.players.filter((p) => p.id !== uid);

  if (uid === room.hostId) {
    console.log("host abandono")
    io.to(roomCode).emit("host_leave", { name: userName });
  } else {
    io.to(roomCode).emit("player_leave", {
      name: userName,
      players: room.players,
    });
  }

  if (room.players.length < 2) {
    io.to(roomCode).emit("insuficient_participants");
    if (room.state !== "pending") {
      rooms.delete(roomCode);
    }
  }

  socket.leave(roomCode);
}
