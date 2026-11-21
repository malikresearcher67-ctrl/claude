(() => {
 const URL="https://ibkbahsmhxwiccivcesi.supabase.co", KEY="sb_publishable_CmYr6ADC7ubTe8bHqGOfsg_Xftq8usO";
 const db=window.supabase.createClient(URL,KEY), $=id=>document.getElementById(id);
 const note=(text,type="")=>{const el=$("dashboardMessage");el.textContent=text;el.className="auth-message"+(type?" "+type:"");el.hidden=!text;};
 async function start(){
  const {data:{session},error}=await db.auth.getSession();if(error||!session){location.replace("login.html");return;}
  const user=session.user,{data:profile,error:pe}=await db.from("profiles").select("id,full_name,role").eq("id",user.id).maybeSingle();
  if(pe){note("Profile load nahi ho saka: "+pe.message,"error");return;}if(!profile){note("Student profile abhi create nahi hua. Admin se contact karein.","error");return;}
  const name=profile.full_name||user.user_metadata?.full_name||user.email;$("welcomeTitle").textContent="Welcome, "+name;$("rolePill").textContent=profile.role==="admin"?"ADMINISTRATOR":"STUDENT";
  if(profile.role==="admin")$("adminPanel").hidden=false;else $("studentPanel").hidden=false;
  $("studentEmail").textContent="Email: "+user.email;$("studentName").textContent="Name: "+name;
 }
 $("logoutBtn").addEventListener("click",async()=>{await db.auth.signOut();location.replace("login.html");});
 db.auth.onAuthStateChange((event,session)=>{if(event==="SIGNED_OUT"||!session)location.replace("login.html");});start();
})();