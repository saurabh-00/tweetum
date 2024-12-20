import User from "../models/User.js";

// Get user data
export const getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password");
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
};

// Get user's friends data
export const getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password");
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id).select("-password"))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
};
  
// Add or remove friend
export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
      const user = await User.findById(id).select("-password");
      const friend = await User.findById(friendId).select("-password");
  
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id).select("-password"))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
  
      res.status(200).json(formattedFriends);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
};