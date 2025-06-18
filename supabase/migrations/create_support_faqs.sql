-- support_faqs table for self-service chatbot
create table support_faqs (
  id bigint primary key generated always as identity,
  question text not null,
  answer text not null,
  updated_at timestamptz default now()
);

