const express = require("express");
const users = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtprivateKey = process.env.KEY;

const createUser = async (req, res) => {
  try {
    const data = req.body;
    const IsUserExist = await users.findOne({ email: data.email });
    if (IsUserExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    const encryptPassword = await bcrypt.hash(data.password, saltRounds);
    const userCreate = await users.create({
      name: data.name,
      age: data.age,
      email: data.email,
      password: encryptPassword,
    });
    console.log("=====", userCreate);
    const token = jwt.sign({ id: userCreate.id }, jwtprivateKey, {
      expiresIn: "5h",
    });
    console.log("---", token);
    await sendEmail(token, userCreate.email);
    return res.status(201).json({
      message: "created successfully",
      data: userCreate,
      token: token,
    });
  } catch (error) {
    console.error("------ ERRor :", error);
    return res.status(500).json({
      error: error,
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const data = req.body;
    const checkUser = await users.findOne({ email: data.email });
    console.log("-----", checkUser);
    if (!checkUser) {
      return res.status(400).json({ message: "user not found" });
    }
    const matchPassword = bcrypt.compare(data.password, checkUser.password);
    console.log("-------", matchPassword);
    if (!matchPassword) {
      return res.status(400).json({ message: "password not matched" });
    }
    emailSend(checkUser.email)
    return res.status(200).json({ message: "user login successfully",});
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};
const emailSend = async (email) => {
  try {
    const auth = nodemailer.createTransport({
      service: "smtp@gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: "rohitkanwar2905@gmail.com",
        pass: "rqal ahwq tiuw wlnj",
      },
    });
    console.log("-----", auth);
    const receiver = {
      from: "rohitkanwar2905@gmail.com",
      to: email,
      subject: "node js mail testing",
      text: `you are login successfully`,
    };
    console.log("----", receiver);
    const mailSend = auth.sendMail(receiver, (error, resolve) => {
      if (error) {
        console.log("---------------", mailSend);
        throw res.status(400).json({ message: "try again" });
      } else {
        console.log("email sent successfully");
        return res.status(200).json({ message: "email sent successfully" });
      }
    });
  } catch (error) {
    console.log("====", error);
    return res.status(500).json({
      error: error,
    });
  }
};
const getUser = async (req, res) => {
  try {
    const data = req.body;
    const userFind = await users.findOne({ email: data.email });
    if (!userFind) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json({ message: "user found", data: userFind });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const userUpdate = await users.findOneAndUpdate(
      { email: data.email },
      { name: data.name, age: data.age, password: data.password },
      { new: true }
    );
    if (!userUpdate) {
      return res.status(400).json({ message: "user not updated try again" });
    }
    return res
      .status(200)
      .json({ message: "user updated successfully", data: userUpdate });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};
const verifyToken = async (req, res) => {
  try {
    getToken = req.query.token;
    console.log("-------------------", getToken);
    const tokenVerify = jwt.verify(getToken, jwtprivateKey);
    if (!tokenVerify) {
      throw res.status(400).json({ message: "your link has been expired" });
    }
    console.log("user verified");
    return res.status(200).json({ message: "user verified" });
  } catch (error) {
    console.log("------", error);
    return res.status(500).json({ error: error });
  }
};

const findUser = async (req, res) => {
  try {
    const userName = await req.params.name;
    const userAge = await req.params.age;

    if (!userName && !userAge) {
      throw res.status(400).json({ message: "try again" });
    } else {
      return res.status(200).json({ message: userName, userAge });
    }
  } catch (error) {
    console.log("---", error);
    return res.status(500).json({ message: "error" });
  }
};
const getData = async (req, res) => {
  try {
    const name = await req.query.name;
    const age = await req.query.age;
    console.log("---------------", name);
    if (!name && !age) {
      throw res.status(400).json({ message: "try again" });
    } else {
      return res.status(200).json({ message: name, age });
    }
  } catch (error) {
    console.log("=======", error);
    return res.status(500).json({ message: error });
  }
};
module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  sendEmail,
  verifyToken,
  findUser,
  getData,
  emailSend
};
