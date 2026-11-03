type User = {
  email: string;
  password: string;
  name: string;
  role: string;
  other: string;
};

const users: User[] = [
  {
    email: "admin@company.com",
    password: "pass",
    name: "Admin User",
    role: "admin",
    other: "..."
  },
  {
    email: "user@company.com",
    password: "pass",
    name: "Regular User",
    role: "user",
    other: "..."
  },
  {
    email: "manager@company.com",
    password: "pass",
    name: "Manager User",
    role: "manager",
    other: "..."
  },
];

export type Credential = {
  token: string;
  email: string;
  name: string;
  role: string;
};

export const login = (email: string, pass: string): Promise<Credential | string> => {
  return new Promise<Credential>((resolve, reject) => {
    setTimeout(() => {
        if (Math.random() <= 0.8) {
          const user = users.find(
            (u) => u.email === email && u.password === pass);
          if (user === undefined) {
            reject("user not found");
            return;
          }
          const newCredential: Credential | string = {
            token: crypto.randomUUID(),
            email: user.email,
            name: user.name,
            role: user.role
          };
          resolve(newCredential);
        } else {
          reject("connection refused");
        }
      },1000 + Math.random() * 2000);
  });
};

export const logout = (token: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() <= 0.8) {
          resolve('success');
        } else {
          reject("connection refused");
        }
      },1000 + Math.random() * 2000);
  });
}