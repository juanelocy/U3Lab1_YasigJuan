const Message = require("../../domain/models/message.model");

class MessageRepository {
  async create(messageData) {
    try {
      const message = new Message(messageData);
      const savedMessage = await message.save();
      return await this.findById(savedMessage._id);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Message.findById(id).populate("user", "email");
    } catch (error) {
      throw error;
    }
  }

  async findAll(limit = 50, page = 1) {
    try {
      const skip = (page - 1) * limit;
      return await Message.find()
        .populate("user", "email")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId, limit = 50, page = 1) {
    try {
      const skip = (page - 1) * limit;
      return await Message.find({ user: userId })
        .populate("user", "email")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    } catch (error) {
      throw error;
    }
  }

  async findRecent(limit = 50) {
    try {
      return await Message.find()
        .populate("user", "email")
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Message.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteByUser(userId) {
    try {
      return await Message.deleteMany({ user: userId });
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await Message.countDocuments();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MessageRepository();
