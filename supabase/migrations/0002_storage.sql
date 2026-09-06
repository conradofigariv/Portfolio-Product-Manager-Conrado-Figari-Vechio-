-- Storage for portfolio media (project images, background videos, CV files).
-- Files are stored under "{user_id}/..." and every write policy checks that the
-- first path segment matches the caller, so one user cannot touch another's folder.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760, -- 10MB, matching the product limit for both images and background video
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif',
    'video/mp4', 'video/webm',
    'application/pdf'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Portfolio media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

create policy "Users can upload to their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update files in their own folder"
  on storage.objects for update
  using (
    bucket_id = 'portfolio-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete files in their own folder"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
