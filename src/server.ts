var express = require("express");
var cors = require("cors");

const routes = require("./routes");

var app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(4000, function () {
  console.log("Server is running on PORT 4000");
});
