const express = require("express");
const cors = require("cors");
const session = require("express-session");
const ping = require("ping");
require("dotenv").config();
const bodyParser = require("body-parser");
const db = require("./helper/database");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/getmessage", (req, res, next) => {
  res.json({ message: "hello world from getmessage" });
});

app.post("/send-ping", (req, res, next) => {
  // req.body
  const { hostName, count } = req.body;
  const sessionId = req.session.id;
  const countNum = Number(count);

  const options = {
    count: countNum,
  };

  if (!hostName) {
    res.status(400).send({ status: "no host name sent" });
  } else {
    ping.promise
      .probe(hostName, options)
      .then((response) => {
        const isHostAlive = response.alive;
        if (isHostAlive) {
          db.execute(
            "SELECT * FROM pings WHERE hostName = ? AND sessionId = ?",
            [hostName, sessionId]
          )
            .then((results) => {
              const result = results[0][0];
              if (!result) {
                db.execute(
                  "INSERT INTO pings (hostName, count, sessionId) VALUES (?, ?, ?)",
                  [hostName, countNum, sessionId]
                )
                  .then((result) => {
                    res.status(200).send({
                      status: "success",
                      message: `ping -n ${countNum} ${hostName}`,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                const newCount = result.count + countNum;
                db.execute(
                  "UPDATE pings SET count = ? WHERE hostName = ? AND sessionId = ?",
                  [newCount, hostName, sessionId]
                )
                  .then((result) => {
                    res.status(200).send({
                      status: "success",
                      message: `ping -n ${countNum} ${hostName}`,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          res.status(400).send({ status: "this host not alive" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/top-five", (req, res, next) => {
  const sessionId = req.session.id;

  db.execute(
    "SELECT hostName, count FROM pings WHERE sessionId = ? ORDER BY count DESC LIMIT 5",
    [sessionId]
  )
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/reset-session", (req, res) => {
  req.session.regenerate((err) => {
    if (err) {
      console.error("Error resetting session:", err);
      res
        .status(500)
        .json({ error: "An error occurred while resetting the session" });
    } else {
      res.json({ message: "Session reset successfully" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
