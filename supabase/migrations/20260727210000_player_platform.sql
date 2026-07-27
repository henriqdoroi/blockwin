-- Player platform foundation. Monetary values are integer cents; all balance
-- mutations happen inside SECURITY DEFINER functions with row locks.
create extension if not exists pgcrypto;

create type public.account_status as enum ('ACTIVE','SUSPENDED','CLOSED');
create type public.platform_role as enum ('PLAYER','ADMIN');
create type public.ledger_type as enum ('SANDBOX_DEPOSIT','GAME_ENTRY_RESERVE','GAME_ENTRY','GAME_REWARD','WITHDRAWAL_RESERVE','WITHDRAWAL_RELEASE','WITHDRAWAL_PAID','REFERRAL_COMMISSION','COMMISSION_WITHDRAWAL','BONUS','REFUND','ADMIN_ADJUSTMENT');
create type public.transaction_status as enum ('PENDING','COMPLETED','CANCELLED','FAILED');
create type public.deposit_status as enum ('CREATED','AWAITING_PAYMENT','APPROVED','EXPIRED','CANCELLED','FAILED');
create type public.withdrawal_status as enum ('REQUESTED','UNDER_REVIEW','APPROVED','PROCESSING','PAID','REJECTED','CANCELLED');
create type public.game_status as enum ('CREATED','ACTIVE','VALIDATING','WON','LOST','ABANDONED','INVALID','SETTLED');
create type public.commission_status as enum ('PENDING','APPROVED','AVAILABLE','PAID','CANCELLED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text,
  role public.platform_role not null default 'PLAYER',
  status public.account_status not null default 'ACTIVE',
  referral_code text not null unique check (referral_code ~ '^[A-Z0-9]{10,20}$'),
  referred_by uuid references public.profiles(id),
  referred_at timestamptz,
  referral_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (referred_by is null or referred_by <> id)
);
create index profiles_referrer_idx on public.profiles(referred_by);
create index profiles_status_idx on public.profiles(status);

create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  available_balance_cents bigint not null default 0 check (available_balance_cents >= 0),
  reserved_balance_cents bigint not null default 0 check (reserved_balance_cents >= 0),
  commission_balance_cents bigint not null default 0 check (commission_balance_cents >= 0),
  currency char(3) not null default 'BRL',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(), wallet_id uuid not null references public.wallets(id),
  user_id uuid not null references public.profiles(id), type public.ledger_type not null,
  amount_cents bigint not null check (amount_cents <> 0), previous_balance_cents bigint not null,
  new_balance_cents bigint not null check (new_balance_cents >= 0), reference_type text not null,
  reference_id uuid, status public.transaction_status not null default 'COMPLETED',
  idempotency_key text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now(),
  unique(user_id, idempotency_key)
);
create index wallet_transactions_user_created_idx on public.wallet_transactions(user_id, created_at desc);
create index wallet_transactions_reference_idx on public.wallet_transactions(reference_type, reference_id);
create index wallet_transactions_status_idx on public.wallet_transactions(status);

create table public.game_tiers (
  id uuid primary key default gen_random_uuid(), entry_amount_cents integer not null,
  reward_multiplier numeric(8,2) not null check (reward_multiplier > 0), target_score integer not null check (target_score > 0),
  min_entry_cents integer not null, max_entry_cents integer not null, enabled boolean not null default true,
  display_order integer not null, config_version integer not null default 1, created_at timestamptz not null default now(),
  unique(entry_amount_cents, config_version), check (entry_amount_cents between min_entry_cents and max_entry_cents)
);
create index game_tiers_enabled_order_idx on public.game_tiers(enabled, display_order);

create table public.platform_settings (
  key text primary key, value jsonb not null, public boolean not null default false,
  updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  sound_enabled boolean not null default true, vibration_enabled boolean not null default true,
  install_bar_dismissed_until timestamptz, updated_at timestamptz not null default now()
);

create table public.deposits (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id),
  amount_cents integer not null check (amount_cents > 0), bonus_cents integer not null default 0 check (bonus_cents >= 0),
  coupon_id uuid, provider text not null default 'sandbox' check (provider = 'sandbox'), provider_charge_id text not null unique,
  copy_paste_code text not null, status public.deposit_status not null default 'AWAITING_PAYMENT',
  idempotency_key text not null, expires_at timestamptz not null, approved_at timestamptz,
  metadata jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id, idempotency_key)
);
create index deposits_user_created_idx on public.deposits(user_id, created_at desc);
create index deposits_status_idx on public.deposits(status);

create table public.withdrawals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id),
  amount_cents integer not null check (amount_cents > 0), fee_cents integer not null default 0 check (fee_cents >= 0),
  pix_key_encrypted text not null, cpf_last4 char(4) not null, status public.withdrawal_status not null default 'REQUESTED',
  idempotency_key text not null, reviewed_by uuid references public.profiles(id), reviewed_at timestamptz,
  rejection_reason text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id, idempotency_key)
);
create index withdrawals_user_created_idx on public.withdrawals(user_id, created_at desc);
create index withdrawals_status_idx on public.withdrawals(status, created_at);

create table public.referral_level_configs (
  level smallint primary key check (level between 1 and 4), percentage numeric(6,3) not null check (percentage between 0 and 100),
  enabled boolean not null default true, max_commission_cents integer, min_deposit_cents integer not null default 2000,
  qualification_rules jsonb not null default '{}', updated_at timestamptz not null default now()
);

create table public.referral_commissions (
  id uuid primary key default gen_random_uuid(), beneficiary_id uuid not null references public.profiles(id),
  source_user_id uuid not null references public.profiles(id), level smallint not null check (level between 1 and 4),
  source_deposit_id uuid not null references public.deposits(id), base_amount_cents integer not null,
  percentage numeric(6,3) not null, amount_cents integer not null check (amount_cents > 0),
  status public.commission_status not null default 'AVAILABLE', metadata jsonb not null default '{}', created_at timestamptz not null default now(),
  unique(beneficiary_id, source_deposit_id, level)
);
create index referral_commissions_beneficiary_idx on public.referral_commissions(beneficiary_id, created_at desc);

create table public.game_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), tier_id uuid not null references public.game_tiers(id),
  seed text not null, nonce uuid not null unique default gen_random_uuid(), engine_version text not null default '1.0.0', config_version integer not null,
  entry_amount_cents integer not null, reward_amount_cents integer not null, target_score integer not null,
  score integer not null default 0, lines_cleared integer not null default 0, max_combo integer not null default 0,
  status public.game_status not null default 'ACTIVE', started_at timestamptz not null default now(), finished_at timestamptz, settled_at timestamptz,
  idempotency_key text not null, unique(user_id, idempotency_key)
);
create unique index one_active_game_per_user on public.game_sessions(user_id) where status in ('CREATED','ACTIVE','VALIDATING');
create index game_sessions_user_created_idx on public.game_sessions(user_id, started_at desc);
create index game_sessions_status_idx on public.game_sessions(status);

create table public.game_moves (
  id uuid primary key default gen_random_uuid(), game_id uuid not null references public.game_sessions(id) on delete cascade,
  move_index integer not null check (move_index >= 0), piece_id text not null, position_x smallint not null, position_y smallint not null,
  relative_timestamp_ms integer not null check (relative_timestamp_ms >= 0), move_nonce uuid not null,
  created_at timestamptz not null default now(), unique(game_id, move_index), unique(game_id, move_nonce)
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id), action text not null,
  target_type text not null, target_id text, before_data jsonb, after_data jsonb, ip_hash text,
  created_at timestamptz not null default now()
);
create index admin_audit_created_idx on public.admin_audit_logs(created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger wallets_touch before update on public.wallets for each row execute function public.touch_updated_at();
create trigger deposits_touch before update on public.deposits for each row execute function public.touch_updated_at();
create trigger withdrawals_touch before update on public.withdrawals for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare code text; referrer uuid;
begin
  loop code := upper(substr(encode(gen_random_bytes(10),'hex'),1,12)); exit when not exists(select 1 from profiles where referral_code=code); end loop;
  if new.raw_user_meta_data->>'referral_code' is not null then select id into referrer from profiles where referral_code=upper(new.raw_user_meta_data->>'referral_code') and status='ACTIVE'; end if;
  insert into profiles(id,full_name,phone,referral_code,referred_by,referred_at)
  values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'),''),'Jogador'),new.raw_user_meta_data->>'phone',code,referrer,case when referrer is null then null else now() end);
  insert into wallets(user_id) values(new.id); insert into user_preferences(user_id) values(new.id); return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.require_active_user() returns uuid language plpgsql stable security definer set search_path=public as $$
declare uid uuid := auth.uid(); begin if uid is null or not exists(select 1 from profiles where id=uid and status='ACTIVE') then raise exception 'UNAUTHORIZED' using errcode='42501'; end if; return uid; end $$;

create or replace function public.create_sandbox_deposit(p_amount_cents integer,p_coupon_code text,p_idempotency_key text)
returns public.deposits language plpgsql security definer set search_path=public as $$
declare uid uuid:=require_active_user(); result deposits; min_amount integer;
begin
  select coalesce((value->>'depositMinCents')::integer,2000) into min_amount from platform_settings where key='public_config';
  min_amount:=coalesce(min_amount,2000); if p_amount_cents<min_amount or p_amount_cents>1000000 then raise exception 'INVALID_DEPOSIT_AMOUNT'; end if;
  select * into result from deposits where user_id=uid and idempotency_key=p_idempotency_key; if found then return result; end if;
  insert into deposits(user_id,amount_cents,provider_charge_id,copy_paste_code,idempotency_key,expires_at,metadata)
  values(uid,p_amount_cents,'sbx_'||replace(gen_random_uuid()::text,'-',''),'00020126SANDBOX.BLOCO.PLAY.'||replace(gen_random_uuid()::text,'-',''),p_idempotency_key,now()+interval '15 minutes',jsonb_build_object('couponCode',nullif(upper(trim(p_coupon_code)),''))) returning * into result; return result;
end $$;

create or replace function public.approve_sandbox_deposit(p_deposit_id uuid)
returns public.wallets language plpgsql security definer set search_path=public as $$
declare dep deposits; w wallets; previous bigint; ancestor uuid; cfg referral_level_configs; commission integer; level_num integer;
begin
  if current_setting('app.environment',true) not in ('development','local','test') then raise exception 'SIMULATION_DISABLED'; end if;
  select * into dep from deposits where id=p_deposit_id for update; if not found then raise exception 'DEPOSIT_NOT_FOUND'; end if;
  if dep.status='APPROVED' then select * into w from wallets where user_id=dep.user_id; return w; end if;
  if dep.status<>'AWAITING_PAYMENT' or dep.expires_at<=now() then raise exception 'DEPOSIT_NOT_PAYABLE'; end if;
  select * into w from wallets where user_id=dep.user_id for update; previous:=w.available_balance_cents;
  update wallets set available_balance_cents=available_balance_cents+dep.amount_cents+dep.bonus_cents where id=w.id returning * into w;
  update deposits set status='APPROVED',approved_at=now() where id=dep.id;
  insert into wallet_transactions(wallet_id,user_id,type,amount_cents,previous_balance_cents,new_balance_cents,reference_type,reference_id,idempotency_key)
  values(w.id,w.user_id,'SANDBOX_DEPOSIT',dep.amount_cents+dep.bonus_cents,previous,w.available_balance_cents,'DEPOSIT',dep.id,'deposit:'||dep.id);
  select referred_by into ancestor from profiles where id=dep.user_id;
  for level_num in 1..4 loop
    exit when ancestor is null; select * into cfg from referral_level_configs where level=level_num and enabled;
    if found and dep.amount_cents>=cfg.min_deposit_cents then
      commission:=least(coalesce(cfg.max_commission_cents,2147483647),floor(dep.amount_cents*cfg.percentage/100));
      if commission>0 then insert into referral_commissions(beneficiary_id,source_user_id,level,source_deposit_id,base_amount_cents,percentage,amount_cents) values(ancestor,dep.user_id,level_num,dep.id,dep.amount_cents,cfg.percentage,commission) on conflict do nothing; update wallets set commission_balance_cents=commission_balance_cents+commission where user_id=ancestor; end if;
    end if; select referred_by into ancestor from profiles where id=ancestor;
  end loop; return w;
end $$;

create or replace function public.request_withdrawal(p_amount_cents integer,p_pix_key text,p_cpf text,p_idempotency_key text)
returns public.withdrawals language plpgsql security definer set search_path=public as $$
declare uid uuid:=require_active_user(); w wallets; result withdrawals; previous bigint; min_amount integer; secret text;
begin
  select * into result from withdrawals where user_id=uid and idempotency_key=p_idempotency_key; if found then return result; end if;
  select coalesce((value->>'withdrawMinCents')::integer,3000) into min_amount from platform_settings where key='public_config'; min_amount:=coalesce(min_amount,3000);
  if p_amount_cents<min_amount or p_amount_cents>1000000 or length(trim(p_pix_key))<3 or p_cpf!~'^\d{11}$' then raise exception 'INVALID_WITHDRAWAL'; end if;
  if exists(select 1 from withdrawals where user_id=uid and status in ('REQUESTED','UNDER_REVIEW','APPROVED','PROCESSING')) then raise exception 'PENDING_WITHDRAWAL_EXISTS'; end if;
  select * into w from wallets where user_id=uid for update; if w.available_balance_cents<p_amount_cents then raise exception 'INSUFFICIENT_BALANCE'; end if; previous:=w.available_balance_cents;
  secret:=coalesce(current_setting('app.pix_encryption_key',true),'local-only-change-me');
  insert into withdrawals(user_id,amount_cents,pix_key_encrypted,cpf_last4,idempotency_key) values(uid,p_amount_cents,encode(pgp_sym_encrypt(trim(p_pix_key),secret),'base64'),right(p_cpf,4),p_idempotency_key) returning * into result;
  update wallets set available_balance_cents=available_balance_cents-p_amount_cents,reserved_balance_cents=reserved_balance_cents+p_amount_cents where id=w.id returning * into w;
  insert into wallet_transactions(wallet_id,user_id,type,amount_cents,previous_balance_cents,new_balance_cents,reference_type,reference_id,status,idempotency_key) values(w.id,uid,'WITHDRAWAL_RESERVE',-p_amount_cents,previous,w.available_balance_cents,'WITHDRAWAL',result.id,'PENDING','withdrawal:'||result.id); return result;
end $$;

create or replace function public.start_game(p_entry_amount_cents integer,p_idempotency_key text)
returns public.game_sessions language plpgsql security definer set search_path=public as $$
declare uid uuid:=require_active_user(); tier game_tiers; w wallets; result game_sessions; previous bigint;
begin
  select * into result from game_sessions where user_id=uid and idempotency_key=p_idempotency_key; if found then return result; end if;
  if exists(select 1 from game_sessions where user_id=uid and status in ('CREATED','ACTIVE','VALIDATING')) then raise exception 'ACTIVE_GAME_EXISTS'; end if;
  select * into tier from game_tiers where enabled and entry_amount_cents=p_entry_amount_cents order by config_version desc limit 1; if not found then raise exception 'INVALID_GAME_TIER'; end if;
  select * into w from wallets where user_id=uid for update; if w.available_balance_cents<tier.entry_amount_cents then raise exception 'INSUFFICIENT_BALANCE'; end if; previous:=w.available_balance_cents;
  insert into game_sessions(user_id,tier_id,seed,config_version,entry_amount_cents,reward_amount_cents,target_score,idempotency_key) values(uid,tier.id,encode(gen_random_bytes(32),'hex'),tier.config_version,tier.entry_amount_cents,floor(tier.entry_amount_cents*tier.reward_multiplier),tier.target_score,p_idempotency_key) returning * into result;
  update wallets set available_balance_cents=available_balance_cents-tier.entry_amount_cents,reserved_balance_cents=reserved_balance_cents+tier.entry_amount_cents where id=w.id returning * into w;
  insert into wallet_transactions(wallet_id,user_id,type,amount_cents,previous_balance_cents,new_balance_cents,reference_type,reference_id,status,idempotency_key) values(w.id,uid,'GAME_ENTRY_RESERVE',-tier.entry_amount_cents,previous,w.available_balance_cents,'GAME',result.id,'PENDING','game:'||result.id); return result;
end $$;

alter table public.profiles enable row level security; alter table public.wallets enable row level security; alter table public.wallet_transactions enable row level security;
alter table public.deposits enable row level security; alter table public.withdrawals enable row level security; alter table public.referral_commissions enable row level security;
alter table public.game_sessions enable row level security; alter table public.game_moves enable row level security; alter table public.user_preferences enable row level security;
alter table public.game_tiers enable row level security; alter table public.platform_settings enable row level security; alter table public.referral_level_configs enable row level security;
create policy profiles_self_select on public.profiles for select using(id=auth.uid());
create policy wallets_self_select on public.wallets for select using(user_id=auth.uid());
create policy transactions_self_select on public.wallet_transactions for select using(user_id=auth.uid());
create policy deposits_self_select on public.deposits for select using(user_id=auth.uid());
create policy withdrawals_self_select on public.withdrawals for select using(user_id=auth.uid());
create policy commissions_self_select on public.referral_commissions for select using(beneficiary_id=auth.uid());
create policy games_self_select on public.game_sessions for select using(user_id=auth.uid());
create policy moves_own_game_select on public.game_moves for select using(exists(select 1 from game_sessions g where g.id=game_id and g.user_id=auth.uid()));
create policy preferences_self_all on public.user_preferences for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy game_tiers_public_read on public.game_tiers for select using(enabled);
create policy platform_settings_public_read on public.platform_settings for select using(public);
create policy referral_configs_authenticated_read on public.referral_level_configs for select to authenticated using(true);

grant usage on schema public to anon,authenticated; grant select on public.game_tiers,public.platform_settings to anon,authenticated; grant select on public.referral_level_configs to authenticated;
grant select on public.profiles,public.wallets,public.wallet_transactions,public.deposits,public.withdrawals,public.referral_commissions,public.game_sessions,public.game_moves,public.user_preferences to authenticated;
grant execute on function public.create_sandbox_deposit(integer,text,text),public.request_withdrawal(integer,text,text,text),public.start_game(integer,text) to authenticated;
revoke all on function public.approve_sandbox_deposit(uuid) from public,anon,authenticated;

insert into public.game_tiers(entry_amount_cents,reward_multiplier,target_score,min_entry_cents,max_entry_cents,display_order) values
(500,5,2500,500,10000,1),(1000,5,3000,500,10000,2),(2000,5,4000,500,10000,3),(3000,5,5000,500,10000,4),(5000,5,6500,500,10000,5),(10000,5,9000,500,10000,6);
insert into public.referral_level_configs(level,percentage,min_deposit_cents) values (1,10,2000),(2,5,2000),(3,2.5,2000),(4,1,2000);
insert into public.platform_settings(key,value,public) values ('public_config','{"platformName":"Bloco Play","rewardMultiplier":5,"depositMinCents":2000,"withdrawMinCents":3000,"depositOptions":[2000,3000,4000,5000,10000,20000],"withdrawNotice":"Solicitações são analisadas em até 24 horas úteis."}',true),('maintenance','{"enabled":false}',true),('score_config','{"placementPointsPerCell":10,"lineClearBasePoints":100,"multiLineMultiplier":1.5,"comboStep":0.25,"boardSize":8,"engineVersion":"1.0.0"}',true);
