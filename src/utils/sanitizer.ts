export class Sanitizer {
  static sanitizeHTML(str: string): string {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m] || m));
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  static slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/\s+/g, '-') // substitui espaços por -
      .replace(/[^\w-]+/g, '') // remove caracteres não-alfanuméricos
      .replace(/--+/g, '-'); // remove hífens duplos
  }
}
