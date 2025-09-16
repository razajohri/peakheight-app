-- Enable RLS
alter table if exists public.users enable row level security;
alter table if exists public.user_preferences enable row level security;

-- Users policies
create policy if not exists  Users can view own profile on public.users for select using (auth.uid() = id);
create policy if not exists Users can insert own profile on public.users for insert with check (auth.uid() = id);
create policy if not exists Users can update own profile on public.users for update using (auth.uid() = id);

-- User preferences policies
create policy if not exists Users can read own preferences on public.user_preferences for select using (auth.uid() = user_id);
create policy if not exists Users can insert own preferences on public.user_preferences for insert with check (auth.uid() = user_id);
create policy if not exists Users can update own preferences on public.user_preferences for update using (auth.uid() = user_id);

-- Backfill missing user rows
insert into public.users (id)
select au.id from auth.users au
left join public.users u on u.id = au.id
where u.id is null;
