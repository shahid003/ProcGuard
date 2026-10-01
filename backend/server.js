const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/procurement") 
  .then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const User = require("./models/User");
const Vendor = require("./models/Vendor");
const Request = require("./models/Request");

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    res.send("Registered");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.send("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.send("Invalid password");

    const token = jwt.sign({ id: user._id, role: user.role }, "secret");
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.send("No token");
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch {
    res.send("Invalid token");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.send("Admins only");
  next();
};

app.post("/vendor", auth, isAdmin, async (req, res) => {
  const vendor = new Vendor(req.body);
  await vendor.save();
  res.send("Vendor added");
});

app.post("/request", auth, async (req, res) => {
  const request = new Request({
    ...req.body,
    userId: req.user.id,
    status: "pending"
  });
  await request.save();
  res.send("Request created");
});

app.put("/approve/:id", auth, isAdmin, async (req, res) => {
  await Request.findByIdAndUpdate(id, { status: "approved" });
  res.send("Approved");
});

app.listen(5000, () => console.log("Server running on port 5000"));
