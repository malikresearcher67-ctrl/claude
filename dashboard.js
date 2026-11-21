(() => {
 const URL="https://ibkbahsmhxwiccivcesi.supabase.co", KEY="sb_publishable_CmYr6ADC7ubTe8bHqGOfsg_Xftq8usO";
 const db=window.supabase.createClient(URL,KEY), $=id=>document.getElementById(id);
 const note=(text,type="")=>{const el=$("dashboardMessage");el.textContent=text;el.className="auth-message"+(type?" "+type:"");el.hidden=!text;};
 const safe=(v)=>String(v??"");
 const fmt=(v)=>{try{return new Date(v).toLocaleString()}catch(_){return "—"}};
 async function loadAnalytics(){
  const button=$("refreshAnalytics");if(button)button.disabled=true;
  try{
   const {data,error}=await db.rpc("get_website_visitor_analytics");
   if(error)throw error;
   $("totalPageViews").textContent=Number(data.total_page_views||0).toLocaleString();
   $("uniqueVisitors").textContent=Number(data.unique_visitors_30d||0).toLocaleString();
   $("activeVisitors").textContent=Number(data.active_visitors_5m||0).toLocaleString();
   $("studentPageViews").textContent=Number(data.student_page_views_30d||0).toLocaleString();
   const pages=$("topPages");pages.replaceChildren();
   (data.top_pages||[]).forEach(p=>{const row=document.createElement("div");row.className="analytics-list-row";const path=document.createElement("span");path.textContent=p.page_path;const count=document.createElement("b");count.textContent=Number(p.views||0).toLocaleString();row.append(path,count);pages.append(row);});
   if(!pages.children.length)pages.textContent="No page views recorded yet.";
   const body=$("recentVisits");body.replaceChildren();
   (data.recent_visits||[]).forEach(v=>{const tr=document.createElement("tr");const vals=[safe(v.user_id?"Student account":"Visitor "+safe(v.visitor_id).slice(0,8)),safe(v.page_path),safe(v.device_type),safe(v.event_type==="page_view"?"Page view":"Active"),fmt(v.created_at)];vals.forEach(val=>{const td=document.createElement("td");td.textContent=val;tr.append(td);});body.append(tr);});
   if(!body.children.length){const tr=document.createElement("tr"),td=document.createElement("td");td.colSpan=5;td.textContent="No visitor activity recorded yet.";tr.append(td);body.append(tr);}
   note("");
  }catch(e){note("Analytics abhi load nahi ho rahi. Pehle visitor-analytics.sql Supabase SQL Editor mein run karein. Details: "+(e.message||"Unknown error"),"error");}
  finally{if(button)button.disabled=false;}
 }
 async function start(){
  const {data:{session},error}=await db.auth.getSession();if(error||!session){location.replace("login.html");return;}
  const user=session.user,{data:profile,error:pe}=await db.from("profiles").select("id,full_name,role").eq("id",user.id).maybeSingle();
  if(pe){note("Profile load nahi ho saka: "+pe.message,"error");return;}if(!profile){note("Student profile abhi create nahi hua. Admin se contact karein.","error");return;}
  const name=profile.full_name||user.user_metadata?.full_name||user.email;$("welcomeTitle").textContent="Welcome, "+name;$("rolePill").textContent=profile.role==="admin"?"ADMINISTRATOR":"STUDENT";
  if(profile.role==="admin"){$("adminPanel").hidden=false;loadAnalytics();setInterval(loadAnalytics,30000);}else{$("studentPanel").hidden=false;$("studentEmail").textContent="Email: "+user.email;$("studentName").textContent="Name: "+name;}
 }
 $("logoutBtn").addEventListener("click",async()=>{await db.auth.signOut();location.replace("login.html");});
 if($("refreshAnalytics"))$("refreshAnalytics").addEventListener("click",loadAnalytics);
 db.auth.onAuthStateChange((event,session)=>{if(event==="SIGNED_OUT"||!session)location.replace("login.html");});start();
})();
