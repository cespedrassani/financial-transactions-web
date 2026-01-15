import { api } from '@/lib/api';
import {
  Transaction,
  CreateTransactionDto,
  TransactionFilters,
  PaginationParams,
  PaginatedResponse,
} from '@/types/transaction';

interface GetAllParams extends PaginationParams {
  filters?: TransactionFilters;
}

export const transactionService = {
  async getAll(params: GetAllParams): Promise<PaginatedResponse<Transaction>> {
    const { page, limit, filters } = params;

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters?.status && filters.status !== 'all') {
      queryParams.append('status', filters.status);
    }

    if (filters?.type && filters.type !== 'all') {
      queryParams.append('type', filters.type);
    }

    const response = await api.get(`/transactions?${queryParams.toString()}`);

    if (!response?.data?.data) {
      throw new Error('Erro ao buscar transações');
    }

    return {
      data: response.data.data,
      meta: response.data.pagination || {
        total: response.data.pagination?.total || response.data.data.length,
        page: response.data.pagination?.page || page,
        limit: response.data.pagination?.limit || limit,
        totalPages: Math.ceil(response.data.pagination?.total / (response.data.pagination?.limit || limit)),
      },
    };
  },

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const response = await api.post(`/transactions`, data);

    if (!response?.data) {
      throw new Error('Erro ao criar transação');
    }

    return response.data;
  },

  async remove(id: string): Promise<void> {
    const response = await api.delete(`/transactions/${id}`);

    if (response?.status !== 200) {
      throw new Error('Erro ao remover transação');
    }
  },
};
