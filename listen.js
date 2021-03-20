const app = require("./app");
console.log(process.env.PORT);
const PORT = process.env.PORT || 9090;
app.listen(PORT, console.log(`listening on port ${PORT}`));
