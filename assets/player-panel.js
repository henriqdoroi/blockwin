(() => {
  'use strict';
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const preview = new URLSearchParams(location.search).get('preview') === '1' || location.protocol === 'file:';
  const state = { user: null, balanceCents: 0, config: null, selectedCents: 3000, activeSheet: null, trigger: null, deferredInstall: null };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const api = async (url, options = {}) => {
    const response = await fetch(url, { credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...(options.headers || {}) }, ...options });
    if (response.status === 401) throw Object.assign(new Error('Sessão expirada.'), { status: 401 });
    let body = {}; try { body = await response.json(); } catch {}
    if (!response.ok) throw new Error(body.error?.message || body.message || 'Não foi possível concluir a operação.');
    return body;
  };
  const defaults = {
    tiers: [500, 1000, 2000, 3000, 5000, 10000], minEntryCents: 500, maxEntryCents: 10000,
    rewardMultiplier: 5, rewardLabel: 'Recompensa mínima', depositOptions: [2000, 3000, 4000, 5000, 10000, 20000],
    depositMinCents: 2000, withdrawMinCents: 3000, withdrawNotice: 'Solicitações são analisadas em até 24 horas úteis.', platformName: 'Bloco Play'
  };
  function normalizeBootstrap(data) {
    const config = data.publicConfig || data.config || {};
    const wallet = data.wallet || {};
    return {
      user: data.user || {}, balanceCents: Number(wallet.availableBalanceCents ?? data.balanceCents ?? 0), onlineCount: Number.isFinite(data.onlineCount) ? data.onlineCount : null,
      config: { ...defaults, ...config, tiers: (data.gameTiers || config.tiers || defaults.tiers).map(t => Number(t.entryAmountCents ?? t.entryAmount * 100 ?? t)), rewardMultiplier: Number(config.rewardMultiplier || defaults.rewardMultiplier) }
    };
  }
  async function bootstrap() {
    try {
      const raw = preview ? { user: { name: 'Jogador de demonstração', referralCode: 'PREVIA8F2K' }, balanceCents: 0, config: { ...defaults }, onlineCount: null } : await api('/api/panel/bootstrap');
      const data = normalizeBootstrap(raw); state.user = data.user; state.balanceCents = data.balanceCents; state.config = data.config;
      render();
    } catch (error) {
      if (error.status === 401) { location.replace('/login?redirect=%2Fpainel'); return; }
      try {
        const me = await api('/api/auth/me'); const publicConfig = await api('/api/public/config').catch(() => ({}));
        const data = normalizeBootstrap({ ...me, config: publicConfig }); state.user = data.user; state.balanceCents = data.balanceCents; state.config = data.config; render();
      } catch (fallbackError) {
        if (fallbackError.status === 401) location.replace('/login?redirect=%2Fpainel');
        else showFatal('Não foi possível carregar seu painel. Verifique a conexão e tente novamente.');
      }
    }
  }
  function render() {
    $('#panel').setAttribute('aria-busy', 'false');
    $('#headerBalance').textContent = money.format(state.balanceCents / 100);
    const name = state.user.name || state.user.fullName || 'Jogador'; $('#avatarButton').textContent = name.trim()[0]?.toUpperCase() || 'J';
    $('#rewardLabel').textContent = state.config.rewardLabel; renderTiers(); updateEntry(state.selectedCents);
    if (state.onlineCount > 0) { $('#onlineCount').hidden = false; $('#onlineCount span').textContent = state.onlineCount; }
    setupInstallBar();
  }
  function renderTiers() {
    $('#tierButtons').innerHTML = state.config.tiers.map(cents => `<button class="tier-button${cents === state.selectedCents ? ' selected' : ''}" type="button" data-cents="${cents}" aria-pressed="${cents === state.selectedCents}">${money.format(cents / 100).replace(',00', '')}</button>`).join('');
  }
  function parseCurrency(value) { const digits = value.replace(/\D/g, ''); return digits ? Number(digits) : 0; }
  function updateEntry(cents) {
    state.selectedCents = Math.min(state.config.maxEntryCents, Math.max(0, cents));
    $('#customEntry').value = (state.selectedCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    $('#rewardValue').textContent = money.format((state.selectedCents * state.config.rewardMultiplier) / 100);
    $$('.tier-button').forEach(button => { const selected = Number(button.dataset.cents) === state.selectedCents; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', selected); });
    const button = $('#playButton'); const valid = state.selectedCents >= state.config.minEntryCents && state.selectedCents <= state.config.maxEntryCents;
    button.disabled = !valid; button.textContent = state.balanceCents < state.selectedCents ? 'Depositar para jogar' : 'Jogar agora';
  }
  function setNav(active) { $$('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.sheet === active || (active === null && b.id === 'homeAction'))); }
  function openSheet(type, trigger = document.activeElement) {
    state.activeSheet = type; state.trigger = trigger; setNav(type); $('#sheetRoot').hidden = false; document.body.style.overflow = 'hidden';
    $('#sheetContent').innerHTML = sheetMarkup(type); bindSheet(type); history.pushState({ panelSheet: type }, '', location.href); requestAnimationFrame(() => $('#sheet').focus());
  }
  function closeSheet(fromHistory = false) {
    if (!state.activeSheet) return; state.activeSheet = null; $('#sheetRoot').hidden = true; document.body.style.overflow = ''; setNav(null);
    if (!fromHistory && history.state?.panelSheet) history.back(); state.trigger?.focus?.();
  }
  function banner(kicker, title, accent) { return `<header class="sheet-banner"><div><small>${kicker}</small><h2 id="sheetTitle">${title}<br><span>${accent}</span></h2></div></header>`; }
  function sheetMarkup(type) {
    if (type === 'deposit') return `${banner('CARTEIRA DIGITAL', 'ADICIONE SALDO', 'COM SEGURANÇA')}<div class="sheet-body"><div class="quick-card"><p class="section-label">VALOR RÁPIDO</p><div class="quick-grid">${state.config.depositOptions.map((c, i) => `<button class="quick-option" type="button" data-deposit-cents="${c}"><small>${['MÍNIMO','POPULAR','PRÁTICO','DESTAQUE','MAIOR','MAIOR'][i] || 'OPÇÃO'}</small>${money.format(c/100).replace(',00','')}</button>`).join('')}</div><label class="form-field"><span>Valor do depósito</span><span class="input-shell">R$ <input id="depositAmount" inputmode="decimal" placeholder="Mínimo ${money.format(state.config.depositMinCents/100)}"></span></label></div><label class="checkbox-row"><input id="couponToggle" type="checkbox"> Tenho um cupom</label><label id="couponField" class="form-field" hidden><span>Código do cupom</span><span class="input-shell"><input id="couponCode" maxlength="32" autocomplete="off"></span></label><button id="depositSubmit" class="submit-button" type="button">Gerar cobrança PIX</button>${preview ? '<div class="notice">Prévia visual: nenhuma cobrança será criada neste modo.</div>' : ''}</div>`;
    if (type === 'withdraw') return `${banner('RESGATE SANDBOX', 'SOLICITE SEU', 'SAQUE')}<form id="withdrawForm" class="sheet-body"><div class="balance-card"><i>R$</i><div><span>SALDO DISPONÍVEL</span><strong>${money.format(state.balanceCents/100)}</strong></div></div><label class="form-field"><span>Valor</span><span class="input-shell">R$ <input name="amount" inputmode="decimal" required placeholder="Mínimo ${money.format(state.config.withdrawMinCents/100)}"></span></label><label class="form-field"><span>Chave PIX</span><span class="input-shell"><input name="pixKey" required autocomplete="off" placeholder="E-mail, telefone ou chave aleatória"></span></label><label class="form-field"><span>CPF do titular</span><span class="input-shell"><input name="cpf" inputmode="numeric" maxlength="14" required placeholder="Somente números"></span></label><div class="notice">${state.config.withdrawNotice} Ambiente de demonstração: nenhum PIX real é enviado.</div><button class="submit-button" type="submit">Solicitar saque</button></form>`;
    if (type === 'referral') { const link = `${location.origin}/cadastro?ref=${encodeURIComponent(state.user.referralCode || '')}`; return `${banner('PROGRAMA DE PARCERIA', 'CONVIDE AMIGOS', 'CRESÇAM JUNTOS')}<div class="sheet-body"><div class="referral-summary"><span>SALDO DE COMISSÕES</span><span>INDICADOS</span><strong id="commissionBalance">—</strong><strong id="referralTotal">—</strong><button id="commissionWithdraw" type="button" disabled>Sacar comissões</button></div><div class="link-card"><label for="referralLink">SEU LINK EXCLUSIVO</label><div class="copy-line"><input id="referralLink" readonly value="${escapeHtml(link)}"><button class="copy-button" data-copy="#referralLink" type="button">COPIAR</button></div></div><div id="referralLevels" class="levels">${[1,2,3,4].map(n=>`<article class="level-card"><h3>N${n}</h3><p>${n===1?'diretos':n+'º nível'}</p><strong>—</strong><span>CARREGANDO</span></article>`).join('')}</div><div id="commissionHistory" class="empty-state">Carregando histórico...</div></div>`; }
    return profileMarkup();
  }
  function profileMarkup() { const name = escapeHtml(state.user.name || state.user.fullName || 'Jogador'); const phone = maskPhone(state.user.phone || ''); const link = `${location.origin}/cadastro?ref=${encodeURIComponent(state.user.referralCode || '')}`; return `<h2 id="sheetTitle" class="profile-heading">Perfil</h2><div class="profile-card"><span class="profile-avatar">${name[0] || 'J'}</span><div class="profile-info"><strong>${name}</strong><span>${phone || 'Telefone não informado'}</span><small>${escapeHtml(link)}</small></div></div><div id="profileStats" class="stats-grid">${[['—','Partidas'],['—','Resgates'],['—','Total ganho'],['—','Maior resgate']].map(x=>`<div class="stat-card"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div><details class="accordion"><summary>ÚLTIMAS TRANSAÇÕES</summary><div id="transactions" class="accordion-body">Carregando...</div></details><details class="accordion"><summary>HISTÓRICO DE PARTIDAS</summary><div id="games" class="accordion-body">Carregando...</div></details><details class="accordion"><summary>ALTERAR SENHA</summary><form id="passwordForm" class="accordion-body"><label class="form-field"><span>Senha atual</span><span class="input-shell"><input name="currentPassword" type="password" required autocomplete="current-password"></span></label><label class="form-field"><span>Nova senha</span><span class="input-shell"><input name="newPassword" type="password" minlength="8" required autocomplete="new-password"></span></label><label class="form-field"><span>Confirmar nova senha</span><span class="input-shell"><input name="confirmation" type="password" minlength="8" required autocomplete="new-password"></span></label><button class="secondary-button" type="submit">SALVAR NOVA SENHA</button></form></details><div class="profile-actions"><button id="logoutButton" class="danger-button" type="button">SAIR DA CONTA</button></div>`; }
  function bindSheet(type) {
    if (type === 'deposit') bindDeposit(); if (type === 'withdraw') bindWithdraw(); if (type === 'referral') loadReferrals(); if (type === 'profile') bindProfile();
    $$('[data-copy]').forEach(b => b.addEventListener('click', () => copyValue($(b.dataset.copy))));
  }
  function bindDeposit() {
    $$('.quick-option').forEach(b => b.addEventListener('click', () => { $$('.quick-option').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); $('#depositAmount').value=(Number(b.dataset.depositCents)/100).toLocaleString('pt-BR',{minimumFractionDigits:2}); }));
    $('#couponToggle').addEventListener('change', e => $('#couponField').hidden = !e.target.checked);
    $('#depositSubmit').addEventListener('click', async e => { const cents=parseCurrency($('#depositAmount').value); if(cents<state.config.depositMinCents) return toast(`O depósito mínimo é ${money.format(state.config.depositMinCents/100)}.`); if(preview) return toast('Prévia visual: operação financeira desativada.'); setLoading(e.currentTarget,true); try { const result=await api('/api/deposits',{method:'POST',body:JSON.stringify({amountCents:cents,couponCode:$('#couponCode')?.value.trim()||undefined,idempotencyKey:crypto.randomUUID()})}); toast('Cobrança criada com segurança.'); renderPix(result); } catch(err){toast(err.message)} finally{setLoading(e.currentTarget,false)} });
  }
  function renderPix(charge) { $('#sheetContent').innerHTML = `${banner('PIX SANDBOX','COBRANÇA','GERADA')}<div class="sheet-body"><div class="info-card" style="padding:20px;text-align:center"><p>Valor</p><h2>${money.format((charge.amountCents||0)/100)}</h2><p>Status: ${escapeHtml(charge.status||'AGUARDANDO')}</p><div class="copy-line"><input id="pixCode" readonly value="${escapeHtml(charge.copyPasteCode||'')}"/><button class="copy-button" data-copy="#pixCode">COPIAR</button></div><small>ID ${escapeHtml(charge.id||'')}</small></div></div>`; $$('[data-copy]').forEach(b=>b.onclick=()=>copyValue($(b.dataset.copy))); }
  function bindWithdraw(){ $('#withdrawForm').addEventListener('submit',async e=>{e.preventDefault();const button=$('button[type=submit]',e.currentTarget),form=new FormData(e.currentTarget),cents=parseCurrency(form.get('amount'));if(cents<state.config.withdrawMinCents)return toast(`O saque mínimo é ${money.format(state.config.withdrawMinCents/100)}.`);if(cents>state.balanceCents)return toast('Saldo insuficiente.');if(!validCpf(form.get('cpf')))return toast('Informe um CPF válido.');if(preview)return toast('Prévia visual: saque sandbox desativado.');setLoading(button,true);try{await api('/api/withdrawals',{method:'POST',body:JSON.stringify({amountCents:cents,pixKey:form.get('pixKey'),cpf:String(form.get('cpf')).replace(/\D/g,''),idempotencyKey:crypto.randomUUID()})});toast('Saque solicitado para análise.');closeSheet()}catch(err){toast(err.message)}finally{setLoading(button,false)}}); }
  async function loadReferrals(){ if(preview){renderReferralData({commissionBalanceCents:0,totalReferrals:0,levels:[1,2,3,4].map(level=>({level,count:0,volumeCents:0,commissionCents:0})),history:[]});return} try{renderReferralData(await api('/api/referrals'))}catch(e){$('#commissionHistory').textContent=e.message} }
  function renderReferralData(data){$('#commissionBalance').textContent=money.format((data.commissionBalanceCents||0)/100);$('#referralTotal').textContent=data.totalReferrals||0;$('#referralLevels').innerHTML=(data.levels||[]).map(x=>`<article class="level-card"><h3>N${x.level}</h3><p>${x.level===1?'diretos':x.level+'º nível'}</p><strong>${x.count||0}</strong><span>INDICADOS</span><b>${money.format((x.volumeCents||0)/100)}</b><span>VOLUME CONFIRMADO</span></article>`).join('');$('#commissionHistory').textContent=data.history?.length?'Histórico disponível.':'Nenhuma comissão recebida ainda.'}
  function bindProfile(){ $('#avatarButton').blur(); $('#passwordForm').addEventListener('submit',changePassword); $('#logoutButton').addEventListener('click',logout); loadProfile(); }
  async function loadProfile(){ if(preview){renderProfileData({stats:{games:0,withdrawals:0,totalWonCents:0,biggestRewardCents:0},transactions:[],games:[]});return} try{renderProfileData(await api('/api/profile'))}catch(e){$('#transactions').textContent=e.message;$('#games').textContent=e.message} }
  function renderProfileData(data){const s=data.stats||{};$('#profileStats').innerHTML=[[s.games||0,'Partidas'],[s.withdrawals||0,'Resgates'],[money.format((s.totalWonCents||0)/100),'Total ganho'],[money.format((s.biggestRewardCents||0)/100),'Maior resgate']].map(x=>`<div class="stat-card"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('');$('#transactions').textContent=data.transactions?.length?`${data.transactions.length} transações encontradas.`:'Nenhuma transação ainda.';$('#games').textContent=data.games?.length?`${data.games.length} partidas encontradas.`:'Você ainda não jogou nenhuma partida.'}
  async function changePassword(e){e.preventDefault();const fd=new FormData(e.currentTarget);if(fd.get('newPassword')!==fd.get('confirmation'))return toast('As novas senhas não coincidem.');if(preview)return toast('Prévia visual: alteração de senha desativada.');const button=$('button',e.currentTarget);setLoading(button,true);try{await api('/api/profile/password',{method:'PATCH',body:JSON.stringify({currentPassword:fd.get('currentPassword'),newPassword:fd.get('newPassword')})});e.currentTarget.reset();toast('Senha atualizada com sucesso.')}catch(err){toast(err.message)}finally{setLoading(button,false)}}
  async function logout(){try{if(!preview)await api('/api/auth/logout',{method:'POST'})}finally{location.replace('/login')}}
  async function startGame(){if(state.balanceCents<state.selectedCents)return openSheet('deposit',$('#playButton'));const b=$('#playButton');setLoading(b,true);try{const result=await api('/api/game/start',{method:'POST',body:JSON.stringify({entryAmountCents:state.selectedCents,idempotencyKey:crypto.randomUUID()})});sessionStorage.setItem('activeGameId',result.id);toast('Partida criada.');location.href='/painel#jogo'}catch(e){if(e.status===401)location.replace('/login?redirect=%2Fpainel');else toast(e.message)}finally{setLoading(b,false)}}
  function setLoading(button,on){button.disabled=on;button.dataset.label ||= button.textContent;button.textContent=on?'Aguarde...':button.dataset.label}
  function copyValue(input){navigator.clipboard?.writeText(input.value).then(()=>toast('Link copiado.')).catch(()=>{input.select();document.execCommand('copy');toast('Link copiado.')})}
  function toast(message){const el=document.createElement('div');el.className='toast';el.textContent=message;$('#toastRegion').append(el);setTimeout(()=>el.remove(),3500)}
  function showFatal(message){$('#panel').setAttribute('aria-busy','false');$('.panel-main').innerHTML=`<div class="error-box"><strong>Painel indisponível</strong><p>${escapeHtml(message)}</p><button class="submit-button" onclick="location.reload()">Tentar novamente</button></div>`}
  function validCpf(value){const cpf=String(value).replace(/\D/g,'');if(cpf.length!==11||/^(\d)\1+$/.test(cpf))return false;const digit=(len)=>{let sum=0;for(let i=0;i<len;i++)sum+=Number(cpf[i])*(len+1-i);const r=(sum*10)%11;return r===10?0:r};return digit(9)===Number(cpf[9])&&digit(10)===Number(cpf[10])}
  function maskPhone(v){const d=String(v).replace(/\D/g,'');return d.length>=10?`(${d.slice(0,2)}) •••••-${d.slice(-4)}`:''}
  function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function setupInstallBar(){const until=Number(localStorage.getItem('panel-install-dismissed-until')||0);if(Date.now()<until)return;$('#installBar').hidden=false;$('#installButton').disabled=!state.deferredInstall;$('#installButton').title=state.deferredInstall?'Instalar aplicativo':'Instalação não disponível neste dispositivo'}
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;setupInstallBar()});
  $('#installButton').addEventListener('click',async()=>{if(!state.deferredInstall)return toast('Use o menu do navegador para instalar.');await state.deferredInstall.prompt();state.deferredInstall=null;$('#installBar').hidden=true});
  $('.install-close').addEventListener('click',()=>{localStorage.setItem('panel-install-dismissed-until',String(Date.now()+7*86400000));$('#installBar').hidden=true});
  $('#tierButtons').addEventListener('click',e=>{const b=e.target.closest('[data-cents]');if(b)updateEntry(Number(b.dataset.cents))});
  $('#customEntry').addEventListener('input',e=>updateEntry(parseCurrency(e.target.value)));
  $('#playButton').addEventListener('click',startGame); $('#homeAction').addEventListener('click',()=>closeSheet()); $('#avatarButton').addEventListener('click',e=>openSheet('profile',e.currentTarget));
  $$('[data-sheet]').forEach(b=>b.addEventListener('click',()=>openSheet(b.dataset.sheet,b))); $$('[data-close-sheet]').forEach(b=>b.addEventListener('click',()=>closeSheet()));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.activeSheet)closeSheet();if(e.key==='Tab'&&state.activeSheet){const f=$$('button:not([disabled]),input:not([disabled]),summary,[tabindex="0"]',$('#sheet'));if(!f.length)return;const first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  window.addEventListener('popstate',()=>{if(state.activeSheet)closeSheet(true)}); bootstrap();
})();
