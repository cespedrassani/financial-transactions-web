export const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'decimal',
    currency: 'BRL',
  });

export const parseBRL = (value: string) =>
  Number(
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})$/, '.$1')
  );
