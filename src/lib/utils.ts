import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cpfCNPJFormatter  (value: string) {
  // Remove todos os caracteres que não são dígitos
  const cleanedValue = value.replace(/\D/g, '');

  if (cleanedValue.length <= 11) {
    // Formata como CPF: 000.000.000-00
    return cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    // Formata como CNPJ: 00.000.000/0000-00
    return cleanedValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}

export function formatPhoneNumber(value: string) {
  // Remove todos os caracteres que não são dígitos
  const cleanedValue = value.replace(/\D/g, '');

  // Formata como (00) 00000-0000
  return cleanedValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatCEP(value: string) {
  // Remove todos os caracteres que não são dígitos
  const cleanedValue = value.replace(/\D/g, '');

  // Formata como 00000-000
  return cleanedValue.replace(/(\d{5})(\d{3})/, '$1-$2');
}
