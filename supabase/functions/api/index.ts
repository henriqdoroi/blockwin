import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2.49.8';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:4173';
const PLATFORM_MODE = Deno.env.get('PLATFORM_MODE') || 'sandbox';
const isProduction = Deno.env.get('ENVIRONMENT') === 'production';

const json = (body: unknown, status = 200, headers: HeadersInit = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
const cookies = (request: Request) => Object.fromEntries((request.headers.get('cookie') || '').split(';').map(v => v.trim().split(/=(.*)/s).slice(0, 2)).filter(x => x[0]).map(([k,v]) => [k, decodeURIComponent(v)]));
const cookie = (name: string, value: string, maxAge: number) => `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isProduction ? '; Secure' : ''}`;
const clearCookies = () => [['Set-Cookie', cookie('bp_access', '', 0)], ['Set-Cookie', cookie('bp_refresh', '', 0)]] as [string,string][];
const sessionHeaders = (session: { access_token: string; refresh_token: string; expires_in: number }) => [['Set-Cookie', cookie('bp_access', session.access_token, session.expires_in)], ['Set-Cookie', cookie('bp_refresh', session.refresh_token, 60 * 60 * 24 * 30)]] as [string,string][];
const camel = (row: Record<string, unknown>) => Object.fromEntries(Object.entries(row).map(([k,v]) => [k.replace(/_([a-z])/g,(_,c)=>c.toUpperCase()),v]));

function cors(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin === APP_URL || (!isProduction && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))) return { 'Access-Control-Allow-Origin': origin || APP_URL, 'Access-Control-Allow-Credentials': 'true', 'Vary': 'Origin' };
  return null;
}
function clientFor(request: Request) {
  const token = cookies(request).bp_access || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return createClient(SUPABASE_URL, ANON_KEY, { global: { headers: token ? { Authorization: `Bearer ${token}` } : {} }, auth: { persistSession: false } });
}
async function requireUser(client: SupabaseClient) {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new ApiError(401, 'UNAUTHORIZED', 'Sua sessão expirou.');
  return data.user;
}
class ApiError extends Error { constructor(public status: number, public code: string, message: string) { super(message); } }
async function body(request: Request) { try { return await request.json(); } catch { throw new ApiError(400, 'INVALID_JSON', 'Corpo JSON inválido.'); } }
function ensureIdempotency(value: unknown) { if (typeof value !== 'string' || !/^[a-zA-Z0-9:_-]{8,100}$/.test(value)) throw new ApiError(400,'INVALID_IDEMPOTENCY_KEY','Chave de idempotência inválida.'); return value; }

async function bootstrap(client: SupabaseClient) {
  const user = await requireUser(client);
  const [profile, wallet, tiers, settings, preferences, stats] = await Promise.all([
    client.from('profiles').select('full_name,phone,referral_code,status').eq('id',user.id).single(),
    client.from('wallets').select('available_balance_cents,reserved_balance_cents,commission_balance_cents,currency').eq('user_id',user.id).single(),
    client.from('game_tiers').select('id,entry_amount_cents,reward_multiplier,target_score,min_entry_cents,max_entry_cents,config_version').eq('enabled',true).order('display_order'),
    client.from('platform_settings').select('key,value').eq('public',true),
    client.from('user_preferences').select('sound_enabled,vibration_enabled').eq('user_id',user.id).single(),
    client.from('game_sessions').select('status,reward_amount_cents').eq('user_id',user.id)
  ]);
  for (const result of [profile,wallet,tiers,settings,preferences,stats]) if (result.error) throw result.error;
  if (profile.data.status !== 'ACTIVE') throw new ApiError(403,'ACCOUNT_INACTIVE','Conta indisponível.');
  const publicConfig = Object.assign({}, ...settings.data.filter(x=>x.key==='public_config'||x.key==='score_config').map(x=>x.value));
  return { user: { id:user.id, email:user.email, name:profile.data.full_name, phone:profile.data.phone, referralCode:profile.data.referral_code }, wallet: camel(wallet.data), gameTiers: tiers.data.map(camel), publicConfig, preferences: camel(preferences.data), stats: { games:stats.data.length, totalWonCents:stats.data.filter(x=>x.status==='SETTLED').reduce((a,x)=>a+Number(x.reward_amount_cents||0),0) }, onlineCount:null, platformMode:PLATFORM_MODE };
}

async function referrals(client: SupabaseClient, userId: string) {
  const service = createClient(SUPABASE_URL, SERVICE_KEY, { auth:{persistSession:false} });
  const [{data:wallet,error:we},{data:profile,error:pe},{data:commissions,error:ce}] = await Promise.all([
    client.from('wallets').select('commission_balance_cents').eq('user_id',userId).single(),
    client.from('profiles').select('referral_code').eq('id',userId).single(),
    client.from('referral_commissions').select('level,amount_cents,created_at,status').eq('beneficiary_id',userId).order('created_at',{ascending:false}).limit(50)
  ]); if(we||pe||ce) throw we||pe||ce;
  let current=[userId]; const levels=[];
  for(let level=1;level<=4;level++) { const {data,error}=await service.from('profiles').select('id').in('referred_by',current); if(error)throw error; current=(data||[]).map(x=>x.id); const levelCom=(commissions||[]).filter(x=>x.level===level); levels.push({level,count:current.length,volumeCents:0,commissionCents:levelCom.reduce((a,x)=>a+Number(x.amount_cents),0)}); if(!current.length) current=['00000000-0000-0000-0000-000000000000']; }
  return { referralCode:profile.referral_code, commissionBalanceCents:wallet.commission_balance_cents, totalReferrals:levels.reduce((a,x)=>a+x.count,0), levels, history:(commissions||[]).map(camel) };
}

Deno.serve(async (request) => {
  const corsHeaders = cors(request); if (!corsHeaders) return json({error:{code:'CORS_DENIED',message:'Origem não autorizada.'}},403);
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:{...corsHeaders,'Access-Control-Allow-Headers':'authorization,content-type,x-requested-with','Access-Control-Allow-Methods':'GET,POST,PATCH,OPTIONS'}});
  try {
    if (!['GET','HEAD'].includes(request.method) && request.headers.get('x-requested-with') !== 'XMLHttpRequest') throw new ApiError(403,'CSRF_CHECK_FAILED','Requisição recusada.');
    const url = new URL(request.url); const path = url.pathname.replace(/^\/api(?:\/api)?/,'') || '/'; const client=clientFor(request);
    if(path==='/auth/register'&&request.method==='POST'){const b=await body(request);const {data,error}=await client.auth.signUp({email:b.email,password:b.password,options:{data:{full_name:b.name||b.fullName,phone:b.phone,referral_code:b.referralCode||b.ref}}});if(error)throw new ApiError(400,'REGISTER_FAILED',error.message);return json({user:data.user},201,corsHeaders)}
    if(path==='/auth/login'&&request.method==='POST'){const b=await body(request);const {data,error}=await client.auth.signInWithPassword({email:b.email,password:b.password});if(error||!data.session)throw new ApiError(401,'INVALID_CREDENTIALS','E-mail ou senha inválidos.');return json({user:data.user},200,new Headers([...Object.entries(corsHeaders),...sessionHeaders(data.session)]))}
    if(path==='/auth/refresh'&&request.method==='POST'){const refresh=cookies(request).bp_refresh;if(!refresh)throw new ApiError(401,'NO_REFRESH_TOKEN','Sessão encerrada.');const {data,error}=await client.auth.refreshSession({refresh_token:refresh});if(error||!data.session)throw new ApiError(401,'REFRESH_FAILED','Sessão encerrada.');return json({ok:true},200,new Headers([...Object.entries(corsHeaders),...sessionHeaders(data.session)]))}
    if(path==='/auth/logout'&&request.method==='POST'){await client.auth.signOut();return json({ok:true},200,new Headers([...Object.entries(corsHeaders),...clearCookies()]))}
    if(path==='/auth/me'&&request.method==='GET'){const data=await bootstrap(client);return json({user:data.user,balanceCents:data.wallet.availableBalanceCents},200,corsHeaders)}
    if(path==='/public/config'&&request.method==='GET'){const publicClient=createClient(SUPABASE_URL,ANON_KEY,{auth:{persistSession:false}});const {data,error}=await publicClient.from('platform_settings').select('value').eq('key','public_config').eq('public',true).single();if(error)throw error;return json(data.value,200,corsHeaders)}
    const user=await requireUser(client);
    if(path==='/panel/bootstrap'&&request.method==='GET')return json(await bootstrap(client),200,corsHeaders);
    if(path==='/deposits'&&request.method==='POST'){if(PLATFORM_MODE!=='sandbox')throw new ApiError(503,'PROVIDER_NOT_CONFIGURED','Provedor de pagamento indisponível.');const b=await body(request);const {data,error}=await client.rpc('create_sandbox_deposit',{p_amount_cents:b.amountCents,p_coupon_code:b.couponCode||null,p_idempotency_key:ensureIdempotency(b.idempotencyKey)});if(error)throw error;return json(camel(data),201,corsHeaders)}
    const dep=path.match(/^\/deposits\/([0-9a-f-]+)$/i);if(dep&&request.method==='GET'){const {data,error}=await client.from('deposits').select('id,amount_cents,status,copy_paste_code,provider_charge_id,expires_at,approved_at').eq('id',dep[1]).single();if(error)throw error;return json(camel(data),200,corsHeaders)}
    const sim=path.match(/^\/deposits\/([0-9a-f-]+)\/simulate-payment$/i);if(sim&&request.method==='POST'){if(isProduction||PLATFORM_MODE!=='sandbox')throw new ApiError(403,'SIMULATION_DISABLED','Simulação desativada.');const service=createClient(SUPABASE_URL,SERVICE_KEY,{auth:{persistSession:false}});const {data:owned,error:oe}=await client.from('deposits').select('id').eq('id',sim[1]).single();if(oe||!owned)throw new ApiError(404,'NOT_FOUND','Cobrança não encontrada.');const {data,error}=await service.rpc('approve_sandbox_deposit',{p_deposit_id:sim[1]});if(error)throw error;return json({wallet:camel(data)},200,corsHeaders)}
    if(path==='/withdrawals'&&request.method==='POST'){const b=await body(request);const {data,error}=await client.rpc('request_withdrawal',{p_amount_cents:b.amountCents,p_pix_key:b.pixKey,p_cpf:String(b.cpf||'').replace(/\D/g,''),p_idempotency_key:ensureIdempotency(b.idempotencyKey)});if(error)throw error;return json(camel(data),201,corsHeaders)}
    if(path==='/withdrawals'&&request.method==='GET'){const {data,error}=await client.from('withdrawals').select('id,amount_cents,fee_cents,status,cpf_last4,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50);if(error)throw error;return json({items:data.map(camel)},200,corsHeaders)}
    if(path==='/referrals'&&request.method==='GET')return json(await referrals(client,user.id),200,corsHeaders);
    if(path==='/profile'&&request.method==='GET'){const boot=await bootstrap(client);const [{data:tx},{data:games}]=await Promise.all([client.from('wallet_transactions').select('id,type,amount_cents,status,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(20),client.from('game_sessions').select('id,entry_amount_cents,reward_amount_cents,score,status,started_at,finished_at').eq('user_id',user.id).order('started_at',{ascending:false}).limit(20)]);return json({...boot.user,stats:{...boot.stats,withdrawals:0,biggestRewardCents:Math.max(0,...(games||[]).map(x=>Number(x.reward_amount_cents||0)))},transactions:(tx||[]).map(camel),games:(games||[]).map(camel)},200,corsHeaders)}
    if(path==='/profile/password'&&request.method==='PATCH'){const b=await body(request);if(typeof b.currentPassword!=='string'||!user.email)throw new ApiError(400,'CURRENT_PASSWORD_REQUIRED','Informe a senha atual.');if(typeof b.newPassword!=='string'||b.newPassword.length<8)throw new ApiError(400,'WEAK_PASSWORD','A senha deve ter ao menos 8 caracteres.');const verifier=createClient(SUPABASE_URL,ANON_KEY,{auth:{persistSession:false}});const {error:verifyError}=await verifier.auth.signInWithPassword({email:user.email,password:b.currentPassword});if(verifyError)throw new ApiError(400,'INVALID_CURRENT_PASSWORD','A senha atual está incorreta.');const {error}=await client.auth.updateUser({password:b.newPassword});if(error)throw error;return json({ok:true},200,corsHeaders)}
    if(path==='/game/start'&&request.method==='POST'){const b=await body(request);const {data,error}=await client.rpc('start_game',{p_entry_amount_cents:b.entryAmountCents,p_idempotency_key:ensureIdempotency(b.idempotencyKey)});if(error)throw error;return json(camel(data),201,corsHeaders)}
    throw new ApiError(404,'NOT_FOUND','Endpoint não encontrado.');
  } catch(error) {
    console.error(JSON.stringify({event:'api_error',message:error instanceof Error?error.message:String(error)}));
    const known=error instanceof ApiError; const message=known?error.message:(isProduction?'Não foi possível concluir a operação.':error instanceof Error?error.message:'Erro inesperado.');
    return json({error:{code:known?error.code:'DATABASE_ERROR',message}},known?error.status:400,corsHeaders);
  }
});
