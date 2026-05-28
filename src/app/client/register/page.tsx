"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { LogIn, ArrowRight, ChevronLeft, Check, Plus, Trash2 } from "lucide-react";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "done";
type AyantDroit = { prenom: string; nom: string; lien: string; date_naissance: string };
type Credit = { nom_banque: string; montant: string };

const PAYS = ["Allemagne","France","Belgique","Suisse","Autriche","Pays-Bas","Luxembourg","Turquie","Maroc","Algérie","Tunisie","Sénégal","Côte d'Ivoire","Autre"];
const DOCS = ["Passeport","Carte d'identité nationale","Titre de séjour"];
const SITUATIONS_PRO = ["Salarié(e)","Fonctionnaire","Freelance / Auto-entrepreneur","Chef d'entreprise","Profession libérale","Étudiant(e)","Retraité(e)","Sans emploi","Autre"];
const REVENUS = ["Moins de 1 000 €","1 000 – 2 000 €","2 000 – 3 500 €","3 500 – 5 000 €","Plus de 5 000 €"];
const LIENS = ["Conjoint(e)","Enfant","Parent","Frère / Sœur","Autre"];

const wrap: React.CSSProperties = {
  minHeight:"100vh", background:"#1C1C1E", display:"flex",
  flexDirection:"column", padding:"0 24px 60px", boxSizing:"border-box",
};

function FInput({ label, type="text", placeholder, value, onChange, max }: {
  label:string; type?:string; placeholder?:string; value:string;
  onChange:(v:string)=>void; max?:string;
}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} max={max}
        onChange={(e)=>onChange(e.target.value)}
        style={{width:"100%",height:52,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,color:"white",fontSize:"1rem",padding:"0 16px",boxSizing:"border-box",outline:"none"}}/>
    </div>
  );
}

function FSelect({ label, value, onChange, options }: {
  label:string; value:string; onChange:(v:string)=>void; options:string[];
}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{label}</label>
      <select value={value} onChange={(e)=>onChange(e.target.value)}
        style={{width:"100%",height:52,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,color:value?"white":"rgba(255,255,255,0.35)",fontSize:"1rem",padding:"0 16px",boxSizing:"border-box",outline:"none",appearance:"none"}}>
        <option value="" disabled>Sélectionner…</option>
        {options.map((o)=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FNumber({ label, value, onChange, max=20 }: {
  label:string; value:number; onChange:(v:number)=>void; max?:number;
}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{label}</label>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <button type="button" onClick={()=>onChange(Math.max(0,value-1))}
          style={{width:44,height:44,borderRadius:12,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",color:"white",fontSize:"1.4rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
        <span style={{color:"white",fontSize:"1.4rem",fontWeight:700,minWidth:32,textAlign:"center"}}>{value}</span>
        <button type="button" onClick={()=>onChange(Math.min(max,value+1))}
          style={{width:44,height:44,borderRadius:12,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",color:"white",fontSize:"1.4rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
      </div>
    </div>
  );
}

function Btn({ children, onClick, loading }: {
  children:React.ReactNode; onClick?:()=>void; loading?:boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      style={{width:"100%",height:54,borderRadius:999,background:"white",color:"#005F2D",fontWeight:700,fontSize:"1rem",border:"none",cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:loading?0.6:1}}>
      {loading?"Veuillez patienter…":children}
    </button>
  );
}

function PageHeader({ onBack }: { onBack?:()=>void }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 0 8px"}}>
      {onBack
        ?<button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",padding:4}}><ChevronLeft size={24}/></button>
        :<div style={{width:32}}/>}
      <span style={{color:"white",fontWeight:800,fontSize:"1.1rem"}}>KT Bank</span>
      <div style={{width:32}}/>
    </div>
  );
}

function ProgressBar({ step }: { step:Step }) {
  if (step===0||step===1||step==="done") return null;
  const n = step as number;
  const pct = Math.round(((n-1)/7)*100);
  return (
    <div style={{marginBottom:8}}>
      <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:99,marginBottom:6}}>
        <div style={{height:"100%",width:`${pct}%`,background:"#005F2D",borderRadius:99,transition:"width 0.4s ease"}}/>
      </div>
      <p style={{color:"rgba(255,255,255,0.35)",fontSize:"0.75rem",margin:0}}>Étape {n-1} sur 7</p>
    </div>
  );
}

export default function RegisterPage() {
  const [step,setStep] = useState<Step>(0);
  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState(["","","",""]);
  const [timer,setTimer] = useState(120);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [iban,setIban] = useState("");

  // Step 2
  const [pays,setPays] = useState("");
  const [dob,setDob] = useState("");
  const [promo,setPromo] = useState("");
  const [fatca,setFatca] = useState(false);

  // Step 3
  const [prenom,setPrenom] = useState("");
  const [nom,setNom] = useState("");
  const [sexe,setSexe] = useState("");
  const [situation,setSituation] = useState("");
  const [paysNaissance,setPaysNaissance] = useState("");
  const [villeNaissance,setVilleNaissance] = useState("");

  // Step 4
  const [nationalite,setNationalite] = useState("");
  const [typeDoc,setTypeDoc] = useState("");
  const [autorite,setAutorite] = useState("");

  // Step 5
  const [situationPro,setSituationPro] = useState("");
  const [nomEmployeur,setNomEmployeur] = useState("");
  const [revenuMensuel,setRevenuMensuel] = useState("");
  const [adresse,setAdresse] = useState("");
  const [codePostal,setCodePostal] = useState("");
  const [ville,setVille] = useState("");

  // Step 6 – Crédits
  const [aCredits,setACredits] = useState<boolean|null>(null);
  const [credits,setCredits] = useState<Credit[]>([]);

  // Step 7 – Famille
  const [nbEnfants,setNbEnfants] = useState(0);
  const [personnesCharge,setPersonnesCharge] = useState(0);
  const [ayantsDroit,setAyantsDroit] = useState<AyantDroit[]>([]);

  // Step 8
  const [phone,setPhone] = useState("");

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  function startTimer() {
    setTimer(120);
    const id = setInterval(()=>setTimer((t)=>{if(t<=1){clearInterval(id);return 0;}return t-1;}),1000);
  }

  async function sendOtp() {
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError("Adresse e-mail invalide");return;}
    setLoading(true);setError("");
    const res = await fetch("/api/kt/otp-send",{method:"POST",body:JSON.stringify({email}),headers:{"Content-Type":"application/json"}});
    const data = await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||"Erreur");return;}
    startTimer();setStep(1);
  }

  async function verifyOtp() {
    const code = otp.join("");
    if(code.length<4){setError("Saisissez les 4 chiffres");return;}
    setLoading(true);setError("");
    const res = await fetch("/api/kt/otp-verify",{method:"POST",body:JSON.stringify({email,code}),headers:{"Content-Type":"application/json"}});
    const data = await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||"Code invalide");return;}
    setStep(2);
  }

  async function save(s:2|3|4|5|6|7|8) {
    setLoading(true);setError("");
    const bodies:Record<number,object> = {
      2:{step:2,email,pays_residence:pays,date_naissance:dob,code_promo:promo,is_fatca:fatca},
      3:{step:3,email,prenom,nom,sexe,situation_familiale:situation,pays_naissance:paysNaissance,ville_naissance:villeNaissance},
      4:{step:4,email,nationalite,type_document:typeDoc,autorite_document:autorite},
      5:{step:5,email,situation_professionnelle:situationPro,nom_employeur:nomEmployeur,revenu_mensuel:revenuMensuel,adresse,code_postal:codePostal,ville},
      6:{step:6,email,a_credits_en_cours:aCredits??false,credits_details:credits},
      7:{step:7,email,nombre_enfants:nbEnfants,personnes_a_charge:personnesCharge,ayants_droit:ayantsDroit},
      8:{step:8,email,telephone:phone},
    };
    const res = await fetch("/api/kt/register",{method:"POST",body:JSON.stringify(bodies[s]),headers:{"Content-Type":"application/json"}});
    const data = await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||"Erreur serveur");return;}
    if(s===8){setIban(data.iban||"");setStep("done");}
    else setStep((s+1) as Step);
  }

  function handleOtp(idx:number,val:string) {
    const digit = val.replace(/\D/,"").slice(-1);
    const next=[...otp];next[idx]=digit;setOtp(next);
    if(digit&&idx<3)otpRefs[idx+1].current?.focus();
    if(!digit&&idx>0)otpRefs[idx-1].current?.focus();
  }

  function addCredit() {
    if(credits.length>=5)return;
    setCredits([...credits,{nom_banque:"",montant:""}]);
  }
  function updateCredit(i:number,f:keyof Credit,v:string) {
    const n=[...credits];n[i]={...n[i],[f]:v};setCredits(n);
  }
  function removeCredit(i:number){setCredits(credits.filter((_,j)=>j!==i));}

  function addAyantDroit() {
    if(ayantsDroit.length>=4)return;
    setAyantsDroit([...ayantsDroit,{prenom:"",nom:"",lien:"",date_naissance:""}]);
  }
  function updateAyantDroit(i:number,f:keyof AyantDroit,v:string) {
    const n=[...ayantsDroit];n[i]={...n[i],[f]:v};setAyantsDroit(n);
  }
  function removeAyantDroit(i:number){setAyantsDroit(ayantsDroit.filter((_,j)=>j!==i));}

  const employeurLabel = ["Retraité(e)","Sans emploi"].includes(situationPro)?null
    :situationPro==="Étudiant(e)"?"Établissement scolaire"
    :["Chef d'entreprise","Freelance / Auto-entrepreneur"].includes(situationPro)?"Nom de l'entreprise"
    :"Nom de l'employeur";

  /* ── Step 0 ── */
  if(step===0) return (
    <div style={wrap}>
      <PageHeader/>
      <div style={{flex:1,display:"flex",flexDirection:"column",paddingTop:32}}>
        <div style={{width:56,height:56,borderRadius:16,background:"rgba(0,95,45,0.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
          <LogIn size={24} color="#005F2D"/>
        </div>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.75rem",marginBottom:8}}>Créer un compte</h1>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.95rem",marginBottom:32,lineHeight:1.6}}>
          Saisissez votre adresse e-mail pour commencer votre inscription KT Bank.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <FInput label="Adresse e-mail" type="email" placeholder="vous@exemple.com" value={email} onChange={setEmail}/>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={sendOtp} loading={loading}>Continuer <ArrowRight size={18}/></Btn>
        </div>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:"0.78rem",marginTop:24,lineHeight:1.6,textAlign:"center"}}>
          En continuant, vous acceptez nos{" "}
          <Link href="/legal" style={{color:"rgba(255,255,255,0.55)",textDecoration:"underline"}}>Conditions générales</Link>{" "}
          et notre{" "}
          <Link href="/legal" style={{color:"rgba(255,255,255,0.55)",textDecoration:"underline"}}>Politique de confidentialité</Link>.
        </p>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.85rem",marginTop:"auto",textAlign:"center",paddingTop:24}}>
          Déjà un compte ?{" "}
          <Link href="/client/login" style={{color:"white",fontWeight:600,textDecoration:"none"}}>Se connecter</Link>
        </p>
      </div>
    </div>
  );

  /* ── Step 1 – OTP ── */
  if(step===1) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(0)}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",paddingTop:32}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.75rem",marginBottom:8}}>Vérification e-mail</h1>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.95rem",marginBottom:4,lineHeight:1.6}}>Code envoyé à</p>
        <p style={{color:"white",fontWeight:600,marginBottom:32}}>{email}</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:32}}>
          {otp.map((d,i)=>(
            <input key={i} ref={otpRefs[i]} value={d}
              onChange={(e)=>handleOtp(i,e.target.value)}
              onKeyDown={(e)=>{if(e.key==="Backspace"&&!d&&i>0)otpRefs[i-1].current?.focus();}}
              maxLength={1} inputMode="numeric"
              style={{width:64,height:72,textAlign:"center",fontSize:"1.75rem",fontWeight:700,background:"#2A2A35",border:`2px solid ${d?"#005F2D":"rgba(255,255,255,0.1)"}`,borderRadius:16,color:"white",outline:"none"}}/>
          ))}
        </div>
        {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem",marginBottom:16,textAlign:"center"}}>{error}</p>}
        <Btn onClick={verifyOtp} loading={loading}>Vérifier le code</Btn>
        <div style={{textAlign:"center",marginTop:24}}>
          {timer>0
            ?<p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.85rem"}}>Renvoyer dans {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</p>
            :<button onClick={sendOtp} style={{background:"none",border:"none",color:"#005F2D",fontWeight:600,cursor:"pointer",fontSize:"0.9rem"}}>Renvoyer le code</button>}
        </div>
      </div>
    </div>
  );

  /* ── Step 2 : Informations personnelles ── */
  if(step===2) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(1)}/><ProgressBar step={step}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:20}}>Informations personnelles</h1>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelect label="Pays de résidence" value={pays} onChange={setPays} options={PAYS}/>
          <FInput label="Date de naissance" type="date" value={dob} onChange={setDob}
            max={new Date(Date.now()-18*365.25*86400000).toISOString().split("T")[0]}/>
          <FInput label="Code promo (optionnel)" placeholder="KT2024" value={promo} onChange={setPromo}/>
          <label style={{display:"flex",gap:12,alignItems:"flex-start",background:"#2A2A35",borderRadius:14,padding:16,cursor:"pointer"}}>
            <input type="checkbox" checked={fatca} onChange={(e)=>setFatca(e.target.checked)}
              style={{width:20,height:20,marginTop:2,accentColor:"#005F2D",flexShrink:0}}/>
            <span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.82rem",lineHeight:1.5}}>
              Je confirme ne pas être soumis(e) aux obligations fiscales américaines (FATCA / CRS US).
            </span>
          </label>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!pays||!dob){setError("Champs requis");return;}save(2);}} loading={loading}>
            Continuer <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 3 : Identité ── */
  if(step===3) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(2)}/><ProgressBar step={step}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:20}}>Votre identité</h1>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <FInput label="Prénom" placeholder="Mohammed" value={prenom} onChange={setPrenom}/>
            <FInput label="Nom" placeholder="Al-Rashid" value={nom} onChange={setNom}/>
          </div>
          <FSelect label="Sexe" value={sexe} onChange={setSexe} options={["Homme","Femme"]}/>
          <FSelect label="Situation familiale" value={situation} onChange={setSituation}
            options={["Célibataire","Marié(e)","Divorcé(e)","Veuf / Veuve","Union libre"]}/>
          <FSelect label="Pays de naissance" value={paysNaissance} onChange={setPaysNaissance} options={PAYS}/>
          <FInput label="Ville de naissance" placeholder="Berlin" value={villeNaissance} onChange={setVilleNaissance}/>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!prenom||!nom||!sexe||!situation||!paysNaissance||!villeNaissance){setError("Tous les champs sont requis");return;}save(3);}} loading={loading}>
            Continuer <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 4 : Nationalité & Document ── */
  if(step===4) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(3)}/><ProgressBar step={step}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:20}}>Nationalité & Document</h1>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelect label="Nationalité" value={nationalite} onChange={setNationalite} options={PAYS}/>
          <FSelect label="Type de document d'identité" value={typeDoc} onChange={setTypeDoc} options={DOCS}/>
          <FInput label="Autorité de délivrance" placeholder="Ministère de l'Intérieur – Allemagne" value={autorite} onChange={setAutorite}/>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!nationalite||!typeDoc||!autorite){setError("Tous les champs sont requis");return;}save(4);}} loading={loading}>
            Continuer <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 5 : Situation professionnelle & Adresse ── */
  if(step===5) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(4)}/><ProgressBar step={step}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:20}}>Situation professionnelle</h1>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelect label="Situation actuelle" value={situationPro} onChange={setSituationPro} options={SITUATIONS_PRO}/>
          {employeurLabel&&(
            <FInput label={employeurLabel} placeholder="ex. Deutsche Bank AG" value={nomEmployeur} onChange={setNomEmployeur}/>
          )}
          <FSelect label="Revenu mensuel net" value={revenuMensuel} onChange={setRevenuMensuel} options={REVENUS}/>
          <div style={{height:1,background:"rgba(255,255,255,0.07)",margin:"4px 0"}}/>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.82rem",margin:0}}>Adresse de résidence</p>
          <FInput label="Rue et numéro" placeholder="Musterstraße 12" value={adresse} onChange={setAdresse}/>
          <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:12}}>
            <FInput label="Code postal" placeholder="10115" value={codePostal} onChange={setCodePostal}/>
            <FInput label="Ville" placeholder="Berlin" value={ville} onChange={setVille}/>
          </div>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!situationPro||!revenuMensuel||!adresse||!codePostal||!ville){setError("Veuillez remplir tous les champs obligatoires");return;}save(5);}} loading={loading}>
            Continuer <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 6 : Situation financière ── */
  if(step===6) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(5)}/><ProgressBar step={step}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:6}}>Situation financière</h1>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:24}}>Ces informations sont confidentielles et sécurisées.</p>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>

          <div>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",fontWeight:500,marginBottom:12}}>Avez-vous des crédits en cours ?</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{label:"Oui",val:true},{label:"Non",val:false}].map(({label,val})=>(
                <button key={label} type="button" onClick={()=>{setACredits(val);if(!val)setCredits([]);}}
                  style={{height:52,borderRadius:14,border:`2px solid ${aCredits===val?"#005F2D":"rgba(255,255,255,0.1)"}`,background:aCredits===val?"rgba(0,95,45,0.2)":"#2A2A35",color:"white",fontWeight:aCredits===val?700:400,fontSize:"0.95rem",cursor:"pointer"}}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {aCredits===true&&(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",fontWeight:500,margin:0}}>Détail des crédits</p>
                {credits.length<5&&(
                  <button type="button" onClick={addCredit}
                    style={{display:"flex",alignItems:"center",gap:6,background:"rgba(0,95,45,0.2)",border:"1px solid rgba(0,95,45,0.4)",borderRadius:10,padding:"6px 12px",color:"#4CAF82",fontSize:"0.8rem",fontWeight:600,cursor:"pointer"}}>
                    <Plus size={13}/> Ajouter
                  </button>
                )}
              </div>

              {credits.length===0&&(
                <button type="button" onClick={addCredit}
                  style={{width:"100%",height:48,background:"#2A2A35",border:"1px dashed rgba(255,255,255,0.15)",borderRadius:14,color:"rgba(255,255,255,0.35)",fontSize:"0.85rem",cursor:"pointer"}}>
                  + Ajouter un crédit
                </button>
              )}

              {credits.map((c,i)=>(
                <div key={i} style={{background:"#2A2A35",borderRadius:14,padding:14,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.8rem"}}>Crédit {i+1}</span>
                    <button type="button" onClick={()=>removeCredit(i)} style={{background:"none",border:"none",color:"rgba(255,100,100,0.7)",cursor:"pointer"}}><Trash2 size={15}/></button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <FInput label="Nom de la banque créditrice" placeholder="ex. Deutsche Bank, Commerzbank…" value={c.nom_banque} onChange={(v)=>updateCredit(i,"nom_banque",v)}/>
                    <FInput label="Montant total restant dû (€)" placeholder="ex. 12 500" value={c.montant} onChange={(v)=>updateCredit(i,"montant",v)}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(aCredits===null){setError("Veuillez répondre à la question");return;}save(6);}} loading={loading}>
            Continuer <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 7 : Famille & Ayants droit ── */
  if(step===7) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(6)}/><ProgressBar step={step}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:6}}>Situation familiale</h1>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:20}}>Ces informations constituent votre dossier bancaire officiel.</p>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <FNumber label="Nombre d'enfants" value={nbEnfants} onChange={setNbEnfants} max={15}/>
          <FNumber label="Personnes à charge (total)" value={personnesCharge} onChange={setPersonnesCharge} max={20}/>

          <div style={{height:1,background:"rgba(255,255,255,0.07)"}}/>

          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <p style={{color:"white",fontWeight:600,fontSize:"0.95rem",margin:0}}>Ayants droit</p>
                <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",margin:"4px 0 0"}}>Personnes autorisées à accéder au compte (max. 4)</p>
              </div>
              {ayantsDroit.length<4&&(
                <button type="button" onClick={addAyantDroit}
                  style={{display:"flex",alignItems:"center",gap:6,background:"rgba(0,95,45,0.2)",border:"1px solid rgba(0,95,45,0.4)",borderRadius:10,padding:"8px 14px",color:"#4CAF82",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"}}>
                  <Plus size={14}/> Ajouter
                </button>
              )}
            </div>
            {ayantsDroit.length===0&&(
              <div style={{background:"#2A2A35",borderRadius:14,padding:16,textAlign:"center"}}>
                <p style={{color:"rgba(255,255,255,0.3)",fontSize:"0.85rem",margin:0}}>Aucun ayant droit — optionnel</p>
              </div>
            )}
            {ayantsDroit.map((ad,i)=>(
              <div key={i} style={{background:"#2A2A35",borderRadius:14,padding:16,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{color:"rgba(255,255,255,0.6)",fontSize:"0.82rem",fontWeight:600}}>Ayant droit {i+1}</span>
                  <button type="button" onClick={()=>removeAyantDroit(i)} style={{background:"none",border:"none",color:"rgba(255,100,100,0.7)",cursor:"pointer"}}><Trash2 size={16}/></button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <FInput label="Prénom" placeholder="Sarah" value={ad.prenom} onChange={(v)=>updateAyantDroit(i,"prenom",v)}/>
                    <FInput label="Nom" placeholder="Müller" value={ad.nom} onChange={(v)=>updateAyantDroit(i,"nom",v)}/>
                  </div>
                  <FSelect label="Lien de parenté" value={ad.lien} onChange={(v)=>updateAyantDroit(i,"lien",v)} options={LIENS}/>
                  <FInput label="Date de naissance" type="date" value={ad.date_naissance} onChange={(v)=>updateAyantDroit(i,"date_naissance",v)}/>
                </div>
              </div>
            ))}
          </div>

          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>save(7)} loading={loading}>Continuer <ArrowRight size={18}/></Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 8 : Téléphone ── */
  if(step===8) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(7)}/><ProgressBar step={step}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:6}}>Coordonnées</h1>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:20}}>Dernière étape — votre compte sera créé immédiatement.</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>E-mail</label>
            <div style={{height:52,background:"#1E1E28",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,color:"rgba(255,255,255,0.4)",fontSize:"1rem",padding:"0 16px",display:"flex",alignItems:"center"}}>{email}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>Numéro de téléphone</label>
            <div style={{display:"flex",gap:8}}>
              <div style={{height:52,minWidth:76,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"0.9rem",fontWeight:600}}>🇩🇪 +49</div>
              <input type="tel" placeholder="152 345 6789" value={phone} onChange={(e)=>setPhone(e.target.value)}
                style={{flex:1,height:52,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,color:"white",fontSize:"1rem",padding:"0 16px",boxSizing:"border-box",outline:"none"}}/>
            </div>
          </div>
          <div style={{background:"rgba(0,95,45,0.1)",border:"1px solid rgba(0,95,45,0.25)",borderRadius:14,padding:16}}>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",margin:0,lineHeight:1.6}}>
              En finalisant, votre <strong style={{color:"white"}}>compte courant KT Bank</strong> sera ouvert instantanément. Vous recevrez votre IBAN par e-mail.
            </p>
          </div>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!phone){setError("Téléphone requis");return;}save(8);}} loading={loading}>
            Finaliser mon inscription <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Done ── */
  return (
    <div style={wrap}>
      <PageHeader/>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:20}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(0,95,45,0.2)",border:"2px solid #005F2D",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Check size={36} color="#005F2D"/>
        </div>
        <div>
          <h1 style={{color:"white",fontWeight:800,fontSize:"1.75rem",marginBottom:10}}>Bienvenue chez KT Bank !</h1>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:"0.95rem",lineHeight:1.7}}>
            Votre compte a été créé avec succès.<br/>Un e-mail de confirmation vous a été envoyé.
          </p>
          {iban&&(
            <div style={{background:"#2A2A35",borderRadius:16,padding:"16px 20px",marginTop:16,textAlign:"left"}}>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.75rem",marginBottom:4}}>Votre IBAN</p>
              <p style={{color:"white",fontFamily:"monospace",fontSize:"0.9rem",letterSpacing:"0.05em",wordBreak:"break-all"}}>{iban}</p>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.75rem",marginTop:4}}>BIC: KTAGDEFF</p>
            </div>
          )}
        </div>
        <Link href="/client/dashboard" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",maxWidth:340,height:54,borderRadius:999,background:"#005F2D",color:"white",fontWeight:700,textDecoration:"none"}}>
          Accéder à mon espace <ArrowRight size={18}/>
        </Link>
        <Link href="/" style={{color:"rgba(255,255,255,0.4)",fontSize:"0.85rem",textDecoration:"none"}}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
