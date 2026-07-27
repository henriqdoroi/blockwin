create extension if not exists pgcrypto;
create table if not exists schema_migrations(version text primary key, applied_at timestamptz not null default now());

do $$ begin create type account_status as enum ('ACTIVE','SUSPENDED','CLOSED'); exception when duplicate_object then null; end $$;
do $$ begin create type platform_role as enum ('PLAYER','ADMIN'); exception when duplicate_object then null; end $$;
do $$ begin create type deposit_status as enum ('AWAITING_PAYMENT','APPROVED','EXPIRED','CANCELLED','FAILED'); exception when duplicate_object then null; end $$;
do $$ begin create type withdrawal_status as enum ('REQUESTED','UNDER_REVIEW','APPROVED','PROCESSING','PAID','REJECTED','CANCELLED'); exception when duplicate_object then null; end $$;
do $$ begin create type game_status as enum ('ACTIVE','VALIDATING','WON','LOST','ABANDONED','INVALID','SETTLED'); exception when duplicate_object then null; end $$;

create table if not exists users(
 id uuid primary key default gen_random_uuid(), email text not null, password_hash text not null,
 full_name text not null check(length(full_name) between 2 and 120), phone text,
 role platform_role not null default 'PLAYER', status account_status not null default 'ACTIVE',
 referral_code text not null unique check(referral_code ~ '^[A-Z0-9]{12}$'), referred_by uuid references users(id),
 referral_locked boolean not null default false, password_changed_at timestamptz not null default now(),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint users_no_self_referral check(referred_by is null or referred_by<>id)
);
create unique index if not exists users_email_lower_uq on users(lower(email));
create unique index if not exists users_phone_digits_uq on users(regexp_replace(phone,'\D','','g')) where phone is not null;
create index if not exists users_referrer_idx on users(referred_by);

create table if not exists user_sessions(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id) on delete cascade,
 refresh_token_hash text not null unique, user_agent_hash text, ip_hash text, expires_at timestamptz not null,
 revoked_at timestamptz, created_at timestamptz not null default now(), last_seen_at timestamptz not null default now()
);
create index if not exists sessions_user_idx on user_sessions(user_id,expires_at desc);

create table if not exists wallets(
 id uuid primary key default gen_random_uuid(), user_id uuid not null unique references users(id) on delete cascade,
 available_balance_cents bigint not null default 0 check(available_balance_cents>=0),
 reserved_balance_cents bigint not null default 0 check(reserved_balance_cents>=0),
 commission_balance_cents bigint not null default 0 check(commission_balance_cents>=0),
 currency char(3) not null default 'BRL', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists wallet_transactions(
 id uuid primary key default gen_random_uuid(), wallet_id uuid not null references wallets(id), user_id uuid not null references users(id),
 type text not null, amount_cents bigint not null check(amount_cents<>0), previous_balance_cents bigint not null,
 new_balance_cents bigint not null check(new_balance_cents>=0), reference_type text not null, reference_id uuid,
 status text not null default 'COMPLETED', idempotency_key text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now(),
 unique(user_id,idempotency_key)
);
create index if not exists wallet_tx_user_created_idx on wallet_transactions(user_id,created_at desc);

create table if not exists platform_settings(key text primary key,value jsonb not null,public boolean not null default false,updated_at timestamptz not null default now());
create table if not exists game_tiers(id uuid primary key default gen_random_uuid(),entry_amount_cents integer not null,reward_multiplier numeric(8,2) not null,target_score integer not null,enabled boolean not null default true,display_order integer not null,config_version integer not null default 1,unique(entry_amount_cents,config_version));
create table if not exists deposits(id uuid primary key default gen_random_uuid(),user_id uuid not null references users(id),amount_cents integer not null check(amount_cents>0),bonus_cents integer not null default 0,provider_charge_id text not null unique,copy_paste_code text not null,status deposit_status not null default 'AWAITING_PAYMENT',idempotency_key text not null,expires_at timestamptz not null,approved_at timestamptz,metadata jsonb not null default '{}',created_at timestamptz not null default now(),unique(user_id,idempotency_key));
create index if not exists deposits_user_idx on deposits(user_id,created_at desc);
create table if not exists withdrawals(id uuid primary key default gen_random_uuid(),user_id uuid not null references users(id),amount_cents integer not null,fee_cents integer not null default 0,pix_key_encrypted bytea not null,cpf_last4 char(4) not null,status withdrawal_status not null default 'REQUESTED',idempotency_key text not null,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(user_id,idempotency_key));
create index if not exists withdrawals_user_idx on withdrawals(user_id,created_at desc);
create table if not exists referral_level_configs(level smallint primary key check(level between 1 and 4),percentage numeric(6,3) not null,enabled boolean not null default true,min_deposit_cents integer not null default 2000,max_commission_cents integer);
create table if not exists referral_commissions(id uuid primary key default gen_random_uuid(),beneficiary_id uuid not null references users(id),source_user_id uuid not null references users(id),level smallint not null,source_deposit_id uuid not null references deposits(id),base_amount_cents integer not null,percentage numeric(6,3) not null,amount_cents integer not null,status text not null default 'AVAILABLE',created_at timestamptz not null default now(),unique(beneficiary_id,source_deposit_id,level));
create table if not exists game_sessions(id uuid primary key default gen_random_uuid(),user_id uuid not null references users(id),tier_id uuid not null references game_tiers(id),seed text not null,nonce uuid not null unique default gen_random_uuid(),engine_version text not null default '1.0.0',config_version integer not null,entry_amount_cents integer not null,reward_amount_cents integer not null,target_score integer not null,score integer not null default 0,lines_cleared integer not null default 0,max_combo integer not null default 0,status game_status not null default 'ACTIVE',started_at timestamptz not null default now(),finished_at timestamptz,idempotency_key text not null,unique(user_id,idempotency_key));
create unique index if not exists one_active_game_per_user on game_sessions(user_id) where status in ('ACTIVE','VALIDATING');
create table if not exists admin_audit_logs(id uuid primary key default gen_random_uuid(),actor_id uuid references users(id),action text not null,target_type text not null,target_id text,before_data jsonb,after_data jsonb,ip_hash text,created_at timestamptz not null default now());

insert into game_tiers(entry_amount_cents,reward_multiplier,target_score,display_order) values (500,5,2500,1),(1000,5,3000,2),(2000,5,4000,3),(3000,5,5000,4),(5000,5,6500,5),(10000,5,9000,6) on conflict do nothing;
insert into referral_level_configs(level,percentage,min_deposit_cents) values(1,10,2000),(2,5,2000),(3,2.5,2000),(4,1,2000) on conflict(level) do nothing;
insert into platform_settings(key,value,public) values('public_config','{"platformName":"Bloco Play","rewardMultiplier":5,"depositMinCents":2000,"withdrawMinCents":3000,"depositOptions":[2000,3000,4000,5000,10000,20000],"withdrawNotice":"Solicitações são analisadas em até 24 horas úteis."}',true),('maintenance','{"enabled":false}',true) on conflict(key) do nothing;
