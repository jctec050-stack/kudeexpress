-- Tabla para almacenar las facturas temporalmente
create table invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  data jsonb not null
);

-- Habilitar Row Level Security (RLS)
alter table invoices enable row level security;

-- Política para permitir lectura pública (cualquiera con el ID puede ver la factura)
create policy "Public invoices are viewable by everyone"
  on invoices for select
  using ( true );

-- Política para permitir inserción pública (anon key)
create policy "Anyone can insert invoices"
  on invoices for insert
  with check ( true );
