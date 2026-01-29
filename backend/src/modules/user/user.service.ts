import { UserRepository } from "./user.repository";

export class UserService {
  private repository = new UserRepository();

  async listUsers() {
    return this.repository.findAll();
  }

  async createUser(data: { name: string; email: string }) {
    const exists = await this.repository.findByEmail(data.email);

    if (exists) {
      throw new Error("Email já cadastrado");
    }

    return this.repository.create(data);
  }

  async deleteUser(id: string) {
    await this.repository.delete(id);
  }
}