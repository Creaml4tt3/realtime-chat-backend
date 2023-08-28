declare namespace Express {
  interface Request {
    user?: any;
    token?: string;
    logout?: any;
    session?: any;
    isAuthenticated?: any;
  }
}

interface userData {
  email: string;
  username: string;
  password: string;
  photo?: string;
  name: string;
}

interface message {
  author_email: string;
  text: string;
}
