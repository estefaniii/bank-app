export enum BankPrefix {
  CUSTOMER = 'CUS',
  ADMIN = 'ADM',
  EMPLOYEE = 'EMP',
  SYSTEM = 'SYS',
  INTEREST = 'INT',
  FEES = 'FEE',
}

/**
 * Genera un número de cuenta único con prefijo y sufijo aleatorio.
 * @param prefix Prefijo del tipo de cuenta (por defecto CUSTOMER)
 * @returns string
 */
export function generateAccountNumber(
  prefix: BankPrefix = BankPrefix.CUSTOMER,
): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix}${timestamp}${random}`;
}
