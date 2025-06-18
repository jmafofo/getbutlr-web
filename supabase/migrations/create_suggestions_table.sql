create extension if not exists vector;
create table suggestions (
  id bigint primary key generated always as identity,
  query text not null,
  tone text not null,
  keywords text[],
  tags text[],
  title_variants text[],
  thumbnail_prompt text,
  created_at timestamp with time zone default now()
);
