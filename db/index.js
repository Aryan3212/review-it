const mongoose = require('mongoose');

async function init() {
  mongoose.connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/review-it', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection: error'));
  db.once('open', () => {
    console.log('Db connection successful');
  });
}

function close() {
  mongoose.connection.close();
}
module.exports.db = { init, close };
