const io = require("socket.io")(process.env.PORT || 6969, {
  cors: {
    origin: ["http://localhost:3000", "https://anon-therapy.vercel.app"],
  },
});

const rooms = [];
io.on("connection", (socket) => {
  // socket.disconnect();
  // return;

  let started = false;
  let currentRoom = "";

  socket.on("message", (message, room) => {
    if (room) {
      let found = false;
      rooms.forEach((v) => {
        if (v.name === room) {
          v.users.forEach((usr) => {
            if (usr.id === socket.id) {
              found = true;
            }
          });
        }
      });

      if (found) socket.to(room).except(socket.id).emit("message", message);
    }
  });

  socket.on("join-room", (room, callback) => {
    console.log(socket.id);
    let found = null;
    rooms.forEach((r) => {
      if (r.name === room) {
        found = r;
      }
    });
    if (found) {
      found.users.forEach((user) => {
        if (user.id == socket.id) return;
      });
      if (found.users.length < 2) {
        found.users.push({ id: socket.id, role: true });
        socket.join(room);

        currentRoom = room;
        callback(true, true, false);
        socket.to(room).emit("start");
      } else {
        // Room is full
        callback(false, false, true);
      }
    } else {
      rooms.push({
        name: room,
        users: [
          {
            id: socket.id,
            role: false,
          },
        ],
      });
      socket.join(room);
      currentRoom = room;

      callback(false, false, false);
    }
    console.log(rooms[0].users);
  });

  socket.on("disconnect", () => {
    rooms.forEach((room, i) => {
      if (room.name === currentRoom) {
        rooms.splice(i, 1);
      }
    });
    socket.to(currentRoom).emit("leave");
  });
});
