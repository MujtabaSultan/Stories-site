const mongoose = require("mongoose");

mongoose.connect(process.env.DATABSE_URL);

mongoose.connection.on("connected", () => {
  console.info(`Connected to MongoDB ${mongoose.connection.name}.`);
});
