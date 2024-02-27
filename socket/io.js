let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');

    // https://socket.io/docs/v4/handling-cors/
    io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:5173',
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected!');
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io is not initialized!');
    }
    return io;
  },
};
