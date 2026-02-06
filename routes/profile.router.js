const express = require("express");
const router = express.Router();
const userAuth=require('../Middlewares/userAuth')

router.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});


const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "avatar",
    "gender",
    "age",
    "bio",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  if(req.body.skills && req.body.skills.length > 10){
    throw new Error("Skills should be less than 10");
  }

  return isEditAllowed;
};


router.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports=router;
