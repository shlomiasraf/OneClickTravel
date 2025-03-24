import { auth } from "@/firebase";

class User {
  constructor(full_name, email, role = "user") {
    this.full_name = full_name;
    this.email = email;
    this.role = role;
  }

  /**
   * Get currently logged-in user
   */
  static async me() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return new User(currentUser.displayName, currentUser.email, "user");
    } else {
      return null;
    }
  }

  /**
   * Sign out current user
   */
  static async logout() {
    await auth.signOut();
    return true;
  }
}

export { User };
