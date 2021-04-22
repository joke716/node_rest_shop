
const express = require("express");
const router = express.Router();

const {
    user_signup,
    user_login,
    user_get_all,
    user_delete
} = require("../controllers/user");

const checkAuth = require("../middleware/chack-auth");


router.get("/", user_get_all);
router.post("/signup", user_signup);
router.post("/login", user_login);
router.delete("/:userId", checkAuth, user_delete);


module.exports = router;
