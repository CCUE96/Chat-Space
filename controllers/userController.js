const User = require('../models/users');
const Thought = require('../models/thoughts');

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().populate('thoughts').populate('friends');
            res.json(users);
        } catch (error) {
            console.error(`Error fetching all users: ${error.message}`);
            res.status(500).json({ message: 'Error fetching all users', error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
            if (!user) {
                return res.status(404).json({ message: 'User Does Not Exist' });
            }
            res.json(user);
        } catch (error) {
            console.error(`Error fetching user by ID: ${error.message}`);
            res.status(500).json({ message: 'Error fetching user by ID', error: error.message });
        }
    },

    createUser: async (req, res) => {
        try {
            const newUser = await User.create(req.body);
            res.json(newUser);
        } catch (error) {
            console.error(`Error creating user: ${error.message}`);
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User Does Not Exist' });
            }
            res.json(updatedUser);
        } catch (error) {
            console.error(`Error updating user: ${error.message}`);
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User Does Not Exist' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(`Error deleting user: ${error.message}`);
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    },

    addFriend: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    removeFriend: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'No user found with this id!' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}