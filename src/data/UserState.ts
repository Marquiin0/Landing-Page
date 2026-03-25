export interface User {
  name: string;
  email: string;
  phone: string;
}

const USER_KEY = 'sabor_user';
const USERS_KEY = 'sabor_users';

export class UserState {
  static save(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static get(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static isLoggedIn(): boolean {
    return !!this.get();
  }

  static logout(): void {
    localStorage.removeItem(USER_KEY);
  }

  static getInitials(): string {
    const user = this.get();
    if (!user) return '';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  static getFirstName(): string {
    const user = this.get();
    if (!user) return '';
    return user.name.trim().split(/\s+/)[0];
  }

  // ─── User Registry (for login validation) ───

  static register(user: User): void {
    const users = this.getAllUsers();
    const existing = users.findIndex((u) => u.email === user.email);
    if (existing >= 0) {
      users[existing] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    this.save(user);
  }

  static findByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find((u) => u.email === email) || null;
  }

  private static getAllUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
