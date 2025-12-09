import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email().max(255).optional().or(z.literal('')),
  organization: z.string().trim().max(100).optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export function parseVCard(vcardContent: string): Contact[] {
  const contacts: Contact[] = [];
  const vcards = vcardContent.split(/(?=BEGIN:VCARD)/i);

  for (const vcard of vcards) {
    if (!vcard.trim()) continue;

    const contact = parseVCardEntry(vcard);
    if (contact) {
      const result = contactSchema.safeParse(contact);
      if (result.success) {
        contacts.push(result.data);
      }
    }
  }

  return contacts;
}

function parseVCardEntry(vcard: string): Partial<Contact> | null {
  const lines = vcard.split(/\r?\n/);
  const contact: Partial<Contact> = {};

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle line continuations
    while (i + 1 < lines.length && lines[i + 1].startsWith(' ')) {
      i++;
      line += lines[i].substring(1);
    }

    // Parse FN (Full Name)
    if (line.toUpperCase().startsWith('FN')) {
      const value = extractValue(line);
      if (value) contact.name = decodeVCardValue(value);
    }

    // Parse N (Name) as fallback
    if (line.toUpperCase().startsWith('N:') || line.toUpperCase().startsWith('N;')) {
      if (!contact.name) {
        const value = extractValue(line);
        if (value) {
          const parts = value.split(';');
          const lastName = parts[0] || '';
          const firstName = parts[1] || '';
          contact.name = decodeVCardValue(`${firstName} ${lastName}`.trim());
        }
      }
    }

    // Parse TEL (Phone)
    if (line.toUpperCase().startsWith('TEL')) {
      if (!contact.phone) {
        const value = extractValue(line);
        if (value) contact.phone = cleanPhoneNumber(value);
      }
    }

    // Parse EMAIL
    if (line.toUpperCase().startsWith('EMAIL')) {
      if (!contact.email) {
        const value = extractValue(line);
        if (value) contact.email = decodeVCardValue(value);
      }
    }

    // Parse ORG (Organization)
    if (line.toUpperCase().startsWith('ORG')) {
      const value = extractValue(line);
      if (value) contact.organization = decodeVCardValue(value.split(';')[0]);
    }
  }

  if (!contact.name) return null;
  return contact;
}

function extractValue(line: string): string | null {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) return null;
  return line.substring(colonIndex + 1).trim();
}

function decodeVCardValue(value: string): string {
  // Handle quoted-printable encoding
  value = value.replace(/=\r?\n/g, '');
  value = value.replace(/=([\dA-Fa-f]{2})/g, (_, hex) => 
    String.fromCharCode(parseInt(hex, 16))
  );
  
  // Handle escaped characters
  value = value.replace(/\\n/gi, '\n');
  value = value.replace(/\\;/g, ';');
  value = value.replace(/\\,/g, ',');
  value = value.replace(/\\\\/g, '\\');
  
  return value.trim();
}

function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+\-\s()]/g, '').trim();
}
