'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  deletingId: string | null;
  onRemove: (id: string) => Promise<boolean>;
}

export function TransactionList({ transactions, loading, deletingId, onRemove }: TransactionListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { showToast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getTypeColor = (type: string) => {
    const colors = {
      debit: 'bg-blue-100 text-blue-800 border border-blue-200',
      credit: 'bg-orange-100 text-orange-800 border border-orange-200',
    };
    return colors[type as keyof typeof colors] || 'bg-slate-100 text-slate-800 border border-slate-200';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      credit: 'Crédito',
      debit: 'Débito',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      pending: 'bg-amber-100 text-amber-800 border border-amber-200',
      failed: 'bg-rose-100 text-rose-800 border border-rose-200',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-800 border border-slate-200';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: 'Concluída',
      pending: 'Pendente',
      failed: 'Falhou',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    const success = await onRemove(confirmDelete);

    if (success) {
      showToast('Transação removida com sucesso!', 'success');
    } else {
      showToast('Erro ao remover transação. Tente novamente.', 'error');
    }

    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-600 font-medium">Carregando transações...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-600 font-medium text-lg">Nenhuma transação encontrada</p>
        <p className="text-slate-500 text-sm mt-2">Crie sua primeira transação usando o formulário ao lado</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`hover:bg-slate-50 transition-colors ${deletingId === transaction.id ? 'opacity-50' : ''}`}
              >
                <td className="px-6 py-4 text-sm font-mono text-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {transaction.id.slice(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.type)}`}>
                    {getTypeLabel(transaction.type)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteClick(transaction.id)}
                    disabled={deletingId === transaction.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Remover transação"
                  >
                    {deletingId === transaction.id ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Confirmar exclusão"
        message="Tem certeza que deseja remover esta transação? Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
        isLoading={!!deletingId}
      />
    </>
  );
}
