-- Lets a portrait, chapter photo, or project photo store a custom focal
-- point (CSS object-position, e.g. "62% 35%") so the owner can choose what
-- part of the image stays visible under object-cover cropping.
alter table public.portfolio_media add column position text;
