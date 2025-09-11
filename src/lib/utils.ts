/**
 * Trunca um texto para o número especificado de caracteres
 * @param text - Texto a ser truncado
 * @param maxLength - Número máximo de caracteres (padrão: 30)
 * @returns Texto truncado com "..." se necessário
 */
export const truncateText = (text: string, maxLength: number = 30): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Copia texto para a área de transferência
 * @param text - Texto a ser copiado
 * @returns Promise que resolve quando o texto é copiado
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

/**
 * Formata uma data de forma segura, evitando "Invalid Date"
 * @param dateString - String da data ou timestamp
 * @param options - Opções de formatação (padrão: formato brasileiro completo)
 * @returns String formatada ou "Data não disponível" se inválida
 */
export const formatDate = (
  dateString: string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
): string => {
  if (!dateString) return 'Data não disponível';
  
  try {
    const date = new Date(dateString);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data não disponível';
    }
    
    return date.toLocaleString('pt-BR', options);
  } catch (error) {
    return 'Data não disponível';
  }
};