// Test script — companies where 10-K regex previously failed
// Applies fallback.js locally (mirrors what the browser does)

const https = require('https'), http = require('http');
const FALLBACK_DB = (() => {
  // Try relative path first (when run from project dir), then absolute
  try { return require('./fallback.js'); } catch(e) {}
  try { return require('/mnt/user-data/outputs/fallback.js'); } catch(e) {}
  console.warn('WARNING: fallback.js not found, fallback will not be applied');
  return {};
})();
const BASE = 'https://fair-share-calc.vercel.app/api/company';

function fetch(url) {
  return new Promise((res, rej) => {
    const m = url.startsWith('https') ? https : http;
    m.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => { try { res(JSON.parse(d)) } catch(e) { rej(e) } });
    }).on('error', rej);
  });
}

function applyFallback(symbol, data) {
  const fb = FALLBACK_DB[symbol.toUpperCase()];
  if (!fb) return data;
  return {
    ...data,
    emps:   data.emps   ?? fb.emps,
    profit: data.profit ?? fb.profit,
    ebitda: data.ebitda ?? fb.ebitda,
    _fallback: true,
  };
}

const TARGETS = [
  // REITs
  { ticker: 'VICI',  name: 'VICI Properties' },
  { ticker: 'VTR',   name: 'Ventas' },
  { ticker: 'SBAC',  name: 'SBA Communications' },
  { ticker: 'IRM',   name: 'Iron Mountain' },
  { ticker: 'ADC',   name: 'Agree Realty' },
  { ticker: 'NTST',  name: 'NetSTREIT' },
  { ticker: 'EPRT',  name: 'Essential Properties Realty Trust' },
  { ticker: 'UDR',   name: 'UDR Inc' },
  { ticker: 'KIM',   name: 'Kimco Realty' },
  { ticker: 'MAA',   name: 'Mid-America Apartment' },
  { ticker: 'AMT',   name: 'American Tower' },
  { ticker: 'LXP',   name: 'LXP Industrial Trust' },
  { ticker: 'CUBE',  name: 'CubeSmart' },
  { ticker: 'TRNO',  name: 'Terreno Realty' },
  { ticker: 'REXR',  name: 'Rexford Industrial Realty' },
  { ticker: 'STAG',  name: 'STAG Industrial' },
  { ticker: 'ILPT',  name: 'Industrial Logistics Properties Trust' },
  { ticker: 'SVC',   name: 'Service Properties Trust' },
  { ticker: 'APLE',  name: 'Apple Hospitality REIT' },
  { ticker: 'OHI',   name: 'Omega Healthcare Investors' },
  { ticker: 'SBRA',  name: 'Sabra Health Care REIT' },
  { ticker: 'NHI',   name: 'National Health Investors' },
  { ticker: 'LTC',   name: 'LTC Properties' },
  { ticker: 'CHCT',  name: 'Community Healthcare Trust' },
  { ticker: 'IIPR',  name: 'Innovative Industrial Properties' },
  { ticker: 'SKT',   name: 'Tanger Factory Outlet Centers' },
  // Banks
  { ticker: 'TFSL',  name: 'Third Federal Savings & Loan' },
  { ticker: 'COLB',  name: 'Columbia Banking System' },
  { ticker: 'TRMK',  name: 'Trustmark Corporation' },
  { ticker: 'IBOC',  name: 'International Bancshares' },
  { ticker: 'TFIN',  name: 'Triumph Financial' },
  { ticker: 'CVBF',  name: 'CVB Financial' },
  { ticker: 'WSFS',  name: 'WSFS Financial' },
  { ticker: 'BUSE',  name: 'First Busey Corporation' },
  { ticker: 'NBTB',  name: 'NBT Bancorp' },
  { ticker: 'TCBK',  name: 'TriCo Bancshares' },
  { ticker: 'SBCF',  name: 'Seacoast Banking' },
  { ticker: 'SFNC',  name: 'Simmons First National' },
  { ticker: 'HBNC',  name: 'Horizon Bancal' },
  { ticker: 'CZWI',  name: 'Citizens Community Bancorp' },
  { ticker: 'RNST',  name: 'Renasant Corporation' },
  { ticker: 'GABC',  name: 'German American Bancorp' },
  { ticker: 'FFBC',  name: 'First Financial Bancorp' },
  { ticker: 'CCNE',  name: 'CNB Financial' },
  { ticker: 'AROW',  name: 'Arrow Financial' },
  { ticker: 'BRKL',  name: 'Brookline Bancorp' },
  { ticker: 'CHMG',  name: 'Chemung Financial' },
  { ticker: 'HTLF',  name: 'Heartland Financial USA' },
  { ticker: 'FBMS',  name: 'First Bancshares' },
  { ticker: 'TBNK',  name: 'Territorial Bancorp' },
  // Industrials/other
  { ticker: 'ESAB',  name: 'ESAB Corporation' },
  { ticker: 'LSTR',  name: 'Landstar System' },
  { ticker: 'MPAA',  name: 'Motorcar Parts of America' },
  { ticker: 'LCII',  name: 'LCI Industries' },
  { ticker: 'FWRD',  name: 'Forward Air' },
  { ticker: 'MOD',   name: 'Modine Manufacturing' },
  { ticker: 'WSC',   name: 'WillScot Mobile Mini' },
  { ticker: 'DY',    name: 'Dycom Industries' },
  { ticker: 'NSP',   name: 'Insperity' },
  { ticker: 'HTZ',   name: 'Hertz Global Holdings' },
  { ticker: 'NKTR',  name: 'Nektar Therapeutics' },
  { ticker: 'JAZZ',  name: 'Jazz Pharmaceuticals' },
  { ticker: 'NTRA',  name: 'Natera' },
  { ticker: 'NVST',  name: 'Envista Holdings' },
  { ticker: 'ASTE',  name: 'Astec Industries' },
  { ticker: 'KALU',  name: 'Kaiser Aluminum' },
  { ticker: 'FORM',  name: 'FormFactor' },
  { ticker: 'SITM',  name: 'SiTime Corporation' },
  { ticker: 'COHU',  name: 'Cohu Inc' },
  { ticker: 'MTSI',  name: 'MACOM Technology Solutions' },
  { ticker: 'POWI',  name: 'Power Integrations' },
  { ticker: 'SLAB',  name: 'Silicon Laboratories' },
  { ticker: 'CVCO',  name: 'Cavco Industries' },
  { ticker: 'PATK',  name: 'Patrick Industries' },
  { ticker: 'CBRL',  name: 'Cracker Barrel' },
  { ticker: 'PLAY',  name: "Dave & Buster's" },
  { ticker: 'CARS',  name: 'Cars.com' },
  { ticker: 'RMAX',  name: 'RE/MAX Holdings' },
  { ticker: 'MTG',   name: 'MGIC Investment' },
  { ticker: 'SMAR',  name: 'Smartsheet' },
  { ticker: 'PRPH',  name: 'ProPhase Labs' },
  { ticker: 'NN',    name: 'NN Inc' },
];

let passed = 0, failed = 0, fromFallback = 0;

(async () => {
  console.log(`Testing ${TARGETS.length} companies (API + local fallback)...\n`);
  for (const { ticker, name } of TARGETS) {
    try {
      let j = await fetch(`${BASE}?symbol=${encodeURIComponent(ticker)}`);
      j = applyFallback(ticker, j);
      const hasEmps = j.emps != null && j.emps >= 0;
      const status = hasEmps ? '✅' : '❌';
      if (hasEmps) { passed++; if (j._fallback) fromFallback++; }
      else failed++;
      const empStr = hasEmps ? String(j.emps).padStart(7) : '   NULL';
      const src = j._fallback ? ' [fb]' : '';
      console.log(`${status} [${ticker.padEnd(6)}] ${name.padEnd(40)} emps=${empStr}${src}`);
      if (!hasEmps && j._errors) {
        const tenk = j._errors.find(e => e.includes('10-K'));
        if (tenk) console.log(`         10-K: ${tenk}`);
      }
    } catch(e) {
      failed++;
      console.log(`❌ [${ticker.padEnd(6)}] ${name.padEnd(40)} FETCH_ERROR: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 350));
  }
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`RESULT: ${passed}/${TARGETS.length} resolving  (${fromFallback} via fallback, ${passed-fromFallback} via API)`);
  console.log(`Still failing: ${failed}`);
})();
