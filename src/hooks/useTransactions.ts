'use client';

import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '@/services/transaction.service';
import {
  Transaction,
  CreateTransactionDto,
  TransactionFilters,
  PaginatedResponse,
} from '@/types/transaction';

const DEFAULT_LIMIT = 5;

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  deletingId: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  setPage: (page: number) => void;
  loadTransactions: () => Promise<void>;
  createTransaction: (data: CreateTransactionDto) => Promise<boolean>;
  removeTransaction: (id: string) => Promise<boolean>;
}

export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    status: 'all',
    type: 'all',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: PaginatedResponse<Transaction> = await transactionService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        filters,
      });

      setTransactions(response.data);

      setPagination((prev) => ({
        ...prev,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const createTransaction = useCallback(async (data: CreateTransactionDto): Promise<boolean> => {
    try {
      setCreating(true);
      setError(null);
      await transactionService.create(data);
      await loadTransactions();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar transação';
      setError(message);
      return false;
    } finally {
      setCreating(false);
    }
  }, [loadTransactions]);

  const removeTransaction = useCallback(async (id: string): Promise<boolean> => {
    try {
      setDeletingId(id);
      setError(null);
      await transactionService.remove(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover transação';
      setError(message);
      return false;
    } finally {
      setDeletingId(null);
    }
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handleSetFilters = useCallback((newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    error,
    creating,
    deletingId,
    pagination,
    filters,
    setFilters: handleSetFilters,
    setPage,
    loadTransactions,
    createTransaction,
    removeTransaction,
  };
}
