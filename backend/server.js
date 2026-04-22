const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./User");
const Expense = require("./Expense");
const auth = require("./authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// DB CONNECT
mongoose.connect("mongodb://satyamtyagi80064_db_user:SATYAM01@ac-kra4hkt-shard-00-00.oonsvuo.mongodb.net:27017,ac-kra4hkt-shard-00-01.oonsvuo.mongodb.net:27017,ac-kra4hkt-shard-00-02.oonsvuo.mongodb.net:27017/?ssl=true&replicaSet=atlas-13k1cl-shard-0&authSource=admin&appName=Cluster0/fsdexpense")
.then(()=>console.log("DB Connected"))
.catch(()=>console.log("DB Error"));


// ================= AUTH =================

// REGISTER
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).send("Email already exists");

  const hash = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hash });
  await user.save();

  res.send("Registered Successfully");
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Wrong password");

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({ token });
});


// ================= EXPENSE =================

// ADD EXPENSE
app.post("/api/expense", auth, async (req, res) => {
  const exp = new Expense({
    userId: req.user.id,
    ...req.body
  });

  await exp.save();
  res.send("Expense Added");
});

// GET EXPENSES
app.get("/api/expenses", auth, async (req, res) => {
  const data = await Expense.find({ userId: req.user.id });
  res.json(data);
});


// SERVER
app.listen(5000, () => console.log("Server running on 5000"));