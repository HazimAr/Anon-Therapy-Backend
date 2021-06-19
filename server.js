const io = require("socket.io")(process.env.PORT || 6969, {
  cors: {
    origin: ["http://localhost:3000", "https://anon-therapy.vercel.app"],
  },
});

io.on("connection", (socket) => {
  // socket.disconnect();
  // return;
});
