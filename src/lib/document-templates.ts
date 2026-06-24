/* ── KT Bank AG — Document HTML Templates ── */

interface ClientInfo {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  pays_residence?: string;
  nationalite?: string;
  created_at: string;
  iban?: string;
  bic?: string;
  account_id?: string;
}

function docDate() {
  return new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

function docRef() {
  return `KT-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

function baseStyles() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* Screen: A4 pages on gray background */
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 12.5px; line-height: 1.65; color: #1a1a1a;
      background: #B0B0B0;
    }
    .page-bg { background: #B0B0B0; padding: 28px 0; min-height: 100vh; }

    /* A4 page card */
    .page {
      width: 210mm; min-height: 297mm;
      background: white;
      margin: 0 auto 28px auto;
      padding: 20mm 18mm;
      box-shadow: 0 4px 28px rgba(0,0,0,0.28);
      position: relative;
      display: flex; flex-direction: column;
    }

    /* Print: proper A4 */
    @media print {
      body, .page-bg { background: white; padding: 0; }
      .page {
        width: 100%; min-height: auto; margin: 0; padding: 15mm;
        box-shadow: none; page-break-after: always;
        print-color-adjust: exact; -webkit-print-color-adjust: exact;
      }
      .page:last-child { page-break-after: auto; }
      @page { size: A4; margin: 0; }
      #pdf-btn { display: none !important; }
    }

    /* Letterhead */
    .letterhead { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 3px solid #005F2D; margin-bottom: 26px; }
    .logo-block h1 { color: #005F2D; font-size: 23px; font-weight: 900; letter-spacing: -0.5px; }
    .logo-block p { color: #64748B; font-size: 10px; margin-top: 3px; }
    .bank-address { text-align: right; color: #64748B; font-size: 10px; line-height: 1.9; }

    /* Document title */
    .doc-title { text-align: center; margin-bottom: 24px; }
    .doc-title h2 { font-size: 17px; font-weight: 800; color: #0F172A; margin-bottom: 6px; }
    .doc-title .ref { display: inline-block; background: #F0FDF4; border: 1px solid #BBF7D0; color: #005F2D; font-size: 10px; font-weight: 700; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.04em; }

    /* Parties */
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
    .party-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 13px 15px; }
    .party-box h4 { color: #64748B; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
    .party-box p { color: #0F172A; font-size: 12px; line-height: 1.8; }
    .party-box .highlight { color: #005F2D; font-weight: 700; font-size: 13.5px; }

    /* Sections */
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    .section h3 { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #005F2D; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #E2E8F0; }

    /* Info rows */
    .info-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #F1F5F9; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748B; font-size: 11.5px; }
    .info-value { color: #0F172A; font-weight: 600; font-size: 11.5px; text-align: right; }

    /* Highlight box */
    .highlight-box { background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border: 1px solid #86EFAC; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px; }
    .highlight-box .amount { font-size: 24px; font-weight: 900; color: #005F2D; }
    .highlight-box .label { color: #166534; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }

    /* Table */
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px; }
    thead th { background: #005F2D; color: white; padding: 7px 10px; font-weight: 700; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
    thead th:first-child { text-align: center; }
    tbody td { padding: 5px 10px; text-align: right; border-bottom: 1px solid #F1F5F9; }
    tbody td:first-child { text-align: center; color: #64748B; }
    tbody tr:nth-child(even) { background: #F8FAFC; }

    /* Body text */
    .body-text { color: #374151; font-size: 12px; line-height: 1.8; margin-bottom: 13px; }

    /* ── SIGNATURE BLOCK ── */
    .sig-row {
      display: flex; justify-content: space-between; gap: 32px;
      margin-top: 32px; padding-top: 22px;
      border-top: 1.5px solid #CBD5E1;
      page-break-inside: avoid;
    }
    .sig-row-right { justify-content: flex-end; }
    .sig-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .sig-empty-zone { height: 68px; }

    /* Pre-signed bank */
    .sig-presigned-wrap {
      display: flex; flex-direction: column; align-items: center;
      background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px;
      padding: 10px 12px 8px; margin-bottom: 8px;
    }
    .sig-script {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 21px; color: #005F2D; font-style: italic; font-weight: 700;
      line-height: 1; margin-top: 4px;
    }
    .sig-sub-date { font-size: 9.5px; color: #16A34A; margin-top: 3px; font-weight: 600; }

    /* Client signature box */
    .sig-client-box {
      width: 100%; height: 76px;
      border: 2px dashed #94A3B8; border-radius: 6px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
      margin-bottom: 8px; background: #FAFAFA;
    }
    .sig-client-hint { color: #94A3B8; font-size: 10.5px; font-style: italic; }
    .sig-client-sub { color: #CBD5E1; font-size: 9px; }
    .sig-date-field { font-size: 10.5px; color: #64748B; margin: 0 0 8px; }

    /* Common sig line */
    .sig-underline { border-top: 1.5px solid #334155; margin-bottom: 5px; }
    .sig-lbl { color: #64748B; font-size: 10.5px; margin: 0; }

    /* Footer — always at the bottom of each page */
    .footer-bar {
      margin-top: auto; padding-top: 12px;
      border-top: 2px solid #E2E8F0;
      display: flex; justify-content: space-between; align-items: flex-start;
      page-break-inside: avoid;
    }
    .footer-bar p { color: #94A3B8; font-size: 9.5px; line-height: 1.8; }
    .badge { display: inline-flex; align-items: center; gap: 4px; background: #F0FDF4; border: 1px solid #BBF7D0; color: #005F2D; font-size: 9.5px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }

    /* Custom body */
    .custom-body p { margin-bottom: 10px; }
    .custom-body h1 { font-size: 16px; margin: 14px 0 8px; color: #0F172A; }
    .custom-body h2 { font-size: 14px; margin: 12px 0 7px; color: #0F172A; }
    .custom-body h3 { font-size: 12px; margin: 10px 0 6px; color: #005F2D; }
    .custom-body ul, .custom-body ol { padding-left: 18px; margin-bottom: 10px; }
    .custom-body a { color: #005F2D; }
  `;
}

function officialStamp(size = 88) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="47" fill="none" stroke="#005F2D" stroke-width="2.2"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="#005F2D" stroke-width="0.7"/>
    <path id="sa" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none"/>
    <text font-family="Arial,sans-serif" font-size="7.8" font-weight="700" fill="#005F2D" letter-spacing="1.6">
      <textPath href="#sa" startOffset="2%">KT BANK AG · FRANKFURT AM MAIN · BaFin ·</textPath>
    </text>
    <text x="50" y="43" font-family="Georgia,'Times New Roman',serif" font-size="20" font-weight="900" fill="#005F2D" text-anchor="middle">KT</text>
    <text x="50" y="55" font-family="Arial,sans-serif" font-size="6.5" font-weight="700" fill="#005F2D" text-anchor="middle" letter-spacing="1.4">BANK AG</text>
    <line x1="32" y1="59" x2="68" y2="59" stroke="#005F2D" stroke-width="0.6"/>
    <text x="50" y="68" font-family="Arial,sans-serif" font-size="5.2" fill="#005F2D" text-anchor="middle" letter-spacing="0.7">REGULIERT · GESICHERT</text>
  </svg>`;
}

function letterhead() {
  return `
    <div class="letterhead">
      <div class="logo-block">
        <h1>KT Bank AG</h1>
        <p>Reguliert durch die BaFin · IBAN-Netzwerk SEPA</p>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="flex-shrink:0;">${officialStamp(72)}</div>
        <div class="bank-address">
          KT Bank AG<br/>
          Bockenheimer Anlage 46<br/>
          60322 Frankfurt am Main<br/>
          BIC: KTAGDEFF<br/>
          support@kt-bank-ag.com
        </div>
      </div>
    </div>
  `;
}

function footerBar(ref: string) {
  return `
    <div class="footer-bar">
      <p>
        KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main<br/>
        Reguliert durch die BaFin · Einlagensicherungsfonds des privaten Bankgewerbes
      </p>
      <div style="text-align:right">
        <div class="badge">BaFin-reguliert</div><br/>
        <p style="margin-top:4px;">Ref: ${ref} · ${docDate()}</p>
      </div>
    </div>
  `;
}

export interface SignatureOptions {
  presignedByBank?: boolean;
  clientSignatureSpace?: boolean;
}

function sigBlock(
  client: ClientInfo,
  opts: SignatureOptions = {},
  bankRole = "Direktion",
  showClientLine = true,
): string {
  const date = docDate();

  const bankContent = opts.presignedByBank
    ? `<div class="sig-presigned-wrap">
        <span style="font-size:9px;color:#166534;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">Vorgezeichnet durch</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="flex-shrink:0;">${officialStamp(62)}</div>
          <div>
            <div class="sig-script">KT Bank AG</div>
            <div class="sig-sub-date">Frankfurt am Main, ${date}</div>
          </div>
        </div>
      </div>`
    : `<div class="sig-empty-zone"></div>`;

  const bankCol = `<div class="sig-col">
    ${bankContent}
    <div class="sig-underline"></div>
    <p class="sig-lbl">KT Bank AG — ${bankRole}</p>
  </div>`;

  if (!showClientLine) {
    return `<div class="sig-row sig-row-right">${bankCol}</div>`;
  }

  const clientContent = opts.clientSignatureSpace
    ? `<div class="sig-client-box">
        <span class="sig-client-hint">&#9997; Unterschrift / Signature</span>
        <span class="sig-client-sub">Datum / Date: _______________</span>
      </div>`
    : `<div class="sig-empty-zone"></div>`;

  const clientCol = `<div class="sig-col">
    ${clientContent}
    <div class="sig-underline"></div>
    <p class="sig-lbl">${client.prenom} ${client.nom}</p>
  </div>`;

  return `<div class="sig-row">${clientCol}${bankCol}</div>`;
}

function contPageHeader(ref: string, subtitle: string) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:2px solid #005F2D;margin-bottom:18px;">
    <div>
      <p style="color:#005F2D;font-size:14px;font-weight:800;margin:0;">KT Bank AG</p>
      <p style="color:#64748B;font-size:10px;margin:2px 0 0;">${subtitle}</p>
    </div>
    <p style="color:#94A3B8;font-size:10px;margin:0;">Ref: ${ref} · ${docDate()}</p>
  </div>`;
}

/* ── 1. Kontoeröffnungsbestätigung ── */
export function genKontoeröffnung(client: ClientInfo, sigOpts: SignatureOptions = {}): string {
  const ref = docRef();
  const openDate = new Date(client.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>Kontoeröffnungsbestätigung — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var kids=Array.from(page.children);var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}
<div class="doc-title">
  <h2>Kontoeröffnungsbestätigung</h2>
  <span class="ref">Ref: ${ref}</span>
</div>

<div class="parties">
  <div class="party-box">
    <h4>Kontoinhaber</h4>
    <p class="highlight">${client.prenom} ${client.nom}</p>
    <p>${client.adresse ?? ""}<br/>${client.code_postal ?? ""} ${client.ville ?? ""}<br/>${client.pays_residence ?? ""}</p>
    <p style="margin-top:8px;">${client.email}</p>
  </div>
  <div class="party-box">
    <h4>Kontodaten</h4>
    <p><strong>IBAN:</strong><br/><span class="highlight">${client.iban ?? "—"}</span></p>
    <p style="margin-top:6px;"><strong>BIC:</strong> ${client.bic ?? "KTAGDEFF"}</p>
    <p style="margin-top:6px;"><strong>Kontotyp:</strong> Girokonto</p>
    <p style="margin-top:6px;"><strong>Eröffnungsdatum:</strong> ${openDate}</p>
  </div>
</div>

<div class="section">
  <h3>Bestätigung</h3>
  <p class="body-text">Wir bestätigen hiermit die erfolgreiche Eröffnung Ihres Girokontos bei der KT Bank AG. Ihr Konto ist ab sofort aktiv und verfügt über alle SEPA-Funktionen für nationale und internationale Überweisungen.</p>
  <p class="body-text">Alle Transaktionen unterliegen den geltenden Allgemeinen Geschäftsbedingungen der KT Bank AG sowie den einschlägigen deutschen und europäischen Bankenvorschriften.</p>
</div>

<div class="section">
  <h3>Leistungsumfang</h3>
  <div class="info-row"><span class="info-label">SEPA-Überweisungen</span><span class="info-value">Inklusive</span></div>
  <div class="info-row"><span class="info-label">SEPA-Lastschriften</span><span class="info-value">Inklusive</span></div>
  <div class="info-row"><span class="info-label">Online-Banking</span><span class="info-value">Inklusive</span></div>
  <div class="info-row"><span class="info-label">Kontoauszüge</span><span class="info-value">Digital (kostenlos)</span></div>
  <div class="info-row"><span class="info-label">Kundenservice</span><span class="info-value">support@kt-bank-ag.com</span></div>
</div>

${sigBlock(client, sigOpts, "Direktion")}

${footerBar(ref)}
</div></div></body></html>`;
}

/* ── 2. Willkommensschreiben ── */
export function genWillkommen(client: ClientInfo, sigOpts: SignatureOptions = {}): string {
  const ref = docRef();

  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>Willkommen bei der KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var kids=Array.from(page.children);var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}

<p style="color:#64748B;font-size:12px;margin-bottom:24px;">
  ${client.prenom} ${client.nom}<br/>
  ${client.adresse ?? ""}<br/>
  ${client.code_postal ?? ""} ${client.ville ?? ""}<br/>
  ${client.pays_residence ?? ""}
</p>

<div class="doc-title">
  <h2>Herzlich willkommen bei der KT Bank AG!</h2>
  <span class="ref">Ref: ${ref}</span>
</div>

<div class="section">
  <p class="body-text">Sehr geehrte/r ${client.prenom} ${client.nom},</p>
  <p class="body-text">wir freuen uns, Sie als neuen Kunden der KT Bank AG begrüßen zu dürfen. Ihr Konto wurde erfolgreich eröffnet, und wir stehen Ihnen für alle Ihre Bankbedürfnisse zur Verfügung.</p>
  <p class="body-text">Die KT Bank AG bietet Ihnen ein vollständiges Spektrum an Bankdienstleistungen — von SEPA-Überweisungen bis hin zu islamischen Finanzprodukten gemäß den Mourabaha-Grundsätzen, alles reguliert und überwacht durch die BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht).</p>
</div>

<div class="section">
  <h3>Ihre Kontodaten im Überblick</h3>
  <div class="info-row"><span class="info-label">Name</span><span class="info-value">${client.prenom} ${client.nom}</span></div>
  <div class="info-row"><span class="info-label">IBAN</span><span class="info-value" style="color:#005F2D;font-weight:700;">${client.iban ?? "—"}</span></div>
  <div class="info-row"><span class="info-label">BIC</span><span class="info-value">${client.bic ?? "KTAGDEFF"}</span></div>
  <div class="info-row"><span class="info-label">Kontotyp</span><span class="info-value">Girokonto</span></div>
</div>

<div class="section">
  <h3>Nächste Schritte</h3>
  <p class="body-text">1. <strong>Identitätsverifizierung (KYC):</strong> Falls noch nicht abgeschlossen, reichen Sie bitte die erforderlichen Unterlagen über Ihr Online-Dashboard ein.<br/>
  2. <strong>Online-Banking:</strong> Melden Sie sich unter kt-bank-ag.com an, um alle Funktionen Ihres Kontos zu nutzen.<br/>
  3. <strong>Erster Transfer:</strong> Stellen Sie Ihren ersten SEPA-Überweisungsantrag direkt über das Dashboard.</p>
</div>

<p class="body-text">Bei Fragen stehen wir Ihnen jederzeit zur Verfügung: <strong>support@kt-bank-ag.com</strong></p>

${sigBlock(client, sigOpts, "Kundenbetreuer")}

${footerBar(ref)}
</div></div></body></html>`;
}

/* ── 3. Kreditvertrag ── */
export function genKreditvertrag(client: ClientInfo, loan: {
  type: "islamic" | "standard";
  amount: number;
  duration_months: number;
  monthly_payment: number;
  total_repayment: number;
  interest_rate: number;
  purpose?: string;
}, sigOpts: SignatureOptions = {}): string {
  const ref = docRef();
  const fmtMoney = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const rate = loan.interest_rate / 12;

  const allRows = Array.from({ length: loan.duration_months }, (_, i) => {
    const m = i + 1;
    const interest = loan.type === "islamic" ? 0 :
      (loan.amount - (loan.monthly_payment - loan.amount * rate) * (Math.pow(1 + rate, i) - 1) / (rate || 1)) * rate;
    const principal = loan.monthly_payment - (loan.type === "islamic" ? 0 : interest);
    return `<tr>
      <td>${m}</td>
      <td style="color:#374151;">${fmtMoney(loan.monthly_payment)}</td>
      <td style="color:#005F2D;">${fmtMoney(Math.max(0, principal))}</td>
      <td style="color:${loan.type === "standard" ? "#D97706" : "#16A34A"};">${fmtMoney(Math.max(0, interest))}</td>
    </tr>`;
  });

  const tableHead = `<thead><tr><th>Monat</th><th>Rate</th><th>Tilgung</th><th>Zinsen</th></tr></thead>`;
  const ROWS_PER_PAGE = 30;

  // Page 1: contract terms + signature (no table)
  const page1 = `<div class="page">
${letterhead()}
<div class="doc-title">
  <h2>Kreditvertrag</h2>
  <span class="ref">${loan.type === "islamic" ? "Islamischer Kredit (Mourabaha)" : "Standardkredit"} · Ref: ${ref}</span>
</div>
<div class="parties">
  <div class="party-box">
    <h4>Kreditnehmer</h4>
    <p class="highlight">${client.prenom} ${client.nom}</p>
    <p>${client.adresse ?? ""}<br/>${client.code_postal ?? ""} ${client.ville ?? ""}<br/>${client.pays_residence ?? ""}</p>
    <p style="margin-top:6px;">${client.email}</p>
    <p style="margin-top:4px;"><strong>IBAN:</strong> ${client.iban ?? "—"}</p>
  </div>
  <div class="party-box">
    <h4>Kreditgeber</h4>
    <p class="highlight">KT Bank AG</p>
    <p>Bockenheimer Anlage 46<br/>60322 Frankfurt am Main<br/>Deutschland</p>
    <p style="margin-top:6px;">BaFin-Reg. Nr. 12345678</p>
    <p style="margin-top:4px;"><strong>BIC:</strong> KTAGDEFF</p>
  </div>
</div>
<div class="highlight-box">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
    <div><p class="label">Kreditbetrag</p><p class="amount">${fmtMoney(loan.amount)}</p></div>
    <div><p class="label">Monatliche Rate</p><p class="amount" style="font-size:20px;">${fmtMoney(loan.monthly_payment)}</p></div>
    <div><p class="label">Laufzeit</p><p class="amount" style="font-size:20px;">${loan.duration_months} Monate</p></div>
    <div><p class="label">Zinssatz p. a.</p><p class="amount" style="font-size:20px;color:${loan.type === "islamic" ? "#16A34A" : "#D97706"};">${loan.type === "islamic" ? "0 %" : "2 %"}</p></div>
  </div>
</div>
<div class="section">
  <h3>Vertragsbedingungen</h3>
  ${loan.purpose ? `<div class="info-row"><span class="info-label">Kreditzweck</span><span class="info-value">${loan.purpose}</span></div>` : ""}
  <div class="info-row"><span class="info-label">Kreditart</span><span class="info-value">${loan.type === "islamic" ? "Islamischer Kredit (Mourabaha) — Zinsfrei" : "Standardkredit — Festzins"}</span></div>
  <div class="info-row"><span class="info-label">Gesamtrückzahlung</span><span class="info-value">${fmtMoney(loan.total_repayment)}</span></div>
  <div class="info-row"><span class="info-label">Gesamtzinsen</span><span class="info-value" style="color:${loan.type === "standard" ? "#D97706" : "#16A34A"};">${fmtMoney(loan.total_repayment - loan.amount)}</span></div>
  <div class="info-row"><span class="info-label">Vertragsdatum</span><span class="info-value">${docDate()}</span></div>
  <div class="info-row"><span class="info-label">Erste Rate fällig am</span><span class="info-value">${new Date(Date.now() + 30 * 86400000).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</span></div>
</div>
<div class="section">
  <h3>Allgemeine Bestimmungen</h3>
  <p class="body-text">Der Kreditnehmer verpflichtet sich, die monatlichen Raten pünktlich und vollständig zu entrichten. Bei Verzug werden Mahngebühren gemäß den geltenden Allgemeinen Geschäftsbedingungen der KT Bank AG erhoben. Der Kreditnehmer hat das Recht auf vorzeitige Rückzahlung ohne Vorfälligkeitsentschädigung.</p>
</div>
${sigBlock(client, sigOpts, "Kreditgeber")}
${footerBar(ref)}
</div>`;

  // Pages 2+: amortization table split into chunks of 30 rows
  let tablePages = "";
  for (let p = 0; p < allRows.length; p += ROWS_PER_PAGE) {
    const chunk = allRows.slice(p, p + ROWS_PER_PAGE);
    const isLast = p + ROWS_PER_PAGE >= allRows.length;
    const pageNum = Math.floor(p / ROWS_PER_PAGE) + 2;
    tablePages += `<div class="page">
${contPageHeader(ref, `Kreditvertrag — Tilgungsplan${p > 0 ? " (Fortsetzung)" : ""}`)}
<table style="margin-top:4px;">${tableHead}<tbody>${chunk.join("")}</tbody></table>
${isLast ? `<p style="color:#64748B;font-size:11px;text-align:right;margin-top:8px;">Gesamtrückzahlung: <strong style="color:#005F2D;">${fmtMoney(loan.total_repayment)}</strong></p>` : ""}
${footerBar(ref)}
</div>`;
  }

  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>Kreditvertrag — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var kids=Array.from(page.children);var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg">
${page1}${tablePages}
</div></body></html>`;
}

/* ── 4. Tilgungsplan (standalone) ── */
export function genTilgungsplan(client: ClientInfo, loan: {
  type: "islamic" | "standard";
  amount: number;
  duration_months: number;
  monthly_payment: number;
  total_repayment: number;
  interest_rate: number;
  purpose?: string;
}, sigOpts: SignatureOptions = {}): string {
  const ref = docRef();
  const fmtMoney = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const rate = loan.interest_rate / 12;

  const allRows = Array.from({ length: loan.duration_months }, (_, i) => {
    const m = i + 1;
    const interest = loan.type === "islamic" ? 0 :
      (loan.amount - (loan.monthly_payment - loan.amount * rate) * (Math.pow(1 + rate, i) - 1) / (rate || 1)) * rate;
    const principal = loan.monthly_payment - (loan.type === "islamic" ? 0 : interest);
    return `<tr>
      <td>${m}</td>
      <td>${fmtMoney(loan.monthly_payment)}</td>
      <td style="color:#005F2D;">${fmtMoney(Math.max(0, principal))}</td>
      <td style="color:${loan.type === "standard" ? "#D97706" : "#16A34A"};">${fmtMoney(Math.max(0, interest))}</td>
    </tr>`;
  });

  const tableHead = `<thead><tr><th>Monat</th><th>Rate</th><th>Tilgung</th><th>Zinsen</th></tr></thead>`;
  const totalRow = `<p style="color:#64748B;font-size:11px;text-align:right;margin-top:8px;">Gesamtrückzahlung: <strong style="color:#005F2D;">${fmtMoney(loan.total_repayment)}</strong></p>`;
  const ROWS_FIRST = 18;
  const ROWS_PER_PAGE = 30;

  const summaryCards = [
    ["Kreditbetrag", fmtMoney(loan.amount), "#005F2D"],
    ["Monatliche Rate", fmtMoney(loan.monthly_payment), "#005F2D"],
    ["Laufzeit", `${loan.duration_months} Monate`, "#0F172A"],
    ["Gesamtzinsen", fmtMoney(loan.total_repayment - loan.amount), loan.type === "standard" ? "#D97706" : "#16A34A"],
  ].map(([l, v, c]) => `<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:14px 16px;">
    <p style="color:#94A3B8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:5px;">${l}</p>
    <p style="color:${c};font-weight:800;font-size:16px;">${v}</p>
  </div>`).join("");

  const firstChunk = allRows.slice(0, ROWS_FIRST);
  const isOnePage = allRows.length <= ROWS_FIRST;

  const page1 = `<div class="page">
${letterhead()}
<div class="doc-title">
  <h2>Tilgungsplan</h2>
  <span class="ref">${loan.type === "islamic" ? "Islamischer Kredit (Mourabaha)" : "Standardkredit (2% p. a.)"} · Ref: ${ref}</span>
</div>
<div class="parties">
  <div class="party-box">
    <h4>Kreditnehmer</h4>
    <p class="highlight">${client.prenom} ${client.nom}</p>
    <p>${client.adresse ?? ""} ${client.code_postal ?? ""} ${client.ville ?? ""}</p>
    <p>${client.email}</p>
  </div>
  <div class="party-box">
    <h4>Kreditübersicht</h4>
    <p><strong>Betrag:</strong> <span class="highlight">${fmtMoney(loan.amount)}</span></p>
    <p><strong>Laufzeit:</strong> ${loan.duration_months} Monate</p>
    <p><strong>Rate:</strong> ${fmtMoney(loan.monthly_payment)} / Monat</p>
    <p><strong>Zinssatz:</strong> ${loan.type === "islamic" ? "0 % (Mourabaha)" : "2 % p. a."}</p>
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">${summaryCards}</div>
<div class="section">
  <h3>Zahlungsplan</h3>
  <table>${tableHead}<tbody>${firstChunk.join("")}</tbody></table>
  ${isOnePage ? totalRow : ""}
</div>
${isOnePage ? sigBlock(client, sigOpts, "Direktion") : ""}
${footerBar(ref)}
</div>`;

  // Continuation pages
  let morePages = "";
  for (let p = ROWS_FIRST; p < allRows.length; p += ROWS_PER_PAGE) {
    const chunk = allRows.slice(p, p + ROWS_PER_PAGE);
    const isLast = p + ROWS_PER_PAGE >= allRows.length;
    morePages += `<div class="page">
${contPageHeader(ref, "Tilgungsplan — Fortsetzung")}
<table>${tableHead}<tbody>${chunk.join("")}</tbody></table>
${isLast ? totalRow : ""}
${isLast ? sigBlock(client, sigOpts, "Direktion") : ""}
${footerBar(ref)}
</div>`;
  }

  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>Tilgungsplan — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var kids=Array.from(page.children);var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg">
${page1}${morePages}
</div></body></html>`;
}

/* ── 5. AGB (static) ── */
export function genAGB(_client: ClientInfo): string {
  const ref = docRef();
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>Allgemeine Geschäftsbedingungen — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var kids=Array.from(page.children);var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}
<div class="doc-title"><h2>Allgemeine Geschäftsbedingungen</h2><span class="ref">Stand: Januar 2024 · Ref: ${ref}</span></div>
<div class="section"><h3>§ 1 Geltungsbereich</h3>
<p class="body-text">Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Geschäftsbeziehungen zwischen der KT Bank AG (nachfolgend "Bank") und ihren Kunden (nachfolgend "Kunde").</p></div>
<div class="section"><h3>§ 2 Kontoführung</h3>
<p class="body-text">Die Bank führt Konten auf den Namen des Kunden. Der Kunde ist verpflichtet, die Bank unverzüglich über Änderungen seiner persönlichen Daten zu informieren.</p></div>
<div class="section"><h3>§ 3 Überweisungsaufträge</h3>
<p class="body-text">SEPA-Überweisungen werden innerhalb eines Bankarbeitstages ausgeführt. Internationale Überweisungen können bis zu 5 Bankarbeitstage in Anspruch nehmen.</p></div>
<div class="section"><h3>§ 4 Entgelte</h3>
<p class="body-text">Die aktuellen Konditionen und Entgelte sind im Preis- und Leistungsverzeichnis der Bank festgelegt, das auf Anfrage zur Verfügung gestellt wird.</p></div>
<div class="section"><h3>§ 5 Datenschutz</h3>
<p class="body-text">Die Bank verarbeitet personenbezogene Daten gemäß der EU-Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).</p></div>
<div class="section"><h3>§ 6 Kündigung</h3>
<p class="body-text">Das Konto kann von beiden Seiten jederzeit schriftlich gekündigt werden. Bei Kündigung durch die Bank gilt eine Frist von 2 Monaten.</p></div>
${footerBar(ref)}
</div></div></body></html>`;
}

/* ── 6. Datenschutzerklärung (static) ── */
export function genDatenschutz(_client: ClientInfo): string {
  const ref = docRef();
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>Datenschutzerklärung — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var kids=Array.from(page.children);var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}
<div class="doc-title"><h2>Datenschutzerklärung</h2><span class="ref">Stand: Januar 2024 · Ref: ${ref}</span></div>
<div class="section"><h3>1. Verantwortlicher</h3>
<p class="body-text">KT Bank AG, Bockenheimer Anlage 46, 60322 Frankfurt am Main. Datenschutzbeauftragter: datenschutz@kt-bank-ag.com</p></div>
<div class="section"><h3>2. Verarbeitete Daten</h3>
<p class="body-text">Wir verarbeiten folgende personenbezogene Daten: Name, Adresse, E-Mail, Telefonnummer, Bankverbindung, Transaktionsdaten sowie Identifikationsdokumente im Rahmen der gesetzlichen KYC-Pflichten.</p></div>
<div class="section"><h3>3. Zweck der Verarbeitung</h3>
<p class="body-text">Die Datenverarbeitung erfolgt zur Erfüllung des Vertrags (Art. 6 Abs. 1 lit. b DSGVO), zur Erfüllung rechtlicher Pflichten (Art. 6 Abs. 1 lit. c DSGVO) sowie auf Basis berechtigter Interessen der Bank.</p></div>
<div class="section"><h3>4. Ihre Rechte</h3>
<p class="body-text">Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung. Beschwerden können an die zuständige Aufsichtsbehörde gerichtet werden.</p></div>
<div class="section"><h3>5. Datensicherheit</h3>
<p class="body-text">Alle Daten werden nach aktuellen technischen Standards verschlüsselt übertragen (TLS 1.3) und gespeichert (AES-256).</p></div>
${footerBar(ref)}
</div></div></body></html>`;
}

/* ── 7. Custom document ── */
export function genCustom(client: ClientInfo, opts: { title: string; body_html: string }, sigOpts: SignatureOptions = {}): string {
  const ref = docRef();
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/>
<title>${opts.title} — KT Bank AG</title>
<style>${baseStyles()}
.custom-body p { margin-bottom:10px; }
.custom-body h1 { font-size:18px; margin:16px 0 10px; color:#0F172A; }
.custom-body h2 { font-size:15px; margin:14px 0 8px; color:#0F172A; }
.custom-body h3 { font-size:13px; margin:12px 0 6px; color:#005F2D; }
.custom-body ul,.custom-body ol { padding-left:20px; margin-bottom:10px; }
.custom-body a { color:#005F2D; }
</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var kids=Array.from(page.children);var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}
<p style="color:#64748B;font-size:12px;margin-bottom:24px;">
  ${client.prenom} ${client.nom}<br/>
  ${client.adresse ?? ""} ${client.code_postal ?? ""} ${client.ville ?? ""}
</p>
<div class="doc-title">
  <h2>${opts.title}</h2>
  <span class="ref">Ref: ${ref} · ${docDate()}</span>
</div>
<div class="custom-body" style="margin-bottom:32px;">
  ${opts.body_html}
</div>
${sigBlock(client, sigOpts, "Frankfurt am Main")}
${footerBar(ref)}
</div></div></body></html>`;
}

/* ── Template dispatch ── */
export type DocType = "kontoeroeffnung" | "willkommen" | "kreditvertrag" | "tilgungsplan" | "agb" | "datenschutz" | "custom";

export const DOC_TYPES: { value: DocType; label: string; description: string; needsLoan: boolean; needsBody: boolean }[] = [
  { value: "kontoeroeffnung", label: "Kontoeröffnungsbestätigung", description: "Bestätigung der Kontoeröffnung mit IBAN", needsLoan: false, needsBody: false },
  { value: "willkommen", label: "Willkommensschreiben", description: "Persönliches Begrüßungsschreiben", needsLoan: false, needsBody: false },
  { value: "kreditvertrag", label: "Kreditvertrag", description: "Vollständiger Vertrag mit Tilgungsplan", needsLoan: true, needsBody: false },
  { value: "tilgungsplan", label: "Tilgungsplan", description: "Detaillierter Zahlungsplan", needsLoan: true, needsBody: false },
  { value: "agb", label: "Allgemeine Geschäftsbedingungen", description: "AGB der KT Bank AG", needsLoan: false, needsBody: false },
  { value: "datenschutz", label: "Datenschutzerklärung", description: "DSGVO-konforme Datenschutzerklärung", needsLoan: false, needsBody: false },
  { value: "custom", label: "Benutzerdefiniertes Dokument", description: "Freier Text mit eigenem Titel", needsLoan: false, needsBody: true },
];

export const SUBMISSION_TYPES = [
  { value: "identitaet", label: "Identitätsnachweis (Personalausweis / Reisepass)" },
  { value: "wohnsitz", label: "Wohnsitznachweis (Strom-/Wasserrechnung)" },
  { value: "einkommen", label: "Einkommensnachweis (Gehaltsabrechnung)" },
  { value: "bank", label: "Kontoauszug einer anderen Bank" },
  { value: "steuer", label: "Steuerbescheid" },
  { value: "sonstige", label: "Sonstiges Dokument" },
];
