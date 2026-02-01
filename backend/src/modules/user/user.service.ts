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

  async updateUser(id: string, data: { name?: string; email?: string }) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica se o email já está em uso por outro usuário
    if (data.email && data.email !== user.email) {
      const emailExists = await this.repository.findByEmail(data.email);
      if (emailExists) {
        throw new Error("Email já cadastrado por outro usuário");
      }
    }

    return this.repository.update(id, data);
  }

  async deleteUser(id: string) {
    await this.repository.delete(id);
  }
}