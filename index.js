const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Phone Bill API!");
});

// Words Widget API
app.get("/api/word_game", (req, res) => {
  const sentence = req.query.sentence;
  if (!sentence) {
    return res
      .status(400)
      .send({ error: "Sentence query parameter is required" });
  }

  const words = sentence.split(" ");
  const longestWord = Math.max(...words.map((word) => word.length));
  const shortestWord = words.reduce((shortest, word) =>
    word.length < shortest.length ? word : shortest
  );
  const sum = words.join("").length;

  res.json({
    longestWord,
    shortestWord,
    sum,
  });
});

// Prices for call and SMS
let callPrice = 2.75;
let smsPrice = 0.65;

// Total Phone Bill API
app.post("/api/phonebill/total", (req, res) => {
  const { bill } = req.body;
  if (!bill) {
    return res.status(400).send({ error: "Bill is required" });
  }

  const items = bill.split(",");
  const total = items.reduce((acc, item) => {
    if (item === "call") return acc + callPrice;
    if (item === "sms") return acc + smsPrice;
    return acc;
  }, 0);

  res.json({ total: total.toFixed(2) });
});

app.get("/api/phonebill/prices", (req, res) => {
  res.json({ call: callPrice, sms: smsPrice });
});

app.post("/api/phonebill/price", (req, res) => {
  const { type, price } = req.body;
  if (type === "call") {
    callPrice = price;
  } else if (type === "sms") {
    smsPrice = price;
  } else {
    return res.status(400).send({ error: "Invalid type" });
  }

  res.json({
    status: "success",
    message: `The ${type} was set to ${price}`,
  });
});

// Enough Airtime API
app.post("/api/enough", (req, res) => {
  const { usage, available } = req.body;
  if (!usage || available === undefined) {
    return res
      .status(400)
      .send({ error: "Usage and available amount are required" });
  }

  const items = usage.split(",");
  const totalUsage = items.reduce((acc, item) => {
    if (item === "call") return acc + callPrice;
    if (item === "sms") return acc + smsPrice;
    return acc;
  }, 0);

  const result = (available - totalUsage).toFixed(2);
  res.json({ result });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
