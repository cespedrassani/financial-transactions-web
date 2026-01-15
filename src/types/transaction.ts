export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  externalId: string;
  amount: number;
  description: string;
  status: TransactionStatus;
  createdAt: string;
  type: TransactionType;
}

export interface CreateTransactionDto {
  externalId: string;
  amount: number;
  description: string;
  type: TransactionType;
}

export interface TransactionError {
  message: string;
  statusCode: number;
}

export interface TransactionFilters {
  status?: TransactionStatus | 'all';
  type?: TransactionType | 'all';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
