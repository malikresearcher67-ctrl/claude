-- Register and verify the owner's account first. Replace the placeholder email.
UPDATE public.profiles SET role='admin'
WHERE id=(SELECT id FROM auth.users WHERE lower(email)=lower('REPLACE-WITH-OWNER-EMAIL'));
SELECT id,full_name,role FROM public.profiles WHERE role='admin';
