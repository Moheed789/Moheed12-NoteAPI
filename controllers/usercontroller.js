const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const exitingUser = await userModel.findOne({ email: email });
        if (exitingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username
        })
        const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY)
        res.status(201).json({ user: result, token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const signin = async (req, res) => {
    const {email, password} = req.body;
    try {
        const exitingUser = await userModel.findOne({ email: email });
        if (!exitingUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const matchPassword = await bcrypt.compare(password, exitingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const token = jwt.sign({ email: exitingUser.email, id: exitingUser._id }, SECRET_KEY)
        res.status(200).json({ user: exitingUser, token: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { signup, signin };