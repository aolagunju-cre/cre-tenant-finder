"use server";

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Server configuration error." };
  }

  if (password !== adminPassword) {
    return { error: "Invalid password." };
  }

  return { success: true };
}

export async function logoutAction(): Promise<void> {}
