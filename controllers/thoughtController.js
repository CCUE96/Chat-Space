const Thought = require("../models/thoughts");
const User = require("../models/users");

module.exports = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find().populate("reactions");
      res.json(thoughts);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.id).populate(
        "reactions"
      );
      res.json(thought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  createThought: async (req, res) => {
    try {
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newThoughts = await Thought.create(req.body);

      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: newThoughts._id } },
        { new: true, useFindAndModify: false }
      );

      res.status(201).json(newThoughts);
    } catch (error) {
      console.error(`Error Creating Thought: ${error.message}`);
      res.status(500).json(error);
    }
  },
  updateThought: async (req, res) => {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "thought does not exist" });
      }
      res.json(updatedThought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteThought: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.id);
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json({ message: "Thought deleted successfully" });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  addReaction: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought does not exist" });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  removeReaction: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought does not exist" });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
