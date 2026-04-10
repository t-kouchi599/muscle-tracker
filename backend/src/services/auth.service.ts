import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  static async register(email: string, password: string, displayName: string) {
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("このメールアドレスは既に登録されています");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      email,
      passwordHash,
      displayName,
    });

    await userRepository.save(user);

    return { id: user.id, email: user.email, displayName: user.displayName };
  }

  static async login(email: string, password: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("メールアドレスまたはパスワードが正しくありません");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("メールアドレスまたはパスワードが正しくありません");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return {
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    };
  }
}