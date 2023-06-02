var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/users")
const jwt = require("jsonwebtoken")

// Regitstration API
router.post("/register", async (req, res) => {
    const { name, email, phone, password, password_confirmation } = req.body
    const user = await User.findOne({ email: email })
    if (user) {
        res.send({ "status": "falied", "massage": "email already exists" })
    } else {
        if (name && email && phone && password && password_confirmation) {
            if (password === password_confirmation) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hassPassword = await bcrypt.hash(password, salt)
                    const doc = new User({
                        name: name,
                        email: email,
                        phone: phone,
                        password: hassPassword,
                    })

                    await doc.save()
                    const saved_user = await User.findOne({ email: email })
                    const token = jwt.sign({ userID: saved_user._id }, process.env.SECRET_KEY, { expiresIn: '5d' })
                    res.send({ "status": "Success", "message": "Registation Successfully", "token": token })
                } catch (error) {
                    console.log(error);
                }

            } else {
                res.send({ "status": "failed", "message": "Passwords Does not Match" })
            }
        } else {
            res.send({ "status": "failed", "message": "All fields are require" })
        }
    }
})

// login API
router.get('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            const user = await User.findOne({ email: email })
            if (user != null) {
                const isMatch = await bcrypt.compare(password, user.password)
                if ((user.email === email) && isMatch) {

                    const token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY, { expiresIn: '5d' })

                    res.send({ "status": "Success", "message": "Login Successfully", "token": token })
                } else {
                    res.send({ "status": "failed", "message": "Email or Password don't valid" })
                }

            } else {
                res.send({ "status": "failed", "message": "You are not Register User" })
            }
        } else {
            res.send({ "status": "failed", "message": "AllFields are Require" })
        }
    } catch (error) {
        console.log(error)
        res.send({ "status": "failed", "message": "Unable to Login" })

    }
});

module.exports = router;
