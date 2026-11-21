# YouTube Mastery Academy Authentication

Files: login.html, reset-password.html, dashboard.html, auth.js, dashboard.js, auth.css, admin-setup.sql.

Supabase project URL: https://ibkbahsmhxwiccivcesi.supabase.co
Site URL: https://malikresearcher67-ctrl.github.io/claude/
Redirect URL: https://malikresearcher67-ctrl.github.io/claude/**

Email confirmation is enabled. Students must verify email before login. The public publishable key is used in the browser; never put a service-role key in frontend code.

Admin setup: register and verify the owner's account; replace REPLACE-WITH-OWNER-EMAIL in admin-setup.sql with the exact owner email and run it in Supabase SQL Editor. Public signup always creates Student accounts.

Keep RLS enabled on public.profiles. Authenticated users should read only their own profile unless an admin policy explicitly permits more. All privileged database actions must be protected by RLS or trusted server-side functions. A hidden admin panel is not database security.
