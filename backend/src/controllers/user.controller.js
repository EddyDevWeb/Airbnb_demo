import User from "../models/user.models.js";
import RoleType from "../models/roleType.models.js";
import { generateToken } from "../utils/jwt.js";
import { validateRegisterInput } from "../utils/validateUser.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const errorMsg = validateRegisterInput({ name, email, password });
    if (errorMsg) return res.status(400).json({ message: errorMsg });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "El usuario ya existe" });

    const roleDoc =
      (await RoleType.findOne({ name: role })) ||
      (await RoleType.findOne({ name: "client" }));

    if (!roleDoc) return res.status(400).json({ message: "Rol no válido" });

    const newUser = new User({
      name,
      email,
      password,
      role: roleDoc._id,
    });

    await newUser.save();
    await newUser.populate("role");

    const token = generateToken(newUser);

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// LOGIN
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("role");
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = generateToken(user);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// GET ALL USERS (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role")
      .select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// UPDATE USER ROLE (admin)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    const roleDoc = await RoleType.findOne({ name: roleName });
    if (!roleDoc) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role: roleDoc._id },
      { new: true }
    ).populate("role").select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Rol actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol" });
  }
};

// DELETE USER (admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

// BECOME HOST
export const becomeHost = async (req, res) => {
  try {
    const hostRole = await RoleType.findOne({ name: "host" });
    if (!hostRole) {
      return res.status(500).json({ message: "Rol host no encontrado" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { role: hostRole._id },
      { new: true }
    ).populate("role").select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Ahora eres host",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar de rol" });
  }
};
