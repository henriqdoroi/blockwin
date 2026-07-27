import test from 'node:test';
import assert from 'node:assert/strict';
import { authResponse, internalEmailForPhone, normalizeAppOrigin, normalizePhone } from '../server/src/auth-contract.js';

test('normaliza os formatos de telefone aceitos pela tela existente', () => {
  assert.equal(normalizePhone('(55) 14998-1396'), '55149981396');
  assert.equal(normalizePhone('(14) 99813-9675'), '14998139675');
  assert.equal(normalizePhone('1499813967'), '1499813967');
});

test('recusa telefone incompleto ou excessivo', () => {
  assert.throws(() => normalizePhone('123'), /Telefone inválido/);
  assert.throws(() => normalizePhone('551499813967'), /Telefone inválido/);
});

test('gera e-mail interno determinístico sem expor domínio externo', () => {
  assert.equal(internalEmailForPhone('(14) 99813-9675'), '14998139675@phone.bloco.local');
});

test('normaliza APP_URL e remove barra final/caminho', () => {
  assert.equal(normalizeAppOrigin('https://example.com/'), 'https://example.com');
  assert.equal(normalizeAppOrigin('https://example.com/painel'), 'https://example.com');
  assert.throws(() => normalizeAppOrigin('file:///tmp/index.html'), /HTTP ou HTTPS/);
});

test('mantém o contrato esperado pelo bundle de login e cadastro', () => {
  assert.deepEqual(authResponse({ id: 'u1', email: 'a@b.c', full_name: 'Ana', phone: '14999999999' }, '2500'), {
    user: { id: 'u1', email: 'a@b.c', name: 'Ana', phone: '14999999999' },
    balanceCents: 2500,
  });
});
