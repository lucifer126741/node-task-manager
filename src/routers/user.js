const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const formidable = require("formidable");
const stream = require("stream");
const sharp = require("sharp");
const router = express.Router();
const fileExtensionRegex = new RegExp("^(image/jpg|image/jpeg)$");
base64encodedData = [];
const formidableOptions = {
  // uploadDir: path.join(__dirname, "..", "avatar"),
  keepExtensions: true,
  maxFileSize: 1 * 1024 * 1024,
  fileWriteStreamHandler: (/* file */) => {
    const wrt = stream.Writable();
    // eslint-disable-next-line no-underscore-dangle
    wrt._write = (chunk, enc, next) => {
      base64encodedData.push(chunk);
      next();
    };
    return wrt;
  },
};

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("User logged out from all devices");
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/users/me/avatar", auth, async (req, res) => {
  const form = new formidable.IncomingForm(formidableOptions);
  form.onPart = (part) => {
    if (!fileExtensionRegex.test(part.mimetype)) {
      form._error(new Error("Invalid file type"));
    } else {
      form._handlePart(part);
    }
  };

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    req.user.avatar = await sharp(Buffer.concat(base64encodedData))
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    await req.user.save();
    res.send("Avatar uploaded successfully");
  });
});

router.patch("/users/me", auth, async (req, res) => {
  const fieldsToBeUpdated = Object.keys(req.body);
  const allowedUpdateFields = ["name", "email", "age", "password"];
  const isValidUpdate = fieldsToBeUpdated.every((update) =>
    allowedUpdateFields.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    fieldsToBeUpdated.forEach(
      (update) => (req.user[update] = req.body[update])
    );
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
