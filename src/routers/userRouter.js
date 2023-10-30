const express = require('express')
const User = require("../models/user")
const router = new express.Router()
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")

const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error("Please upload an Image"))
        }
        cb(undefined, true)
    }
})





router.post("/userSignin", async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

router.post("/userLogin", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // console.log(token)
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ "error": e })
    }
})

router.post('/userLogoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({ message: "All sessions logged out" })
    } catch (e) {
        res.status(500).send()
    }
});


router.get("/user", auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})
router.patch("/userUpdate", auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates" })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.status(202).send(req.user)
    } catch (error) {
        res.status(400).send({ error: "User not found" })
    }
})

router.delete("/userDelete", auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(400).send()
    }
})

router.post("/userProfilePic", auth, avatar.single('upload'), async (req, res) => {
    const modifiedBuffer = await sharp(req.file.buffer).resize({ width: 500, height: 500 }).png().toBuffer()
    req.user.profilePic = modifiedBuffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete("/userProfilePic", auth, async (req, res) => {
    req.user.profilePic = undefined
    await req.user.save()
    res.send()
})
router.get("/user/:id/profilePic", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.profilePic) {
            throw new Error("Profile picture not found!")
        }
        console.log(user)
        res.set("Content-Type", "image/png")
        res.send(user.profilePic)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router