const PHONE_DIGITS = /^\d{10,11}$/;

export function normalizePhone(value) {
  const phone = String(value ?? '').replace(/\D/g, '');
  if (!PHONE_DIGITS.test(phone)) {
    throw new TypeError('Telefone inválido — informe DDD + número.');
  }
  return phone;
}

export function internalEmailForPhone(phone) {
  return `${normalizePhone(phone)}@phone.bloco.local`;
}

export function normalizeAppOrigin(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new TypeError('APP_URL precisa usar HTTP ou HTTPS.');
  }
  return url.origin;
}

export function authResponse(user, balanceCents = 0) {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name,
      phone: user.phone ?? null,
    },
    balanceCents: Number(balanceCents),
  };
}
