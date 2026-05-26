/**
 * Configuração central de API para o sistema Auto Limpeza Pro
 * Garante que todas as chamadas sigam o padrão do backend PHP
 */

const IS_PROD = import.meta.env.PROD;

// Em produção usamos o path relativo para o cPanel/HostGator
// Em desenvolvimento podemos apontar para um servidor local se necessário
export const API_BASE_URL = IS_PROD 
  ? '/api/api.php?action=' 
  : '/api/api.php?action=';

/**
 * Helper para construir URLs de API de forma padronizada
 */
export const getApiUrl = (action: string) => `${API_BASE_URL}${action}`;
