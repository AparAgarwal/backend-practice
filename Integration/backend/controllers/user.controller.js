import User from "../models/user.model.js";

// GET all users
export const getAllUser = async (req, res) => {
    const users = await User.find();
    return res.json(users);
}

// GET user by ID
export const getUserById = async (req, res) => {
    const userID = req.params.id;
    const user = await User.findById(userID);
    if(!user) return res.status(404).send({msg : "User not found!"});
    return res.json(user);
}

// Create User
export const createUser = async (req, res) => {
    const user = await User.create(req.body);
    return res.status(201).json({status: "success", data: user});
}

// Update User
export const updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true, runValidators: true}
    );

    if(!user) return res.status(404).json({msg: "User not found!"});

    return res.json({status: "success", data: user});
}
// DELETE User
export const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ status: 'success', data: user });
};