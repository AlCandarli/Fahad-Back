const User = require("../models/User");

const register = async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
    }

    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    const user = await User.create({ username, email });

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        }
    });
};

module.exports = {
    register
}