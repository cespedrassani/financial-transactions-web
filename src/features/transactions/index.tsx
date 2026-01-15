'use client';

import { TransactionForm } from '@/features/transactions/components/form';
import { TransactionList } from '@/features/transactions/components/list';
import { TransactionFiltersBar } from '@/features/transactions/components/filters';
import { Pagination } from '@/components/ui/Pagination';
import { useTransactions } from '@/hooks/useTransactions';

export default function Transactions() {
  const {
    transactions,
    loading,
    creating,
    deletingId,
    pagination,
    filters,
    setFilters,
    setPage,
    createTransaction,
    removeTransaction,
  } = useTransactions();

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm
              onSubmit={createTransaction}
              isLoading={creating}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <div className="bg-linear-to-r from-blue-700 to-blue-500 p-6">
                <h2 className="text-2xl font-bold text-white">Minha Transações</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Transações registradas no sistema
                </p>
              </div>

              <TransactionFiltersBar
                filters={filters}
                onFilterChange={setFilters}
              />

              <TransactionList
                transactions={transactions}
                loading={loading}
                deletingId={deletingId}
                onRemove={removeTransaction}
              />

              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
