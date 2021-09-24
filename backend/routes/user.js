const router = require ('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {

    try {
        //Generate Salt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //Create user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        //Save user and sand response
        const user = await newUser.save();
        res.status(200).send(user._id);
        
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/login', async(req, res) =>{
    try {
        //find user 
        const user = await User.findOne({username: req.body.username});
        !user && res.status(404).send("Wrong username or password ;(");

        //validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).send("Wrong username or password ;(")

        res.status(200).send({_id: user._id, username: req.body.username})

    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;