const app = require("./app");
console.log(process.env.PORT);
const { PORT = 9090 } = process.env.PORT;
app.listen(PORT, console.log(`listening on port ${PORT}`));
