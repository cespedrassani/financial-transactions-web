'use client';

import { TransactionFilters } from '@/types/transaction';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
}

export function TransactionFiltersBar({ filters, onFilterChange }: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Status:</label>

        <div className="relative">
          <select
            data-testid="filter-status"
            value={filters.status || 'all'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as TransactionFilters['status'],
              })
            }
            className="appearance-none px-3 py-2 pr-9 text-sm text-black border border-slate-300 rounded-lg focus:border-transparent transition-all"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="completed">Concluída</option>
            <option value="failed">Falhou</option>
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Tipo:</label>

        <div className="relative">
          <select
            data-testid="filter-type"
            value={filters.type || 'all'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                type: e.target.value as TransactionFilters['type'],
              })
            }
            className="appearance-none px-3 py-2 pr-9 text-sm text-black border border-slate-300 rounded-lg focus:border-transparent transition-all"
          >
            <option value="all">Todos</option>
            <option value="credit">Crédito</option>
            <option value="debit">Débito</option>
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>

      {(filters.status !== 'all' || filters.type !== 'all') && (
        <button
          onClick={() => onFilterChange({ status: 'all', type: 'all' })}
          className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Limpar filtros
        </button>
      )}
    </div>
  );
}
