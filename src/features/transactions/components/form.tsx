'use client';

import { useState, FormEvent } from 'react';
import { CreateTransactionDto } from '@/types/transaction';
import { useToast } from '@/components/ui/Toast';
import { formatBRL, parseBRL } from '@/lib/utils';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDto) => Promise<boolean>;
  isLoading: boolean;
}

const INITIAL_FORM_STATE: CreateTransactionDto = {
  externalId: '',
  amount: 0,
  description: '',
  type: 'debit',
};

export function TransactionForm({ onSubmit, isLoading }: TransactionFormProps) {
  const [formData, setFormData] = useState<CreateTransactionDto>({
    ...INITIAL_FORM_STATE,
    externalId: crypto.randomUUID(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.amount <= 0) {
      newErrors.amount = 'O valor deve ser maior que zero';
    }

    if (formData.amount > 1000000) {
      newErrors.amount = 'O valor máximo é R$ 1.000.000,00';
    }

    if (formData.description.trim().length < 3) {
      newErrors.description = 'A descrição deve ter pelo menos 3 caracteres';
    }

    if (formData.description.trim().length > 200) {
      newErrors.description = 'A descrição deve ter no máximo 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const success = await onSubmit(formData);

    if (success) {
      setFormData({
        ...INITIAL_FORM_STATE,
        externalId: crypto.randomUUID(),
      });
      setErrors({});
      showToast('Transação criada com sucesso!', 'success');
    } else {
      showToast('Erro ao criar transação. Tente novamente.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-5 border border-slate-200">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Nova Transação</h2>
        <p className="text-slate-500 text-sm mt-1">Preencha os dados abaixo</p>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-slate-700">
          Valor (R$)
        </label>
        <input
          data-testid='amount'
          type="text"
          inputMode='decimal'
          required
          value={formData.amount ? formatBRL(formData.amount) : ''}
          onChange={(e) => {
            const numericValue = parseBRL(e.target.value);

            setFormData({ ...formData, amount: numericValue });
            if (errors.amount) setErrors({ ...errors, amount: '' });
          }}
          className={`w-full px-4 py-3 text-black border rounded-lg focus:border-transparent transition-all ${
            errors.amount ? 'border-red-500 bg-red-50' : 'border-slate-300'
          }`}
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-semibold text-slate-700">
          Descrição
        </label>
        <input
          data-testid='description'
          type="text"
          required
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          className={`w-full px-4 py-3 text-black border rounded-lg focus:border-transparent transition-all ${
            errors.description ? 'border-red-500 bg-red-50' : 'border-slate-300'
          }`}
          placeholder="Ex: Pagamento de fornecedor"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          {formData.description.length}/200 caracteres
        </p>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-slate-700">
          Tipo de Transação
        </label>

        <div className="relative">
          <select
            data-testid="type"
            required
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as 'credit' | 'debit',
              })
            }
            className="w-full px-4 py-3 pr-12 appearance-none text-black border border-slate-300 rounded-lg focus:border-transparent transition-all"
          >
            <option value="credit">Crédito</option>
            <option value="debit">Débito</option>
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>


      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-linear-to-r from-blue-700 to-blue-500 p-6 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processando...
          </span>
        ) : (
          'Criar Transação'
        )}
      </button>
    </form>
  );
}
