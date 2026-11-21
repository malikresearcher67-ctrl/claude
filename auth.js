(() => {
  const SUPABASE_URL = "https://ibkbahsmhxwiccivcesi.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_CmYr6ADC7ubTe8bHqGOfsg_Xftq8usO";
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const $ = id => document.getElementById(id);
  const message = (id, text, type = "") => { const el=$(id); if(!el)return; el.textContent=text; el.className="auth-message"+(type?" "+type:""); el.hidden=!text; };
  const friendly = error => { const m=(error&&error.message)||"Something went wrong.";
    if(/invalid login credentials/i.test(m))return "Email ya password ghalat hai.";
    if(/email not confirmed/i.test(m))return "Pehle apni email verify karein.";
    if(/user already registered/i.test(m))return "Is email ka account pehle se mojood hai.";
    return m;
  };
  const login=$("loginForm"), signup=$("signupForm"), forgot=$("forgotForm");
  const tabs=document.querySelectorAll("[data-auth-tab]");
  function show(view){[login,signup,forgot].forEach(f=>{if(f)f.hidden=f.id!==view;});tabs.forEach(t=>t.classList.toggle("active",t.dataset.authTab===view));message("authMessage","");}
  tabs.forEach(t=>t.addEventListener("click",()=>show(t.dataset.authTab)));
  document.querySelectorAll("[data-show-forgot]").forEach(b=>b.addEventListener("click",()=>show("forgotForm")));
  document.querySelectorAll("[data-show-login]").forEach(b=>b.addEventListener("click",()=>show("loginForm")));
  async function submit(form,fn){const b=form.querySelector('button[type="submit"]');b.disabled=true;const old=b.textContent;b.textContent="Please wait...";
    try{await fn(new FormData(form));}catch(e){message("authMessage",friendly(e),"error");}finally{b.disabled=false;b.textContent=old;}}
  if(login)login.addEventListener("submit",e=>{e.preventDefault();submit(login,async d=>{const {error}=await client.auth.signInWithPassword({email:d.get("email").trim(),password:d.get("password")});if(error)throw error;location.href="dashboard.html";});});
  if(signup)signup.addEventListener("submit",e=>{e.preventDefault();submit(signup,async d=>{
    const pw=d.get("password");if(pw!==d.get("confirmPassword"))throw Error("Dono passwords match nahi karte.");if(pw.length<8)throw Error("Password kam az kam 8 characters ka hona chahiye.");
    const {data,error}=await client.auth.signUp({email:d.get("email").trim(),password:pw,options:{data:{full_name:d.get("fullName").trim()},emailRedirectTo:new URL("dashboard.html",location.href).href}});
    if(error)throw error;if(data.session)location.href="dashboard.html";else{show("loginForm");message("authMessage","Registration successful. Email verification link par click karein, phir login karein.","success");}
  });});
  if(forgot)forgot.addEventListener("submit",e=>{e.preventDefault();submit(forgot,async d=>{const {error}=await client.auth.resetPasswordForEmail(d.get("email").trim(),{redirectTo:new URL("reset-password.html",location.href).href});if(error)throw error;message("authMessage","Password reset link email par bhej diya gaya hai.","success");});});
  const reset=$("resetPasswordForm");if(reset)reset.addEventListener("submit",e=>{e.preventDefault();submit(reset,async d=>{const pw=d.get("password");if(pw!==d.get("confirmPassword"))throw Error("Dono passwords match nahi karte.");if(pw.length<8)throw Error("Password kam az kam 8 characters ka hona chahiye.");const {error}=await client.auth.updateUser({password:pw});if(error)throw error;message("authMessage","Password update ho gaya. Ab login karein.","success");setTimeout(()=>location.href="login.html",1400);});});
  client.auth.getSession().then(({data})=>{if(data.session&&(login||signup))location.href="dashboard.html";});
})();