const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../db");
const config = require("../../shared/config");

/**
 * Post admin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const loginAdmin = async (req, res) => {
  try {
    const { full_name, phone_number, password } = req.body;

    const existing = await db("admin")
      .where({ full_name, phone_number })
      .select("id", "password", "phone_number")
      .first();

    if (!existing) {
      return res.status(401).json({
        error: "phone_number yoki password xato.",
      });
    }

    const match = await bcrypt.compare(password, existing.password);

    if (!match) {
      return res.status(401).json({
        error: "phone_number yoki password xato.",
      });
    }

    const token = jwt.sign({ id: existing.id }, config.jwt.secret, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,

      admin: {
        id: existing.id,
        phone_number: existing.phone_number,
        role: existing.role,
      },
    });
    console.log(existing);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
};
