export interface Category {
  id: string;
  name: string;
  user_id: string;
  is_default: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: "income" | "expense";
  category: Category;
  createdAt?: string;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  start_date: string;
  deadline: string;
  category: Category | null;
  created_at: string;
  progress?: number;
  percentage?: number;
  completed?: boolean;
  expired?: boolean;
}

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  total: number;
  content: T[];
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
