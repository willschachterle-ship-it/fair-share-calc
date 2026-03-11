const FINNHUB_KEY = 'd6j3rvhr01ql467i5e0gd6j3rvhr01ql467i5e10';
const FMP_KEY = '3gPWbjHBHWaeswUkIvjGjN6Ei3SxifLL';
const AV_KEY = '17JNK5S9J44QAXTV';

const SERVER_FALLBACK_DB = {
  "CAE":{"name":"CAE Inc.","emps":13000,"profit":288600000,"ebitda":980800000,"logo":"https://logo.clearbit.com/cae.com"},
  "FINMY":{"name":"Leonardo S.p.A.","emps":60500,"profit":1188000000,"ebitda":2268000000,"logo":"https://logo.clearbit.com/leonardocompany.com"},
  "THLEF":{"name":"Thales Group","emps":81000,"profit":1800000000,"ebitda":3200000000,"logo":"https://logo.clearbit.com/thalesgroup.com"},
  "SAABF":{"name":"Saab","emps":24000,"profit":420000000,"ebitda":780000000,"logo":"https://logo.clearbit.com/saabgroup.com"},
  "RNMBY":{"name":"Rheinmetall","emps":33000,"profit":1100000000,"ebitda":2000000000,"logo":"https://logo.clearbit.com/rheinmetall.com"},
  "BAESY":{"name":"BAE Systems","emps":110000,"profit":2060000000,"ebitda":4200000000,"logo":"https://logo.clearbit.com/baesystems.com"},
  "SHEL":{"name":"Shell","emps":103000,"profit":19359000000,"ebitda":42000000000,"logo":"https://logo.clearbit.com/shell.com"},
  "BP":{"name":"BP","emps":90000,"profit":8900000000,"ebitda":26000000000,"logo":"https://logo.clearbit.com/bp.com"},
  "TM":{"name":"Toyota","emps":375235,"profit":27000000000,"ebitda":44000000000,"logo":"https://logo.clearbit.com/toyota.com"},
  "EADSY":{"name":"Airbus","emps":150000,"profit":4800000000,"ebitda":8200000000,"logo":"https://logo.clearbit.com/airbus.com"},
  "RYCEY":{"name":"Rolls-Royce","emps":42000,"profit":2700000000,"ebitda":3800000000,"logo":"https://logo.clearbit.com/rolls-royce.com"},
  "TSM":{"name":"TSMC","emps":77000,"profit":34600000000,"ebitda":46000000000,"logo":"https://logo.clearbit.com/tsmc.com"},
  "BABA":{"name":"Alibaba","emps":204891,"profit":11600000000,"ebitda":21000000000,"logo":"https://logo.clearbit.com/alibaba.com"},
  "TSLA":{"name":"Tesla, Inc.","emps":140473,"profit":14974000000,"ebitda":19700000000,"logo":"https://logo.clearbit.com/tesla.com"},
  "AAPL":{"name":"Apple Inc.","emps":164000,"profit":96995000000,"ebitda":130000000000,"logo":"https://logo.clearbit.com/apple.com"},
  "MSFT":{"name":"Microsoft Corporation","emps":221000,"profit":72361000000,"ebitda":102000000000,"logo":"https://logo.clearbit.com/microsoft.com"},
  "GOOGL":{"name":"Alphabet Inc.","emps":182502,"profit":73795000000,"ebitda":100000000000,"logo":"https://logo.clearbit.com/google.com"},
  "AMZN":{"name":"Amazon.com, Inc.","emps":1525000,"profit":30425000000,"ebitda":85000000000,"logo":"https://logo.clearbit.com/amazon.com"},
  "META":{"name":"Meta Platforms, Inc.","emps":67317,"profit":39098000000,"ebitda":54000000000,"logo":"https://logo.clearbit.com/meta.com"},
  "NVDA":{"name":"NVIDIA Corporation","emps":29600,"profit":29760000000,"ebitda":33000000000,"logo":"https://logo.clearbit.com/nvidia.com"},
  "WMT":{"name":"Walmart Inc.","emps":2100000,"profit":11680000000,"ebitda":28000000000,"logo":"https://logo.clearbit.com/walmart.com"},
  "JPM":{"name":"JPMorgan Chase & Co.","emps":308669,"profit":49552000000,"ebitda":55000000000,"logo":"https://logo.clearbit.com/jpmorganchase.com"},
  "XOM":{"name":"Exxon Mobil Corporation","emps":62000,"profit":36010000000,"ebitda":58000000000,"logo":"https://logo.clearbit.com/exxonmobil.com"},
  "BAC":{"name":"Bank of America Corp.","emps":213000,"profit":26515000000,"ebitda":30000000000,"logo":"https://logo.clearbit.com/bankofamerica.com"},
  "UNH":{"name":"UnitedHealth Group","emps":400000,"profit":22381000000,"ebitda":29000000000,"logo":"https://logo.clearbit.com/unitedhealthgroup.com"},
  "COST":{"name":"Costco Wholesale Corp.","emps":316000,"profit":6292000000,"ebitda":9000000000,"logo":"https://logo.clearbit.com/costco.com"},
  "HD":{"name":"The Home Depot, Inc.","emps":465000,"profit":15143000000,"ebitda":21000000000,"logo":"https://logo.clearbit.com/homedepot.com"},
  "NFLX":{"name":"Netflix, Inc.","emps":13000,"profit":5408000000,"ebitda":7000000000,"logo":"https://logo.clearbit.com/netflix.com"},
  "DIS":{"name":"The Walt Disney Company","emps":220000,"profit":3000000000,"ebitda":14000000000,"logo":"https://logo.clearbit.com/thewaltdisneycompany.com"},
  "SBUX":{"name":"Starbucks Corporation","emps":402000,"profit":3582000000,"ebitda":5800000000,"logo":"https://logo.clearbit.com/starbucks.com"},
  "MCD":{"name":"McDonald's Corporation","emps":150000,"profit":8468000000,"ebitda":14000000000,"logo":"https://logo.clearbit.com/mcdonalds.com"},
  "F":{"name":"Ford Motor Company","emps":177000,"profit":4300000000,"ebitda":12000000000,"logo":"https://logo.clearbit.com/ford.com"},
  "GM":{"name":"General Motors Company","emps":163000,"profit":9936000000,"ebitda":16000000000,"logo":"https://logo.clearbit.com/gm.com"},
  "INTC":{"name":"Intel Corporation","emps":124800,"profit":-16639000000,"ebitda":-5000000000,"logo":"https://logo.clearbit.com/intel.com"},
  "CSCO":{"name":"Cisco Systems, Inc.","emps":84900,"profit":12613000000,"ebitda":16000000000,"logo":"https://logo.clearbit.com/cisco.com"},
  "IBM":{"name":"IBM Corporation","emps":288000,"profit":7502000000,"ebitda":14000000000,"logo":"https://logo.clearbit.com/ibm.com"},
  "GS":{"name":"Goldman Sachs Group","emps":45300,"profit":9457000000,"ebitda":11000000000,"logo":"https://logo.clearbit.com/goldmansachs.com"},
  "PFE":{"name":"Pfizer Inc.","emps":88000,"profit":-2800000000,"ebitda":5000000000,"logo":"https://logo.clearbit.com/pfizer.com"},
  "FDX":{"name":"FedEx Corporation","emps":547000,"profit":3965000000,"ebitda":8500000000,"logo":"https://logo.clearbit.com/fedex.com"},
  "UBER":{"name":"Uber Technologies, Inc.","emps":32200,"profit":1887000000,"ebitda":4000000000,"logo":"https://logo.clearbit.com/uber.com"},
  "LYFT":{"name":"Lyft, Inc.","emps":3913,"profit":22784000,"ebitda":528800000,"logo":"https://logo.clearbit.com/lyft.com"},
  "NKE":{"name":"Nike, Inc.","emps":83700,"profit":5070000000,"ebitda":7000000000,"logo":"https://logo.clearbit.com/nike.com"},
  "BA":{"name":"The Boeing Company","emps":172000,"profit":-2200000000,"ebitda":1000000000,"logo":"https://logo.clearbit.com/boeing.com"},
  "CVX":{"name":"Chevron Corporation","emps":45600,"profit":21369000000,"ebitda":38000000000,"logo":"https://logo.clearbit.com/chevron.com"},
  "TGT":{"name":"Target Corporation","emps":440000,"profit":4138000000,"ebitda":8000000000,"logo":"https://logo.clearbit.com/target.com"},
  "V":{"name":"Visa Inc.","emps":26500,"profit":17273000000,"ebitda":21000000000,"logo":"https://logo.clearbit.com/visa.com"},
  "MA":{"name":"Mastercard Incorporated","emps":33000,"profit":11195000000,"ebitda":14000000000,"logo":"https://logo.clearbit.com/mastercard.com"},
  "KO":{"name":"The Coca-Cola Company","emps":82500,"profit":10714000000,"ebitda":15000000000,"logo":"https://logo.clearbit.com/coca-cola.com"},
  "PEP":{"name":"PepsiCo, Inc.","emps":318000,"profit":9166000000,"ebitda":15000000000,"logo":"https://logo.clearbit.com/pepsico.com"},
  "BIIB":{"name":"Biogen Inc.","emps":7400,"profit":1640000000,"ebitda":2800000000,"logo":"https://logo.clearbit.com/biogen.com"},
  "WEN":{"name":"The Wendy's Company","emps":14500,"profit":103000000,"ebitda":490000000,"logo":"https://logo.clearbit.com/wendys.com"},
  "TAK":{"name":"Takeda Pharmaceutical","emps":49000,"profit":1900000000,"ebitda":7200000000,"logo":"https://logo.clearbit.com/takeda.com"},
  "ESLT":{"name":"Elbit Systems","emps":20000,"profit":680000000,"ebitda":850000000,"logo":"https://logo.clearbit.com/elbitsystems.com"},
  "SAFRY":{"name":"Safran","emps":100000,"profit":2300000000,"ebitda":4800000000,"logo":"https://logo.clearbit.com/safran.com"},
  "DUAVF":{"name":"Dassault Aviation","emps":14000,"profit":850000000,"ebitda":1100000000,"logo":"https://logo.clearbit.com/dassaultaviation.com"},
  "BCIGY":{"name":"Babcock International","emps":34000,"profit":180000000,"ebitda":520000000,"logo":"https://logo.clearbit.com/babcockinternational.com"},
  "QNTQF":{"name":"QinetiQ","emps":8000,"profit":170000000,"ebitda":310000000,"logo":"https://logo.clearbit.com/qinetiq.com"},
  "AMTM":{"name":"Amentum","emps":55000,"profit":180000000,"ebitda":680000000,"logo":"https://logo.clearbit.com/amentum.com"},
  "VVX":{"name":"V2X Inc","emps":16000,"profit":55000000,"ebitda":210000000,"logo":"https://logo.clearbit.com/vxinc.com"},
  "PSN":{"name":"Parsons Corporation","emps":18000,"profit":290000000,"ebitda":520000000,"logo":"https://logo.clearbit.com/parsons.com"},
  "MANT":{"name":"ManTech","emps":10000,"profit":120000000,"ebitda":250000000,"logo":"https://logo.clearbit.com/mantech.com"},
  "SAX":{"name":"StandardAero","emps":7000,"profit":95000000,"ebitda":480000000,"logo":"https://logo.clearbit.com/standardaero.com"},
  "TTMI":{"name":"TTM Technologies","emps":23000,"profit":95000000,"ebitda":320000000,"logo":"https://logo.clearbit.com/ttmtechnologies.com"},
  "MOG.A":{"name":"Moog Inc.","emps":13500,"profit":180000000,"ebitda":380000000,"logo":"https://logo.clearbit.com/moog.com"},
  "CW":{"name":"Curtiss-Wright","emps":10000,"profit":320000000,"ebitda":520000000,"logo":"https://logo.clearbit.com/curtisswright.com"},
  "MRCY":{"name":"Mercury Systems","emps":2800,"profit":-180000000,"ebitda":20000000,"logo":"https://logo.clearbit.com/mrcy.com"},
  "SPR":{"name":"Spirit AeroSystems","emps":16000,"profit":-1100000000,"ebitda":-200000000,"logo":"https://logo.clearbit.com/spiritaero.com"},
  "4503.T":{"name":"Astellas Pharma Inc.","emps":14000,"profit":1100000000,"ebitda":2200000000,"logo":"https://logo.clearbit.com/astellas.com"},
  "CACI":{"name":"CACI International","emps":23000,"profit":310000000,"ebitda":620000000,"logo":"https://logo.clearbit.com/caci.com"},
  "ASML":{"name":"ASML","emps":42000,"profit":7800000000,"ebitda":9800000000,"logo":"https://logo.clearbit.com/asml.com"},
  "SSNLF":{"name":"Samsung","emps":262647,"profit":14900000000,"ebitda":38000000000,"logo":"https://logo.clearbit.com/samsung.com"},
  "SAP":{"name":"SAP","emps":107000,"profit":5000000000,"ebitda":8500000000,"logo":"https://logo.clearbit.com/sap.com"},
  "ARM":{"name":"Arm Holdings","emps":8330,"profit":1600000000,"ebitda":2000000000,"logo":"https://logo.clearbit.com/arm.com"},
  "SHOP":{"name":"Shopify","emps":8300,"profit":1400000000,"ebitda":1700000000,"logo":"https://logo.clearbit.com/shopify.com"},
  "ACN":{"name":"Accenture","emps":774000,"profit":7100000000,"ebitda":9200000000,"logo":"https://logo.clearbit.com/accenture.com"},
  "SONY":{"name":"Sony","emps":113000,"profit":8700000000,"ebitda":14000000000,"logo":"https://logo.clearbit.com/sony.com"},
  "TOELY":{"name":"Tokyo Electron","emps":16000,"profit":3200000000,"ebitda":4200000000,"logo":"https://logo.clearbit.com/tel.com"},
  "ATEYY":{"name":"Advantest","emps":6464,"profit":820000000,"ebitda":1100000000,"logo":"https://logo.clearbit.com/advantest.com"},
  "XIACY":{"name":"Xiaomi","emps":35000,"profit":2400000000,"ebitda":3800000000,"logo":"https://logo.clearbit.com/xiaomi.com"},
  "TEL":{"name":"TE Connectivity","emps":89000,"profit":2000000000,"ebitda":3100000000,"logo":"https://logo.clearbit.com/te.com"},
  "IFNNY":{"name":"Infineon Technologies","emps":58600,"profit":1400000000,"ebitda":2800000000,"logo":"https://logo.clearbit.com/infineon.com"},
  "INFY":{"name":"Infosys","emps":323578,"profit":3200000000,"ebitda":4100000000,"logo":"https://logo.clearbit.com/infosys.com"},
  "NXPI":{"name":"NXP Semiconductors","emps":34500,"profit":2100000000,"ebitda":3400000000,"logo":"https://logo.clearbit.com/nxp.com"},
  "GRMN":{"name":"Garmin","emps":21000,"profit":1600000000,"ebitda":2100000000,"logo":"https://logo.clearbit.com/garmin.com"},
  "NOK":{"name":"Nokia","emps":78434,"profit":1200000000,"ebitda":2800000000,"logo":"https://logo.clearbit.com/nokia.com"},
  "HNHPF":{"name":"Hon Hai (Foxconn)","emps":726772,"profit":6200000000,"ebitda":10800000000,"logo":"https://logo.clearbit.com/foxconn.com"},
  "CRWV":{"name":"CoreWeave","emps":1800,"profit":-863000000,"ebitda":300000000,"logo":"https://logo.clearbit.com/coreweave.com"},
  "LITE":{"name":"Lumentum","emps":5500,"profit":-120000000,"ebitda":180000000,"logo":"https://logo.clearbit.com/lumentum.com"},
  "ERIC":{"name":"Ericsson","emps":94000,"profit":800000000,"ebitda":2200000000,"logo":"https://logo.clearbit.com/ericsson.com"},
  "RHHBY":{"name":"Roche","emps":101000,"profit":11700000000,"ebitda":21000000000,"logo":"https://logo.clearbit.com/roche.com"},
  "NVS":{"name":"Novartis","emps":78000,"profit":11500000000,"ebitda":16200000000,"logo":"https://logo.clearbit.com/novartis.com"},
  "AZN":{"name":"AstraZeneca","emps":89900,"profit":5900000000,"ebitda":12800000000,"logo":"https://logo.clearbit.com/astrazeneca.com"},
  "NVO":{"name":"Novo Nordisk","emps":72000,"profit":13400000000,"ebitda":17800000000,"logo":"https://logo.clearbit.com/novonordisk.com"},
  "MDT":{"name":"Medtronic","emps":86000,"profit":3600000000,"ebitda":6800000000,"logo":"https://logo.clearbit.com/medtronic.com"},
  "ESLOY":{"name":"EssilorLuxottica","emps":190000,"profit":2800000000,"ebitda":5200000000,"logo":"https://logo.clearbit.com/essilorluxottica.com"},
  "GSK":{"name":"GSK","emps":71000,"profit":4900000000,"ebitda":8400000000,"logo":"https://logo.clearbit.com/gsk.com"},
  "SNY":{"name":"Sanofi","emps":91000,"profit":5100000000,"ebitda":9800000000,"logo":"https://logo.clearbit.com/sanofi.com"},
  "ARGX":{"name":"argenx","emps":2200,"profit":800000000,"ebitda":900000000,"logo":"https://logo.clearbit.com/argenx.com"},
  "CSLLY":{"name":"CSL Limited","emps":32000,"profit":2200000000,"ebitda":3500000000,"logo":"https://logo.clearbit.com/csl.com"},
  "HLN":{"name":"Haleon","emps":24000,"profit":1500000000,"ebitda":2800000000,"logo":"https://logo.clearbit.com/haleon.com"},
  "TEVA":{"name":"Teva Pharmaceutical","emps":37000,"profit":1100000000,"ebitda":3400000000,"logo":"https://logo.clearbit.com/tevapharm.com"},
  "PHG":{"name":"Philips","emps":69000,"profit":800000000,"ebitda":2200000000,"logo":"https://logo.clearbit.com/philips.com"},
  "BNTX":{"name":"BioNTech","emps":5500,"profit":900000000,"ebitda":1100000000,"logo":"https://logo.clearbit.com/biontech.com"},
  "BAYRY":{"name":"Bayer","emps":96000,"profit":-2900000000,"ebitda":5800000000,"logo":"https://logo.clearbit.com/bayer.com"},
  "MKKGY":{"name":"Merck KGaA","emps":63000,"profit":3100000000,"ebitda":5400000000,"logo":"https://logo.clearbit.com/merckgroup.com"},
  "SMMNY":{"name":"Siemens Healthineers","emps":69000,"profit":2200000000,"ebitda":4100000000,"logo":"https://logo.clearbit.com/siemens-healthineers.com"},
  "FSNUY":{"name":"Fresenius","emps":180000,"profit":1200000000,"ebitda":4800000000,"logo":"https://logo.clearbit.com/fresenius.com"},
  "DSNKY":{"name":"Daiichi Sankyo","emps":17000,"profit":1900000000,"ebitda":3100000000,"logo":"https://logo.clearbit.com/daiichisankyo.com"},
  "OTSKY":{"name":"Otsuka Holdings","emps":33000,"profit":2300000000,"ebitda":3800000000,"logo":"https://logo.clearbit.com/otsuka.com"},
  "LZAGY":{"name":"Lonza Group","emps":17500,"profit":1200000000,"ebitda":2800000000,"logo":"https://logo.clearbit.com/lonza.com"},
  "GALDY":{"name":"Galderma","emps":6000,"profit":400000000,"ebitda":900000000,"logo":"https://logo.clearbit.com/galderma.com"},
  "ALPMY":{"name":"Astellas Pharma","emps":14000,"profit":1100000000,"ebitda":2200000000,"logo":"https://logo.clearbit.com/astellas.com"},
  "RPRX":{"name":"Royalty Pharma","emps":75,"profit":770000000,"ebitda":1560000000,"logo":"https://logo.clearbit.com/royaltypharma.com"},
  "INSM":{"name":"Insmed","emps":1400,"profit":-1280000000,"ebitda":-1240000000,"logo":"https://logo.clearbit.com/insmed.com"},
  "SDZNY":{"name":"Sandoz","emps":23000,"profit":700000000,"ebitda":1400000000,"logo":"https://logo.clearbit.com/sandoz.com"},
  "WBA":{"name":"Walgreens Boots Alliance","emps":312000,"profit":-8636000000,"ebitda":1200000000,"logo":"https://logo.clearbit.com/walgreens.com"},
  "HES":{"name":"Hess Corporation","emps":1775,"profit":2765000000,"ebitda":4200000000,"logo":"https://logo.clearbit.com/hess.com"},
  "SPOT":{"name":"Spotify Technology S.A.","emps":9808,"profit":1141000000,"ebitda":1600000000,"logo":"https://logo.clearbit.com/spotify.com"},
  "CP":{"name":"Canadian Pacific Kansas City","emps":20000,"profit":2940000000,"ebitda":5800000000,"logo":"https://logo.clearbit.com/cpkcr.com"},
  "CNI":{"name":"Canadian National Railway","emps":25000,"profit":4900000000,"ebitda":8100000000,"logo":"https://logo.clearbit.com/cn.ca"},
  "BF.B":{"name":"Brown-Forman","emps":5600,"profit":900000000,"ebitda":1200000000,"logo":"https://logo.clearbit.com/brown-forman.com"},
  "X":{"name":"United States Steel Corporation","emps":22053,"profit":1060000000,"ebitda":2200000000,"logo":"https://logo.clearbit.com/ussteel.com"},
  "BERY":{"name":"Berry Global","emps":40000,"profit":730000000,"ebitda":2000000000,"logo":"https://logo.clearbit.com/berryglobal.com"},
  "WRK":{"name":"WestRock Company","emps":42000,"profit":148000000,"ebitda":2600000000,"logo":"https://logo.clearbit.com/westrock.com"},
  "PCH":{"name":"PotlatchDeltic Corporation","emps":2200,"profit":130000000,"ebitda":280000000,"logo":"https://logo.clearbit.com/potlatchdeltic.com"},
  "TEN":{"name":"Tenneco Inc.","emps":71000,"profit":-1800000000,"ebitda":1100000000,"logo":"https://logo.clearbit.com/tenneco.com"},
  "AZEK":{"name":"AZEK Company","emps":3500,"profit":101000000,"ebitda":300000000,"logo":"https://logo.clearbit.com/azekco.com"},
  "ROIC":{"name":"Retail Opportunity Investments Corp.","emps":170,"profit":78000000,"ebitda":220000000,"logo":"https://logo.clearbit.com/roireit.net"},
  "SKT":{"name":"Tanger Factory Outlet Centers","emps":600,"profit":180000000,"ebitda":380000000,"logo":"https://logo.clearbit.com/tangeroutlet.com"},
  "SRCL":{"name":"Stericycle","emps":17000,"profit":-290000000,"ebitda":500000000,"logo":"https://logo.clearbit.com/stericycle.com"},
  "CURLF":{"name":"Curaleaf Holdings","emps":5500,"profit":-250000000,"ebitda":180000000,"logo":"https://logo.clearbit.com/curaleaf.com"},
  "VGR":{"name":"Vector Group","emps":2200,"profit":190000000,"ebitda":320000000,"logo":"https://logo.clearbit.com/vectorgroupltd.com"},
  "WOW":{"name":"WideOpenWest","emps":2200,"profit":-260000000,"ebitda":380000000,"logo":"https://logo.clearbit.com/wowway.com"},
  "JNPR":{"name":"Juniper Networks","emps":11000,"profit":193000000,"ebitda":600000000,"logo":"https://logo.clearbit.com/juniper.net"},
  "ZI":{"name":"ZoomInfo Technologies","emps":3500,"profit":-83000000,"ebitda":620000000,"logo":"https://logo.clearbit.com/zoominfo.com"},
  "ANSS":{"name":"Ansys","emps":6100,"profit":530000000,"ebitda":780000000,"logo":"https://logo.clearbit.com/ansys.com"},
  "ALTR":{"name":"Altair Engineering","emps":3700,"profit":68000000,"ebitda":185000000,"logo":"https://logo.clearbit.com/altair.com"},
  "NMI":{"name":"NMI Holdings","emps":580,"profit":270000000,"ebitda":370000000,"logo":"https://logo.clearbit.com/nationalmi.com"},
  "NVEE":{"name":"NV5 Global","emps":9000,"profit":60000000,"ebitda":200000000,"logo":"https://logo.clearbit.com/nv5.com"},
  "AER":{"name":"AerCap Holdings","emps":1950,"profit":3100000000,"ebitda":9200000000,"logo":"https://logo.clearbit.com/aercap.com"},
  "ATRI":{"name":"Atrion Corporation","emps":1300,"profit":85000000,"ebitda":130000000,"logo":"https://logo.clearbit.com/atrionmedical.com"},
  "STLA":{"name":"Stellantis N.V.","emps":242000,"profit":5640000000,"ebitda":16000000000,"logo":"https://logo.clearbit.com/stellantis.com"},
  "HMC":{"name":"Honda Motor Co.","emps":197574,"profit":10700000000,"ebitda":19000000000,"logo":"https://logo.clearbit.com/honda.com"},
  "VWAGY":{"name":"Volkswagen AG","emps":684025,"profit":10700000000,"ebitda":34000000000,"logo":"https://logo.clearbit.com/volkswagen.com"},
  "BMWYY":{"name":"BMW Group","emps":154950,"profit":8100000000,"ebitda":18000000000,"logo":"https://logo.clearbit.com/bmwgroup.com"},
  "MBGYY":{"name":"Mercedes-Benz Group AG","emps":166000,"profit":10400000000,"ebitda":22000000000,"logo":"https://logo.clearbit.com/mercedes-benz.com"},
  "DEO":{"name":"Diageo plc","emps":28000,"profit":3700000000,"ebitda":5800000000,"logo":"https://logo.clearbit.com/diageo.com"},
  "BUD":{"name":"Anheuser-Busch InBev","emps":86000,"profit":5340000000,"ebitda":14600000000,"logo":"https://logo.clearbit.com/ab-inbev.com"},
  "BTI":{"name":"British American Tobacco","emps":46000,"profit":7400000000,"ebitda":12800000000,"logo":"https://logo.clearbit.com/bat.com"},
  "NTR":{"name":"Nutrien Ltd.","emps":21000,"profit":1640000000,"ebitda":4200000000,"logo":"https://logo.clearbit.com/nutrien.com"},
  "AEM":{"name":"Agnico Eagle Mines","emps":21400,"profit":1680000000,"ebitda":3800000000,"logo":"https://logo.clearbit.com/agnicoeagle.com"},
  "WPM":{"name":"Wheaton Precious Metals","emps":48,"profit":790000000,"ebitda":920000000,"logo":"https://logo.clearbit.com/wheatonpreciousmetals.com"},
  "KGC":{"name":"Kinross Gold Corporation","emps":9400,"profit":550000000,"ebitda":1600000000,"logo":"https://logo.clearbit.com/kinross.com"},
  "AG":{"name":"First Majestic Silver Corp.","emps":3500,"profit":-120000000,"ebitda":160000000,"logo":"https://logo.clearbit.com/firstmajestic.com"},
  "SQM":{"name":"Sociedad Química y Minera de Chile","emps":13000,"profit":1920000000,"ebitda":3100000000,"logo":"https://logo.clearbit.com/sqm.com"},
  "IHG":{"name":"InterContinental Hotels Group","emps":32000,"profit":800000000,"ebitda":1400000000,"logo":"https://logo.clearbit.com/ihg.com"},
  "BEP":{"name":"Brookfield Renewable Partners","emps":4000,"profit":420000000,"ebitda":3200000000,"logo":"https://logo.clearbit.com/brookfield.com"},
  "CIGI":{"name":"Colliers International Group","emps":22000,"profit":140000000,"ebitda":480000000,"logo":"https://logo.clearbit.com/colliers.com"},
  "MEOH":{"name":"Methanex Corporation","emps":1300,"profit":250000000,"ebitda":620000000,"logo":"https://logo.clearbit.com/methanex.com"},
  "RIO":{"name":"Rio Tinto","emps":57000,"profit":10050000000,"ebitda":21000000000,"logo":"https://logo.clearbit.com/riotinto.com"},
  "BHP":{"name":"BHP Group","emps":80000,"profit":12900000000,"ebitda":26000000000,"logo":"https://logo.clearbit.com/bhp.com"},
  "VALE":{"name":"Vale S.A.","emps":44000,"profit":8000000000,"ebitda":17000000000,"logo":"https://logo.clearbit.com/vale.com"},
  "MT":{"name":"ArcelorMittal","emps":154000,"profit":2600000000,"ebitda":8000000000,"logo":"https://logo.clearbit.com/arcelormittal.com"},
  "PKX":{"name":"POSCO Holdings","emps":37000,"profit":1100000000,"ebitda":4200000000,"logo":"https://logo.clearbit.com/posco.co.kr"},
  "HTHIY":{"name":"Hitachi, Ltd.","emps":322525,"profit":4100000000,"ebitda":7800000000,"logo":"https://logo.clearbit.com/hitachi.com"},
  "DOW":{"name":"Dow Inc.","emps":35900,"profit":890000000,"ebitda":3200000000,"logo":"https://logo.clearbit.com/dow.com"},
  "DD":{"name":"DuPont de Nemours","emps":24000,"profit":1130000000,"ebitda":2600000000,"logo":"https://logo.clearbit.com/dupont.com"},
  "CC":{"name":"Chemours Company","emps":6000,"profit":220000000,"ebitda":680000000,"logo":"https://logo.clearbit.com/chemours.com"},
  "HTZ":{"name":"Hertz Global Holdings","emps":19000,"profit":-2900000000,"ebitda":1200000000,"logo":"https://logo.clearbit.com/hertz.com"},
  "CAR":{"name":"Avis Budget Group","emps":27000,"profit":382000000,"ebitda":1800000000,"logo":"https://logo.clearbit.com/avisbudgetgroup.com"},
  "ARE":{"name":"Alexandria Real Estate Equities","emps":1000,"profit":540000000,"ebitda":1400000000,"logo":"https://logo.clearbit.com/are.com"},
  "H":{"name":"Hyatt Hotels Corporation","emps":106000,"profit":350000000,"ebitda":900000000,"logo":"https://logo.clearbit.com/hyatt.com"},
  "VAC":{"name":"Marriott Vacations Worldwide","emps":19000,"profit":185000000,"ebitda":620000000,"logo":"https://logo.clearbit.com/marriottvacations.com"},
  "STEP":{"name":"StepStone Group","emps":800,"profit":180000000,"ebitda":240000000,"logo":"https://logo.clearbit.com/stepstonegroup.com"},
  "NAVI":{"name":"Navient Corporation","emps":6000,"profit":290000000,"ebitda":290000000,"logo":"https://logo.clearbit.com/navient.com"},
  "RKT":{"name":"Rocket Companies","emps":18000,"profit":7000000,"ebitda":600000000,"logo":"https://logo.clearbit.com/rocketcompanies.com"},
  "SFNC":{"name":"Simmons First National Corporation","emps":3600,"profit":170000000,"ebitda":170000000,"logo":"https://logo.clearbit.com/simmonsfirst.com"},
  "VTRS":{"name":"Viatris","emps":37000,"profit":-300000000},
  "ILPT":{"name":"Industrial Logistics Properties Trust","emps":35,"profit":-80000000,"ebitda":160000000,"logo":"https://logo.clearbit.com/ilptreit.com"},
  "LAC":{"name":"Lithium Americas Corp.","emps":500,"profit":-170000000,"ebitda":-150000000,"logo":"https://logo.clearbit.com/lithiumamericas.com"},
  "PDCO":{"name":"Patterson Companies","emps":8700,"profit":140000000,"ebitda":280000000,"logo":"https://logo.clearbit.com/pattersoncompanies.com"},
  "VTLE":{"name":"Vital Energy","emps":500,"profit":320000000,"ebitda":1200000000,"logo":"https://logo.clearbit.com/vitalenergy.com"},
  "AFYA":{"name":"Afya Limited","emps":5000,"profit":130000000,"ebitda":240000000,"logo":"https://logo.clearbit.com/afya.com.br"},
  "ITCI":{"name":"Intra-Cellular Therapies","emps":1200,"profit":185000000,"ebitda":220000000,"logo":"https://logo.clearbit.com/intracellulartherapies.com"},
  "UDR":{"name":"UDR Inc","emps":1533},
  "KIM":{"name":"Kimco Realty","emps":2000},
  "SITM":{"name":"SiTime Corporation","emps":220},
  "MTSI":{"name":"MACOM Technology Solutions","emps":1800},
  "SLAB":{"name":"Silicon Laboratories","emps":2200},
  "NN":{"name":"NN Inc","emps":1700},
  "VICI":{"name":"VICI Properties","emps":300},
  "ADC":{"name":"Agree Realty","emps":65},
  "NTST":{"name":"NetSTREIT","emps":35},
  "EPRT":{"name":"Essential Properties Realty Trust","emps":40},
  "LXP":{"name":"LXP Industrial Trust","emps":80},
  "TRNO":{"name":"Terreno Realty","emps":100},
  "STAG":{"name":"STAG Industrial","emps":250},
  "APLE":{"name":"Apple Hospitality REIT","emps":250},
  "OHI":{"name":"Omega Healthcare Investors","emps":175},
  "SBRA":{"name":"Sabra Health Care REIT","emps":60},
  "NHI":{"name":"National Health Investors","emps":60},
  "LTC":{"name":"LTC Properties","emps":30},
  "CHCT":{"name":"Community Healthcare Trust","emps":40},
  "IIPR":{"name":"Innovative Industrial Properties","emps":50},
  "VTR":{"name":"Ventas","emps":500},
  "TFSL":{"name":"Third Federal Savings & Loan","emps":1200},
  "TRMK":{"name":"Trustmark Corporation","emps":3000},
  "IBOC":{"name":"International Bancshares","emps":3500},
  "TFIN":{"name":"Triumph Financial","emps":700},
  "CVBF":{"name":"CVB Financial","emps":1200},
  "WSFS":{"name":"WSFS Financial","emps":1900},
  "SBCF":{"name":"Seacoast Banking","emps":1300},
  "GABC":{"name":"German American Bancorp","emps":1700},
  "AROW":{"name":"Arrow Financial","emps":750},
  "CHMG":{"name":"Chemung Financial","emps":550},
  "HTLF":{"name":"Heartland Financial USA","emps":4200,"profit":180000000,"ebitda":235000000},
  "FBMS":{"name":"First Bancshares","emps":1400,"profit":60000000,"ebitda":78000000},
  "TBNK":{"name":"Territorial Bancorp","emps":250,"profit":5000000,"ebitda":7000000},
  "ESAB":{"name":"ESAB Corporation","emps":9500},
  "MPAA":{"name":"Motorcar Parts of America","emps":4000},
  "LCII":{"name":"LCI Industries","emps":9000},
  "MOD":{"name":"Modine Manufacturing","emps":12000},
  "WSC":{"name":"WillScot Mobile Mini","emps":5000},
  "DY":{"name":"Dycom Industries","emps":15500},
  "NVST":{"name":"Envista Holdings","emps":14000},
  "COHU":{"name":"Cohu Inc","emps":3000},
  "POWI":{"name":"Power Integrations","emps":1900},
  "CVCO":{"name":"Cavco Industries","emps":7000},
  "PATK":{"name":"Patrick Industries","emps":12000},
  "PLAY":{"name":"Dave & Buster's Entertainment","emps":18000},
  "CARS":{"name":"Cars.com","emps":1600},
  "MTG":{"name":"MGIC Investment","emps":1400},
  "SMAR":{"name":"Smartsheet","emps":3400,"profit":-200000000,"ebitda":-150000000},
  "PRPH":{"name":"ProPhase Labs","emps":300},
  "SVC":{"name":"Service Properties Trust","emps":400},
  "M":{"name":"Macy's","emps":94000},
  "FITB":{"name":"Fifth Third Bancorp","emps":19000},
  "KEY":{"name":"KeyCorp","emps":17000},
  "NTRS":{"name":"Northern Trust","emps":22000},
  "BR":{"name":"Broadridge Financial","emps":14000},
  "PRU":{"name":"Prudential Financial","emps":40000},
  "CB":{"name":"Chubb","emps":40000},
  "GL":{"name":"Globe Life","emps":3400},
  "RLI":{"name":"RLI Corp","emps":1000},
  "MPC":{"name":"Marathon Petroleum","emps":18000},
  "OXY":{"name":"Occidental Petroleum","emps":12000},
  "FANG":{"name":"Diamondback Energy","emps":2300},
  "APA":{"name":"APA Corporation","emps":3300},
  "EPD":{"name":"Enterprise Products Partners","emps":7500},
  "EQT":{"name":"EQT Corporation","emps":2600},
  "CTRA":{"name":"Coterra Energy","emps":2000},
  "PR":{"name":"Permian Resources","emps":1200},
  "PCG":{"name":"PG&E","emps":26000},
  "EIX":{"name":"Edison International","emps":13000},
  "NI":{"name":"NiSource","emps":7500},
  "AEE":{"name":"Ameren","emps":10000},
  "PEG":{"name":"PSEG","emps":13000},
  "AES":{"name":"AES Corporation","emps":10000},
  "OTTR":{"name":"Otter Tail","emps":2200},
  "CHTR":{"name":"Charter Communications","emps":101000},
  "EA":{"name":"Electronic Arts","emps":9800},
  "JBLU":{"name":"JetBlue","emps":23000},
  "EXPD":{"name":"Expeditors International","emps":18000},
  "ODFL":{"name":"Old Dominion Freight Line","emps":23000},
  "SAIA":{"name":"Saia Inc","emps":15000},
  "WERN":{"name":"Werner Enterprises","emps":14000},
  "KNX":{"name":"Knight-Swift Transportation","emps":25000},
  "HTLD":{"name":"Heartland Express","emps":5000},
  "LAD":{"name":"Lithia Motors","emps":20000},
  "DRI":{"name":"Darden Restaurants","emps":175000},
  "TXRH":{"name":"Texas Roadhouse","emps":70000},
  "RRGB":{"name":"Red Robin Gourmet Burgers","emps":25000},
  "SHAK":{"name":"Shake Shack","emps":10000},
  "ADM":{"name":"Archer Daniels Midland","emps":42000},
  "BG":{"name":"Bunge Global","emps":23000},
  "VITL":{"name":"Vital Farms","emps":350},
  "EL":{"name":"Estée Lauder","emps":62000},
  "MMM":{"name":"3M","emps":88000},
  "EMR":{"name":"Emerson Electric","emps":76000},
  "OTIS":{"name":"Otis Worldwide","emps":71000},
  "GWW":{"name":"W.W. Grainger","emps":27000},
  "OC":{"name":"Owens Corning","emps":20000},
  "WY":{"name":"Weyerhaeuser","emps":9300},
  "PH":{"name":"Parker Hannifin","emps":62000},
  "ROP":{"name":"Roper Technologies","emps":6000},
  "MIDD":{"name":"Middleby Corporation","emps":11000},
  "GT":{"name":"Goodyear Tire & Rubber","emps":71000},
  "MSI":{"name":"Motorola Solutions","emps":21000},
  "CTAS":{"name":"Cintas","emps":45000},
  "URI":{"name":"United Rentals","emps":24000},
  "FLR":{"name":"Fluor Corporation","emps":40000},
  "HUN":{"name":"Huntsman","emps":7000},
  "RS":{"name":"Reliance Steel & Aluminum","emps":15000},
  "AMT":{"name":"American Tower","emps":4700},
  "O":{"name":"Realty Income","emps":400},
  "PAYX":{"name":"Paychex","emps":16000},
  "KFRC":{"name":"Kforce","emps":2500},
  "TBI":{"name":"TrueBlue","emps":4200},
  "LH":{"name":"Labcorp","emps":60000},
  "MRNA":{"name":"Moderna","emps":5000},
  "ENSG":{"name":"Ensign Group","emps":30000},
  "HLT":{"name":"Hilton Worldwide","emps":178000},
  "CHH":{"name":"Choice Hotels","emps":1800},
  "DKNG":{"name":"DraftKings","emps":5000},
  "TNL":{"name":"Travel + Leisure","emps":19000},
  "STRA":{"name":"Strategic Education","emps":2600},
  "LOPE":{"name":"Grand Canyon Education","emps":12000},
  "ATGE":{"name":"Adtalem Global Education","emps":10000},
  "DUOL":{"name":"Duolingo","emps":700},
  "CLH":{"name":"Clean Harbors","emps":21000},
  "TCNNF":{"name":"Trulieve Cannabis","emps":9000},
  "MO":{"name":"Altria Group","emps":6600},
  "GLW":{"name":"Corning","emps":57000},
  "CDW":{"name":"CDW Corporation","emps":15000},
  "KEYS":{"name":"Keysight Technologies","emps":14000},
  "QRVO":{"name":"Qorvo","emps":8000},
  "CASY":{"name":"Casey's General Stores","emps":47000},
  "MKL":{"name":"Markel Group","emps":22000},
  "PLMR":{"name":"Palomar Holdings","emps":350},
  "ZION":{"name":"Zions Bancorporation","emps":10000},
  "PNFP":{"name":"Pinnacle Financial Partners","emps":3200},
  "SLM":{"name":"Sallie Mae","emps":1700},
  "UWMC":{"name":"UWM Holdings","emps":7000},
  "CABO":{"name":"Cable One","emps":3700},
  "CWEN":{"name":"Clearway Energy","emps":600},
  "ARCC":{"name":"Ares Capital Corporation","emps":0},
  "MAIN":{"name":"Main Street Capital","emps":100},
  "HTGC":{"name":"Hercules Capital","emps":60},
  "CQP":{"name":"Cheniere Energy Partners","emps":0},
  "SWX":{"name":"Southwest Gas Holdings","emps":2500},
  "NWN":{"name":"Northwest Natural Holdings","emps":1200},
  "YETI":{"name":"YETI Holdings","emps":1100},
  "CBRL":{"name":"Cracker Barrel","emps":76000},
  "NEU":{"name":"NewMarket Corporation","emps":2000},
  "IART":{"name":"Integra LifeSciences","emps":4500},
  "HESM":{"name":"Hess Midstream","emps":0},
  "DKL":{"name":"Delek Logistics Partners","emps":0},
  "REX":{"name":"REX American Resources","emps":500},
  "BATL":{"name":"Battalion Oil","emps":100},
  "CEVA":{"name":"CEVA Inc","emps":450},
  "WOLF":{"name":"Wolfspeed","emps":3000},
  "FCNCA":{"name":"First Citizens BancShares","emps":30000},
  "BUSE":{"name":"First Busey Corporation","emps":1500},
  "NBTB":{"name":"NBT Bancorp","emps":1900},
  "HBNC":{"name":"Horizon Bancal","emps":1200},
  "VCNX":{"name":"Vaccinex","emps":50},
  "IPG":{"name":"Interpublic Group","emps":58000,"profit":680000000,"ebitda":1100000000},
  "PLYA":{"name":"Playa Hotels & Resorts","emps":10000,"profit":-30000000,"ebitda":180000000},
  "COOP":{"name":"Mr. Cooper Group","emps":9000,"profit":460000000,"ebitda":600000000},
  "SPTN":{"name":"SpartanNash","emps":17000,"profit":30000000,"ebitda":200000000},
  "MRC":{"name":"MRC Global","emps":3900,"profit":80000000,"ebitda":150000000},
  "WIRE":{"name":"Encore Wire","emps":1600,"profit":300000000,"ebitda":380000000},
  "CIVI":{"name":"Civitas Resources","emps":700,"profit":900000000,"ebitda":2200000000},
  "BECN":{"name":"Beacon Roofing Supply","emps":9000,"profit":400000000,"ebitda":700000000},
  "SUM":{"name":"Summit Materials","emps":8000,"profit":200000000,"ebitda":700000000},
  "CMA":{"name":"Comerica","emps":7565,"profit":800000000,"ebitda":1100000000},
  "SNV":{"name":"Synovus Financial","emps":5000,"profit":450000000,"ebitda":590000000},
  "CPAY":{"name":"Corpay","emps":10000},
  "CINF":{"name":"Cincinnati Financial","emps":6000},
  "TRGP":{"name":"Targa Resources","emps":3000},
  "EXC":{"name":"Exelon","emps":21000},
  "CNP":{"name":"CenterPoint Energy","emps":9000},
  "FE":{"name":"FirstEnergy","emps":12000},
  "FSLR":{"name":"First Solar","emps":18000},
  "TKO":{"name":"TKO Group Holdings","emps":1000},
  "RXO":{"name":"RXO","emps":5500},
  "AN":{"name":"AutoNation","emps":26000},
  "CMI":{"name":"Cummins","emps":60000},
  "USFD":{"name":"US Foods","emps":34000},
  "K":{"name":"Kellanova","emps":23000,"profit":1100000000,"ebitda":1800000000},
  "HAS":{"name":"Hasbro","emps":6500},
  "SPB":{"name":"Spectrum Brands","emps":12000},
  "MHK":{"name":"Mohawk Industries","emps":40000},
  "CAT":{"name":"Caterpillar","emps":109000},
  "FTV":{"name":"Fortive","emps":18000},
  "TOL":{"name":"Toll Brothers","emps":5000},
  "STLD":{"name":"Steel Dynamics","emps":12000},
  "RYN":{"name":"Rayonier","emps":350},
  "TRMB":{"name":"Trimble","emps":11000},
  "HOLI":{"name":"Hollysys Automation","emps":4000,"profit":120000000,"ebitda":160000000},
  "CMC":{"name":"Commercial Metals Company","emps":14000},
  "HAYN":{"name":"Haynes International","emps":1400,"profit":80000000,"ebitda":110000000},
  "CCI":{"name":"Crown Castle","emps":5000},
  "SPG":{"name":"Simon Property Group","emps":4500},
  "MAA":{"name":"Mid-America Apartment","emps":2500},
  "NNN":{"name":"NNN REIT","emps":200},
  "MAN":{"name":"ManpowerGroup","emps":30000},
  "DVA":{"name":"DaVita","emps":65000},
  "HSIC":{"name":"Henry Schein","emps":23000},
  "COO":{"name":"Cooper Companies","emps":15000},
  "CCL":{"name":"Carnival Corporation","emps":120000},
  "PM":{"name":"Philip Morris International","emps":75000},
  "GEN":{"name":"Gen Digital","emps":4000},
  "SFM":{"name":"Sprouts Farmers Market","emps":36000},
  "VIAV":{"name":"Viavi Solutions","emps":3500},
  "UI":{"name":"Ubiquiti","emps":1000},
  "TGNA":{"name":"TEGNA","emps":7000},
  "SRPT":{"name":"Sarepta Therapeutics","emps":1800},
  "ACAD":{"name":"ACADIA Pharmaceuticals","emps":900},
  "TNDM":{"name":"Tandem Diabetes Care","emps":1900},
  "RUSHA":{"name":"Rush Enterprises","emps":7200},
  "JAZZ":{"name":"Jazz Pharmaceuticals","emps":2800},
  "DFS":{"name":"Discover Financial Services","emps":18000,"profit":3000000000,"ebitda":4000000000},
  "ZEUS":{"name":"Olympic Steel","emps":1700},
  "ABBNY":{"name":"ABB Ltd","emps":105000,"profit":3300000000,"ebitda":5500000000},
  "PRFT":{"name":"Perficient","emps":7000,"profit":100000000,"ebitda":180000000},
  "PINC":{"name":"Premier Inc","emps":1200,"profit":150000000,"ebitda":250000000},
  "AIG":{"name":"AIG","emps":26000},
  "HUM":{"name":"Humana","emps":65680},
  "CNX":{"name":"CNX Resources","emps":2400},
  "OMC":{"name":"Omnicom Group","emps":74000},
  "WGO":{"name":"Winnebago Industries","emps":5000},
  "CHD":{"name":"Church & Dwight","emps":6000},
  "GE":{"name":"GE Aerospace","emps":128000},
  "AOS":{"name":"A.O. Smith","emps":13500},
  "PRIM":{"name":"Primoris Services","emps":14000},
  "PLD":{"name":"Prologis","emps":2700},
  "JKHY":{"name":"Jack Henry & Associates","emps":7300},
  "AMED":{"name":"Amedisys","emps":20000,"profit":80000000,"ebitda":200000000},
  "MAR":{"name":"Marriott International","emps":418000},
  "NCLH":{"name":"Norwegian Cruise Line","emps":41700},
  "WDC":{"name":"Western Digital","emps":40000},
  "WTFC":{"name":"Wintrust Financial","emps":5500},
  "ONTO":{"name":"Onto Innovation","emps":1760},
  "SIEGY":{"name":"Siemens AG","emps":320000,"profit":9000000000,"ebitda":15000000000},
  "SBR":{"name":"Sabine Royalty Trust","emps":5,"profit":40000000,"ebitda":40000000},
  "CRT":{"name":"Cross Timbers Royalty Trust","emps":5,"profit":20000000,"ebitda":20000000},
  "PHX":{"name":"PHX Minerals","emps":15,"profit":10000000,"ebitda":15000000},
  "GPS":{"name":"Gap Inc.","emps":85000,"profit":514000000,"ebitda":1400000000},
  "ODP":{"name":"The ODP Corporation","emps":13500,"profit":80000000,"ebitda":220000000},
  "BRK.B":{"name":"Berkshire Hathaway","emps":396500,"profit":96223000000,"ebitda":120000000000},
  "WTW":{"name":"Willis Towers Watson","emps":36000},
  "XPO":{"name":"XPO Logistics","emps":42000},
  "MAS":{"name":"Masco","emps":19000},
  "HUBB":{"name":"Hubbell","emps":19500},
  "NEM":{"name":"Newmont","emps":17500},
  "INVH":{"name":"Invitation Homes","emps":2400},
  "CSGP":{"name":"CoStar Group","emps":5800},
  "WST":{"name":"West Pharmaceutical Services","emps":8200},
  "TECH":{"name":"Bio-Techne","emps":3100},
  "WYNN":{"name":"Wynn Resorts","emps":28000},
  "LDOS":{"name":"Leidos Holdings","emps":47000},
  "SWN":{"name":"Southwestern Energy","emps":1400,"profit":400000000,"ebitda":900000000},
  "BRKL":{"name":"Brookline Bancorp","emps":1200,"profit":85000000,"ebitda":110000000},
  "HBI":{"name":"Hanesbrands","emps":41000,"profit":200000000,"ebitda":500000000},
  "PEAK":{"name":"Healthpeak Properties","emps":200,"profit":280000000,"ebitda":600000000},
  "SBNY":{"name":"Signature Bank","emps":2243,"profit":1100000000,"ebitda":1430000000},
  "DNB":{"name":"Dun & Bradstreet","emps":6000,"profit":150000000,"ebitda":700000000},
  "MMC":{"name":"Marsh McLennan","emps":83000,"profit":3700000000,"ebitda":4800000000},
  "NOVA":{"name":"Sunnova Energy","emps":3000,"profit":-600000000,"ebitda":-200000000},
  "HHC":{"name":"Howard Hughes Holdings","emps":1500,"profit":200000000,"ebitda":400000000},
  "SIX":{"name":"Six Flags Entertainment","emps":40000,"profit":-100000000,"ebitda":400000000},
  "GPN":{"name":"Global Payments","emps":27000},
  "RJF":{"name":"Raymond James Financial","emps":8600},
  "CNC":{"name":"Centene","emps":74000},
  "DVN":{"name":"Devon Energy","emps":1900},
  "WEC":{"name":"WEC Energy Group","emps":7400},
  "CMS":{"name":"CMS Energy","emps":2900},
  "SAM":{"name":"Boston Beer Company","emps":2000},
  "SMP":{"name":"Standard Motor Products","emps":5500},
  "ITW":{"name":"Illinois Tool Works","emps":44000},
  "PPG":{"name":"PPG Industries","emps":51000},
  "HST":{"name":"Host Hotels & Resorts","emps":250},
  "ADP":{"name":"ADP","emps":58000},
  "PAYC":{"name":"Paycom Software","emps":7000},
  "PFSI":{"name":"PennyMac Financial Services","emps":4000},

  // ── NO_EMPS fixes ─────────────────────────────────────────────────────────
  "ALK":  {"name":"Alaska Air Group","emps":22000,"profit":100000000,"ebitda":1100000000},
  "TT":   {"name":"Trane Technologies","emps":40000,"profit":2920000000,"ebitda":4360000000},
  "HI":   {"name":"Hillenbrand","emps":10900,"profit":180000000,"ebitda":450000000},
  "HESM": {"name":"Hess Midstream","emps":0,"profit":352900000,"ebitda":1220000000},
  "DKL":  {"name":"Delek Logistics Partners","emps":0,"profit":176460000,"ebitda":307440000},
  "ARCC": {"name":"Ares Capital Corporation","emps":0,"profit":1300000000,"ebitda":1690000000},
  "CQP":  {"name":"Cheniere Energy Partners","emps":0,"profit":2990000000,"ebitda":4390000000},
  "NEP":  {"name":"NextEra Energy Partners","emps":0,"profit":400000000,"ebitda":900000000},

  // ── NO_PROFIT / NO_EBITDA fixes ───────────────────────────────────────────
  "ZEUS": {"name":"Olympic Steel","emps":1700,"profit":85000000,"ebitda":180000000},
  "VTRS": {"name":"Viatris","emps":32000,"profit":480000000,"ebitda":2800000000},

  // ── Still-active companies returning API_ERROR ────────────────────────────
  "DENN": {"name":"Denny's","emps":6900,"profit":28000000,"ebitda":95000000},
  "SEAS": {"name":"SeaWorld Entertainment","emps":5000,"profit":180000000,"ebitda":480000000},
  "LGF.A":{"name":"Lions Gate Entertainment","emps":3600,"profit":90000000,"ebitda":280000000},
  "CORE": {"name":"Core & Main","emps":5500,"profit":340000000,"ebitda":560000000},
  "DINE": {"name":"Dine Brands Global","emps":1100,"profit":110000000,"ebitda":230000000},
  "SJW":  {"name":"SJW Group","emps":800,"profit":55000000,"ebitda":140000000},
  "BIGC": {"name":"BigCommerce","emps":800,"profit":-60000000,"ebitda":-40000000},
  "AMEH": {"name":"Apollo Medical Holdings","emps":350,"profit":35000000,"ebitda":65000000},
  "ROLSY":{"name":"Rolls-Royce Holdings","emps":42000,"profit":2400000000,"ebitda":3200000000},
  "CDAY": {"name":"Dayforce (Ceridian)","emps":8700,"profit":120000000,"ebitda":380000000},
  "LANC": {"name":"Lancaster Colony","emps":4000,"profit":130000000,"ebitda":200000000},
  "ROLL": {"name":"RBC Bearings","emps":6800,"profit":260000000,"ebitda":470000000},
  "OMI":  {"name":"Owens & Minor","emps":21000,"profit":-80000000,"ebitda":320000000},

  // ── NO_EMPS fixes: wiki scraper failing to find employee count ────────────
  // CAVA: Wikipedia says c.11,000 (2024). Scraper fails on "Cava Group, Inc." name.
  "CAVA":  {"name":"Cava Group","emps":11000},
  // EMN: Eastman Chemical. Wikipedia says 14,000. Scraper fails on "Eastman Chemical Co".
  "EMN":   {"name":"Eastman Chemical","emps":14000},
  // CAKE: The Cheesecake Factory. Wikipedia says 47,500 (2022). Scraper fails to extract.
  // Financials: FY2023 net income ~$148M, EBITDA ~$296M.
  "CAKE":  {"name":"The Cheesecake Factory","emps":47500,"profit":148430000,"ebitda":296320000},
  // DK: Delek US Holdings. Wikipedia says 3,746 (2023). FY2023: profit ~$220M, EBITDA ~$800M.
  "DK":    {"name":"Delek US Holdings","emps":3746,"profit":220000000,"ebitda":800000000},

  // ── API_ERROR: acquired/merged — need name to avoid 404, financials for calc ──
  // REV: Revlon filed bankruptcy 2022, emerged 2023. FY2021 data.
  "REV":   {"name":"Revlon","emps":5800,"profit":206000000,"ebitda":300000000},
  // ROPER: misspelled ticker, real ticker is ROP (passing). Redirect.
  "ROPER": {"name":"Roper Technologies","emps":6000,"profit":1540000000,"ebitda":3130000000},
  // LHCG: acquired by UnitedHealth/Optum in 2023.
  "LHCG":  {"name":"LHC Group","emps":30000,"profit":220000000,"ebitda":420000000},
  // NBT: duplicate of NBTB (passing). Same company, alternate ticker format.
  "NBT":   {"name":"NBT Bancorp","emps":2386,"profit":169000000,"ebitda":220000000},
  // NWIN: Northwest Indiana Bancorp — tiny OTC community bank.
  "NWIN":  {"name":"Northwest Indiana Bancorp","emps":120,"profit":5000000,"ebitda":7000000},
  // OLIN: Olin Corporation — still public (NYSE). FY2024 data.
  "OLIN":  {"name":"Olin Corporation","emps":8400,"profit":364000000,"ebitda":964000000},
  // MMP: Magellan Midstream acquired by ONEOK 2023. FY2022 data.
  "MMP":   {"name":"Magellan Midstream Partners","emps":1700,"profit":850000000,"ebitda":1500000000},
  // SAVE: Spirit Airlines filed bankruptcy Nov 2024.
  "SAVE":  {"name":"Spirit Airlines","emps":12000,"profit":-340000000,"ebitda":-180000000},
  // SAFM: Sanderson Farms taken private by Cargill/Continental Grain 2022.
  "SAFM":  {"name":"Sanderson Farms","emps":17500,"profit":490000000,"ebitda":700000000},
  // SWM: Renamed Mativ Holdings (MATV) after merging with Neenah 2022.
  "SWM":   {"name":"Schweitzer-Mauduit International (now Mativ)","emps":4500,"profit":60000000,"ebitda":280000000},
  // FBHS: Split into FBIN + MBC 2023.
  "FBHS":  {"name":"Fortune Brands Home & Security","emps":13000,"profit":600000000,"ebitda":1000000000},
  // FOE: Ferro Corporation acquired by Prince International 2022.
  "FOE":   {"name":"Ferro Corporation","emps":5000,"profit":100000000,"ebitda":250000000},
  // AUY: Yamana Gold acquired by Pan American Silver 2023.
  "AUY":   {"name":"Yamana Gold","emps":7600,"profit":330000000,"ebitda":900000000},
  // NCR: Split into NCR Atleos (NATL) + NCR Voyix (VYX) 2023.
  "NCR":   {"name":"NCR Corporation","emps":35000,"profit":240000000,"ebitda":1200000000},
  // KMPH: KemPharm acquired by Aquestive Therapeutics 2022.
  "KMPH":  {"name":"KemPharm","emps":50,"profit":-40000000,"ebitda":-35000000},
  // AIMC: Altra Industrial Motion merged into Regal Rexnord (RRX) 2022.
  "AIMC":  {"name":"Altra Industrial Motion","emps":11400,"profit":150000000,"ebitda":520000000},
  // TMST: TimkenSteel renamed Metallus (MTUS) 2024. FY2023 data.
  "TMST":  {"name":"TimkenSteel (now Metallus)","emps":2300,"profit":148000000,"ebitda":244000000},
  // MDC: MDC Holdings acquired by Sumitomo Forestry 2024.
  "MDC":   {"name":"MDC Holdings","emps":2100,"profit":370000000,"ebitda":500000000},
  // LUPE: Lundin Petroleum became Lundin Energy, acquired by APA 2022.
  "LUPE":  {"name":"Lundin Petroleum","emps":1100,"profit":1200000000,"ebitda":2100000000},
  // CPE: Callon Petroleum acquired by APA Corporation 2024.
  "CPE":   {"name":"Callon Petroleum","emps":700,"profit":521000000,"ebitda":1300000000},
  // USD: US Silica taken private by Apollo 2024.
  "USD":   {"name":"US Silica Holdings","emps":1600,"profit":134000000,"ebitda":387000000},
  // NGAS: Gastar Exploration filed bankruptcy 2018, delisted.
  "NGAS":  {"name":"Gastar Exploration","emps":60,"profit":-80000000,"ebitda":40000000},
  // CDK: CDK Global taken private by Brookfield 2022.
  "CDK":   {"name":"CDK Global","emps":9000,"profit":200000000,"ebitda":700000000},
  // SEND: SendGrid acquired by Twilio 2019.
  "SEND":  {"name":"SendGrid","emps":900,"profit":10000000,"ebitda":40000000},
  // PRSP: Perspecta acquired by Peraton 2021.
  "PRSP":  {"name":"Perspecta","emps":14000,"profit":200000000,"ebitda":500000000},
  // BRKS: Brooks Automation split 2021 → Azenta (AZTA, passing) + Brooks Life Sciences (private).
  "BRKS":  {"name":"Brooks Automation","emps":3400,"profit":28000000,"ebitda":82000000},
  // CCMP: CMC Materials acquired by Entegris 2022.
  "CCMP":  {"name":"CMC Materials","emps":2400,"profit":136000000,"ebitda":331000000},
  // CREE: Old ticker for Wolfspeed, now WOLF (passing).
  "CREE":  {"name":"Wolfspeed (formerly Cree)","emps":3000,"profit":-1610000000,"ebitda":-1080000000},
  // LSI: Life Storage merged with Extra Space Storage (EXR, passing) 2023.
  "LSI":   {"name":"Life Storage","emps":1600,"profit":350000000,"ebitda":600000000},
  // WRI: Weingarten Realty acquired by Kimco Realty (KIM, passing) 2021.
  "WRI":   {"name":"Weingarten Realty","emps":500,"profit":200000000,"ebitda":350000000},
  // PREIT: Pennsylvania REIT filed bankruptcy 2020, restructured.
  "PREIT": {"name":"Pennsylvania REIT","emps":200,"profit":-120000000,"ebitda":80000000},
  // LR: Duplicate ticker for Loews Corporation; real ticker is L (passing).
  "LR":    {"name":"Loews Corporation","emps":13000,"profit":1670000000,"ebitda":2170000000},
  // CFX: Colfax split into ESAB (passing) + Enovis (ENOV) 2022.
  "CFX":   {"name":"Colfax Corporation","emps":16000,"profit":-126000000,"ebitda":476000000},
  // HZN: Horizon Global filed bankruptcy 2023.
  "HZN":   {"name":"Horizon Global","emps":4500,"profit":-60000000,"ebitda":80000000},
  // YRCW: Yellow Corporation (YRC Worldwide) filed bankruptcy Jul 2023.
  "YRCW":  {"name":"Yellow Corporation","emps":30000,"profit":-505000000,"ebitda":100000000},
  // USAK: USA Truck acquired by Knight-Swift (KNX, passing) 2022.
  "USAK":  {"name":"USA Truck","emps":2200,"profit":80000000,"ebitda":160000000},
  // PTSI: P.A.M. Transport acquired by Heartland Express 2022.
  "PTSI":  {"name":"P.A.M. Transport Services","emps":2500,"profit":90000000,"ebitda":180000000},
  // ECHO: Echo Global Logistics taken private by The Jordan Company 2021.
  "ECHO":  {"name":"Echo Global Logistics","emps":2700,"profit":50000000,"ebitda":100000000},
  // TRTN: Triton International acquired by Brookfield Infrastructure 2023.
  "TRTN":  {"name":"Triton International","emps":600,"profit":620000000,"ebitda":1100000000},
  // GVNBV: Glatfelter acquired by Solenis 2024.
  "GVNBV": {"name":"Glatfelter","emps":3200,"profit":-133000000,"ebitda":52000000},
  // CCHWF: Cresco Labs — OTC cannabis company.
  "CCHWF": {"name":"Cresco Labs","emps":3400,"profit":-226000000,"ebitda":124000000},
  // JOANN: JOANN Inc filed bankruptcy 2024.
  "JOANN": {"name":"JOANN Inc","emps":20000,"profit":-170000000,"ebitda":60000000},
  // PRTY: Party City filed bankruptcy Jan 2023.
  "PRTY":  {"name":"Party City","emps":12500,"profit":-121000000,"ebitda":310000000}
};



// Retry wrapper for transient fetch failures (timeouts, 5xx, network blips)
async function fetchWithRetry(url, opts, retries = 2) {
    let lastErr;
    for (let i = 0; i <= retries; i++) {
        try {
            const res = await fetch(url, opts);
            return res;
        } catch(e) {
            lastErr = e;
            if (i < retries) await new Promise(r => setTimeout(r, 600 * (i + 1)));
        }
    }
    throw lastErr;
}

// Fetch USD exchange rate for a given currency code
// Uses frankfurter.app - free, no key required
const FX_CACHE = {};
async function toUSD(amount, currency) {
    if (!amount || !currency || currency === 'USD') return amount;
    const cur = currency.toUpperCase();
    if (!FX_CACHE[cur]) {
        try {
            const r = await fetch(`https://api.frankfurter.app/latest?from=${cur}&to=USD`);
            if (r.ok) {
                const j = await r.json();
                FX_CACHE[cur] = j.rates?.USD || null;
            }
        } catch(e) { FX_CACHE[cur] = null; }
    }
    const rate = FX_CACHE[cur];
    return rate ? Math.round(amount * rate) : amount;
}

async function fetchFromEDGAR(symbol) {
    const tickerRes = await fetchWithRetry('https://www.sec.gov/files/company_tickers.json', {
        headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
    });
    if (!tickerRes.ok) throw new Error('EDGAR tickers HTTP ' + tickerRes.status);
    const tickers = await tickerRes.json();

    // EDGAR uses hyphens for multi-class tickers (BRK-B, LGF-A) — try both formats
    const symbolVariants = [symbol.toUpperCase(), symbol.toUpperCase().replace(/\./, '-')];

    let cik = null, companyName = null;
    for (const entry of Object.values(tickers)) {
        if (entry.ticker && symbolVariants.includes(entry.ticker.toUpperCase())) {
            cik = String(entry.cik_str).padStart(10, '0');
            companyName = entry.title;
            break;
        }
    }
    if (!cik) throw new Error('EDGAR: ticker not found');

    const factsRes = await fetchWithRetry(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
        headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
    });
    if (!factsRes.ok) throw new Error('EDGAR facts HTTP ' + factsRes.status);
    const facts = await factsRes.json();

    const us_gaap = facts.facts['us-gaap'] || {};
    const dei = facts.facts['dei'] || {};
    const ifrs = facts.facts['ifrs-full'] || {};

    // Employee count - many companies don't file this
    let emps = null;
    for (const field of ['EntityNumberOfEmployees', 'NumberOfEmployees']) {
        const empFact = dei[field];
        if (empFact && empFact.units && empFact.units['pure']) {
            const sorted = empFact.units['pure']
                .filter(e => e.form === '10-K' || e.form === '10-K/A' || e.form === '20-F')
                .sort((a, b) => b.end.localeCompare(a.end));
            if (sorted.length > 0) { emps = sorted[0].val; break; }
        }
    }

    // Net income - exclude future periods, prefer entries where filed date
    // is within 6 months of end date (avoids picking up restatements filed years later)
    const today = new Date().toISOString().split('T')[0];
    // Use last completed fiscal year - filed within 12 months of period end
    let profit = null;
    // Try US-GAAP fields first, then IFRS fields (foreign private issuers file 20-F with IFRS)
    const profitFields20F = ['ProfitLoss', 'ProfitLossAttributableToOwnersOfParent'];
    for (const field of ['NetIncomeLoss', 'NetIncome', 'ProfitLoss']) {
        const fact = us_gaap[field];
        if (fact && fact.units && fact.units['USD']) {
            const entries = fact.units['USD']
                .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start && e.end <= today)
                .filter(e => {
                    // Only use entries filed within 12 months of the period end
                    const endYear = parseInt(e.end.substring(0, 4));
                    const filedYear = parseInt(e.filed.substring(0, 4));
                    return filedYear <= endYear + 1;
                })
                .sort((a, b) => b.end.localeCompare(a.end));
            if (entries.length > 0) { profit = entries[0].val; break; }
        }
    }
    // IFRS fallback for foreign private issuers (20-F filers)
    if (profit === null) {
        for (const field of profitFields20F) {
            const fact = ifrs[field];
            if (fact && fact.units && fact.units['USD']) {
                const entries = fact.units['USD']
                    .filter(e => e.form === '20-F' && e.start && e.end <= today)
                    .sort((a, b) => b.end.localeCompare(a.end));
                if (entries.length > 0) { profit = entries[0].val; break; }
            }
        }
    }

    // EBITDA = operating income + D&A
    let ebitda = null;
    const opFact = us_gaap['OperatingIncomeLoss'];
    if (opFact && opFact.units && opFact.units['USD']) {
        const sorted = opFact.units['USD']
            .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start && e.end <= today)
            .sort((a, b) => b.end.localeCompare(a.end));
        if (sorted.length > 0) {
            let dna = 0;
            for (const f of ['DepreciationDepletionAndAmortization', 'DepreciationAndAmortization', 'Depreciation']) {
                const dnaFact = us_gaap[f];
                if (dnaFact && dnaFact.units && dnaFact.units['USD']) {
                    const dnaSorted = dnaFact.units['USD']
                        .filter(e => (e.form === '10-K' || e.form === '10-K/A') && e.start)
                        .sort((a, b) => b.end.localeCompare(a.end));
                    if (dnaSorted.length > 0) { dna = dnaSorted[0].val; break; }
                }
            }
            ebitda = sorted[0].val + dna;
        }
    }

    return { name: companyName || null, emps, profit, ebitda, logo: null, source: 'edgar' };
}


async function fetchEmployeeCountFrom10K(cik) {
    // Step 1: Get recent filings from submissions API
    const subRes = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
        headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
    });
    if (!subRes.ok) throw new Error('EDGAR submissions HTTP ' + subRes.status);
    const sub = await subRes.json();

    // Find most recent 10-K — submissions API includes primaryDocument directly
    const filings = sub.filings?.recent || {};
    const forms = filings.form || [];
    const accessions = filings.accessionNumber || [];
    const primaryDocs = filings.primaryDocument || [];

    let accession = null;
    let primaryDoc = null;
    for (let i = 0; i < forms.length; i++) {
        if (forms[i] === '10-K' || forms[i] === '10-K/A') {
            accession = accessions[i];
            primaryDoc = primaryDocs[i];
            break;
        }
    }
    if (!accession) throw new Error('No 10-K found in submissions');

    // Step 2: Build the document URL directly — no index fetch needed
    // The submissions API gives us primaryDocument (e.g. "esab-20231231.htm")
    const accNoDashes = accession.replace(/-/g, '');
    const numericCik = cik.replace(/^0+/, '');

    let docUrl = null;
    if (primaryDoc && (primaryDoc.endsWith('.htm') || primaryDoc.endsWith('.html'))) {
        docUrl = `https://www.sec.gov/Archives/edgar/data/${numericCik}/${accNoDashes}/${primaryDoc}`;
    } else {
        // Fallback: fetch the index page to find the main document
        const indexUrl = `https://www.sec.gov/Archives/edgar/data/${numericCik}/${accNoDashes}/${accession}-index.htm`;
        const indexRes = await fetch(indexUrl, {
            headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
        });
        if (!indexRes.ok) throw new Error('Filing index HTTP ' + indexRes.status);
        const indexHtml = await indexRes.text();
        // Parse the first .htm link that looks like the main doc (not an exhibit)
        const docMatch = indexHtml.match(/href="([^"]+\.htm)"/i);
        if (!docMatch) throw new Error('No .htm document found in filing index');
        docUrl = 'https://www.sec.gov' + (docMatch[1].startsWith('/') ? docMatch[1] : '/' + docMatch[1]);
    }

    // Step 3: Fetch the document - but only first ~200KB to find employee count
    // Employee count is almost always in Item 1 (first ~50 pages)
    const docRes = await fetch(docUrl, {
        headers: {
            'User-Agent': 'YourFairShare admin@yourfairshare.com',
            'Range': 'bytes=0-400000'
        }
    });
    if (!docRes.ok && docRes.status !== 206) throw new Error('10-K document HTTP ' + docRes.status);
    const html = await docRes.text();

    // Strip HTML tags to get plain text
    const text = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&#[0-9]+;/g, ' ')
        .replace(/\s+/g, ' ');

    // Search for employee count patterns
    const patterns = [
        // "approximately 95,000 employees" or "approximately 95,000 full-time employees"
        /(?:approximately|about|around|had|have|employs?|employed|employ)\s+([\d,]+)\s+(?:full[- ]time\s+)?(?:and\s+part[- ]time\s+)?employees/gi,
        // "workforce of approximately 95,000"
        /workforce\s+of\s+(?:approximately|about)?\s*([\d,]+)/gi,
        // "95,000 employees worldwide/globally/as of/at"
        /([\d,]+)\s+(?:full[- ]time\s+)?employees\s+(?:worldwide|globally|as\s+of|at\s+)/gi,
        // "headcount of 95,000"
        /headcount\s+of\s+(?:approximately)?\s*([\d,]+)/gi,
        // "we had 95,000 total employees"
        /(?:had|have|with)\s+([\d,]+)\s+total\s+(?:full[- ]time\s+)?employees/gi,
        // "95,000 full-time employees"
        /([\d,]+)\s+full[- ]time\s+employees/gi,
        // "as of December 31, 2023, we had X employees" — very common REIT/bank phrasing
        /as\s+of\s+(?:december|january|february|march|april|may|june|july|august|september|october|november)\s+\d+[^,]*,\s*(?:we\s+)?(?:had|have|employed)\s+([\d,]+)\s+(?:full[- ]time\s+)?(?:and\s+part[- ]time\s+)?employees/gi,
        // "X employees and" or "X employees,"
        /([\d,]+)\s+employees(?:\s+and|\s*,)/gi,
        // "employed X individuals/persons/people"
        /employed\s+([\d,]+)\s+(?:individuals?|persons?|people)/gi,
        // "staff of X" or "team of X employees"
        /(?:staff|team)\s+of\s+([\d,]+)\s*(?:employees|individuals|people|members)?/gi,
    ];

    // Check for externally-managed entity (many REITs have no employees)
    if (/we have no employees|have no direct employees|no employees.*externally managed|externally managed.*no employees|our manager.*employees|managed by.*advisor.*no employees/i.test(text)) {
        return 0; // legitimately zero — externally managed
    }

    const candidates = [];
    for (const pattern of patterns) {
        let match;
        pattern.lastIndex = 0;
        while ((match = pattern.exec(text)) !== null) {
            // Find the captured group that looks like a number
            for (let g = 1; g < match.length; g++) {
                if (match[g]) {
                    const raw = match[g].trim();
                    const n = parseInt(raw.replace(/,/g, ''), 10);
                    if (!isNaN(n) && n >= 100 && n <= 5000000) {
                        // Reject if it looks like a year in a date context:
                        // only filter 4-digit numbers 2015-2029 when they appear
                        // right after month/day patterns in the matched text
                        const fullMatch = match[0];
                        const isYearInDate = n >= 2015 && n <= 2029 &&
                            /(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2},?\s*$/i.test(fullMatch.substring(0, fullMatch.lastIndexOf(raw)));
                        if (!isYearInDate) {
                            candidates.push(n);
                        }
                    }
                }
            }
            if (candidates.length >= 10) break; // enough samples
        }
        if (candidates.length >= 3) break;
    }

    if (!candidates.length) throw new Error('Employee count not found in 10-K text');

    // The first mention is usually the official count in Item 1
    // But take the most common value as a sanity check
    const freq = {};
    for (const n of candidates) {
        // Round to nearest 100 for grouping
        const key = Math.round(n / 100) * 100;
        freq[key] = (freq[key] || 0) + 1;
    }
    const mostCommon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    return parseInt(mostCommon[0]);
}

// ── companiesmarketcap.com employee count fetcher ────────────────────────────
// Uses CMC's JSON search API to find the slug, then scrapes the /employees/ page.
// Only called as a last resort when all other sources fail.
async function fetchEmployeeCountFromStockAnalysis(symbol) {
    // stockanalysis.com has clean employee history pages for most US-listed stocks
    // URL: https://stockanalysis.com/stocks/{ticker}/employees/
    // Page contains e.g. "had 39,000 employees" and a stat block with the number
    const url = `https://stockanalysis.com/stocks/${symbol.toLowerCase()}/employees/`;
    const saController = new AbortController();
    const saTimeout = setTimeout(() => saController.abort(), 4000); // 4s hard limit
    let res;
    try {
        res = await fetch(url, {
            signal: saController.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
            }
        });
    } finally {
        clearTimeout(saTimeout);
    }
    if (!res || !res.ok) throw new Error(`StockAnalysis employees HTTP ${res?.status} for ${symbol}`);
    const html = await res.text();

    // Pattern 1: "had X,XXX employees as of" — the introductory sentence
    const sentenceMatch = html.match(/had\s+([\d,]+)\s+employees\s+as\s+of/i);
    if (sentenceMatch) {
        const n = parseInt(sentenceMatch[1].replace(/,/g, ''), 10);
        if (!isNaN(n) && n >= 1) return n;
    }

    // Pattern 2: The big stat number — appears in a <td> or <div> right after "Employees" label
    // StockAnalysis renders: Employees then 39,000 as adjacent elements
    const statMatch = html.match(/Employees[^<]{0,60}<[^>]+>\s*([\d,]+)\s*</i);
    if (statMatch) {
        const n = parseInt(statMatch[1].replace(/,/g, ''), 10);
        if (!isNaN(n) && n >= 1) return n;
    }

    // Pattern 3: JSON-LD or meta
    const jsonMatch = html.match(/"numberOfEmployees"\s*:\s*([\d]+)/i);
    if (jsonMatch) {
        const n = parseInt(jsonMatch[1], 10);
        if (!isNaN(n) && n >= 1) return n;
    }

    throw new Error(`StockAnalysis: employee count not found for ${symbol}`);
}

// Keep CMC as a secondary fallback with fixed slug logic
async function fetchEmployeeCountFromCMC(symbol, companyName) {
    let slug = null;

    // Strategy 1: CMC search API
    try {
        const searchUrl = `https://companiesmarketcap.com/api/companies/search/?query=${encodeURIComponent(symbol)}&limit=5`;
        const searchRes = await fetch(searchUrl, {
            headers: { 'User-Agent': 'YourFairShare/1.0 (research)', 'Accept': 'application/json' }
        });
        if (searchRes.ok) {
            const results = await searchRes.json();
            const arr = Array.isArray(results) ? results : (results.data || results.results || []);
            const byTicker = arr.find(r => r.ticker && r.ticker.toUpperCase() === symbol.toUpperCase());
            const byName = companyName && arr.find(r =>
                r.name && r.name.toLowerCase().includes(companyName.split(' ')[0].toLowerCase())
            );
            const match = byTicker || byName || arr[0];
            if (match && match.slug) slug = match.slug;
        }
    } catch(e) { /* fall through */ }

    // Strategy 2: derive slug from name
    if (!slug && companyName) {
        slug = companyName
            .toLowerCase()
            .replace(/[,.'&]/g, '')
            .replace(/,?\s+(inc\.?|corp\.?|ltd\.?|llc|l\.p\.?|\blp\b|co\.?|holdings?|group|corporation|limited|plc|technologies|company)\s*$/i, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    if (!slug) throw new Error('CMC: could not determine slug');

    const empUrl = `https://companiesmarketcap.com/${slug}/employees/`;
    const empRes = await fetch(empUrl, {
        headers: { 'User-Agent': 'YourFairShare/1.0 (research)', 'Accept': 'text/html' }
    });
    if (!empRes.ok) throw new Error(`CMC HTTP ${empRes.status} for slug: ${slug}`);

    const html = await empRes.text();
    const patterns = [
        /"numberOfEmployees"\s*:\s*[\"{]?\s*"?([\d,]+)"?/i,
        /class="[^"]*company-stat-value[^"]*"[^>]*>\s*([\d,.]+\s*[KkMm]?)\s*</i,
        /Employees[^<]*<\/[^>]+>\s*<[^>]+>\s*([\d,]+)/i,
        />\s*([\d,]{3,})\s*<\/[^>]+>\s*(?:<[^>]+>)*\s*(?:employees?|workers?|staff)/i,
    ];
    for (const pattern of patterns) {
        const m = html.match(pattern);
        if (m) {
            let raw = m[1].trim().replace(/,/g, '');
            if (/k$/i.test(raw)) return Math.round(parseFloat(raw) * 1000);
            if (/m$/i.test(raw)) return Math.round(parseFloat(raw) * 1000000);
            const n = parseInt(raw, 10);
            if (!isNaN(n) && n >= 10 && n <= 5000000) return n;
        }
    }
    throw new Error('CMC: employee count not found in page');
}

async function fetchFromFMP(symbol) {
    const profileRes = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`);
    if (!profileRes.ok) throw new Error(`FMP profile HTTP ${profileRes.status}`);
    const profileArr = await profileRes.json();
    if (!profileArr?.[0]?.companyName) throw new Error('FMP: no profile');
    const p = profileArr[0];
    const reportedCurrency = p.reportedCurrency || p.currency || 'USD';
    let profit = null, ebitda = null;
    try {
        const incomeRes = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&period=annual&apikey=${FMP_KEY}`);
        if (incomeRes.ok) {
            const incomeArr = await incomeRes.json();
            const inc = incomeArr?.[0] || {};
            profit = (inc.netIncome != null && inc.netIncome !== 0) ? inc.netIncome : null;
            ebitda = (inc.ebitda != null && inc.ebitda !== 0) ? inc.ebitda : null;
            // Derive EBITDA from operatingIncome + D&A when not directly available
            if (ebitda === null && inc.operatingIncome && inc.depreciationAndAmortization) {
                ebitda = inc.operatingIncome + Math.abs(inc.depreciationAndAmortization);
            }
        }
    } catch(e) {}
    // Try cash flow statement for D&A-derived EBITDA if income-statement missed it
    if (ebitda === null) {
        try {
            const [incRes2, cfRes] = await Promise.all([
                fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&period=annual&apikey=${FMP_KEY}`),
                fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=1&period=annual&apikey=${FMP_KEY}`)
            ]);
            const incArr2 = incRes2.ok ? await incRes2.json() : [];
            const cfArr   = cfRes.ok  ? await cfRes.json()  : [];
            const inc2 = incArr2?.[0] || {};
            const cf   = cfArr?.[0]  || {};
            if (inc2.operatingIncome && cf.depreciationAndAmortization) {
                ebitda = inc2.operatingIncome + Math.abs(cf.depreciationAndAmortization);
            }
        } catch(e) {}
    }
    // Try key-metrics for ebitda if still missing
    if (ebitda === null) {
        try {
            const kmRes = await fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?limit=1&apikey=${FMP_KEY}`);
            if (kmRes.ok) {
                const kmArr = await kmRes.json();
                const km = kmArr?.[0] || {};
                if (km.enterpriseValue && km.evToEbitda && km.evToEbitda > 0) {
                    ebitda = Math.round(km.enterpriseValue / km.evToEbitda);
                }
            }
        } catch(e) {}
    }
    // Convert non-USD currencies to USD
    if (reportedCurrency !== 'USD') {
        profit = await toUSD(profit, reportedCurrency);
        ebitda = await toUSD(ebitda, reportedCurrency);
    }
    return {
        name: p.companyName || null,
        emps: p.fullTimeEmployees || null,
        profit, ebitda,
        logo: p.image || null,
        source: 'fmp'
    };
}

async function fetchFromFinnhub(symbol) {
    const [profileRes, finRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
        fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`)
    ]);
    const p = await profileRes.json();
    const f = await finRes.json();
    if (!p?.name) throw new Error('Finnhub: no profile');
    const m = f.metric || {};
    const currency = p.currency || 'USD';
    let profit = (m.netIncomePerShareAnnual && m.sharesOutstanding)
        ? Math.round(m.netIncomePerShareAnnual * m.sharesOutstanding) : null;
    let ebitda = (m.ebitdaPerShareAnnual && m.sharesOutstanding)
        ? Math.round(m.ebitdaPerShareAnnual * m.sharesOutstanding) : null;
    // Convert to USD if needed
    if (currency !== 'USD') {
        profit = await toUSD(profit, currency);
        ebitda = await toUSD(ebitda, currency);
    }
    let logo = p.logo || null;
    if (!logo && p.weburl) try { logo = `https://logo.clearbit.com/${new URL(p.weburl).hostname}`; } catch(e) {}
    return {
        name: p.name || null,
        emps: p.employeeTotal || null,
        profit, ebitda, logo,
        source: 'finnhub'
    };
}

async function fetchFromAlphaVantage(symbol) {
    const [overviewRes, incomeRes] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${AV_KEY}`),
        fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${AV_KEY}`)
    ]);
    if (!overviewRes.ok) throw new Error('AV HTTP ' + overviewRes.status);
    const overview = await overviewRes.json();
    if (!overview || !overview.Name) throw new Error('AV: no data');
    if (overview.Note || overview.Information) throw new Error('AV: rate limited');

    // AV returns numbers as strings, and missing values as "None" or "-"
    const parseAV = (v) => (v && v !== 'None' && v !== '-' && v !== 'N/A') ? parseInt(v) : null;

    const emps = parseAV(overview.FullTimeEmployees);
    const avCurrency = overview.Currency || 'USD';
    let profit = null, ebitda = parseAV(overview.EBITDA);

    if (incomeRes.ok) {
        const income = await incomeRes.json();
        const latest = (income.annualReports || [])[0] || {};
        profit = parseAV(latest.netIncome);
        if (!ebitda) ebitda = parseAV(latest.ebitda);
    }

    // Convert to USD if reported in foreign currency
    if (avCurrency !== 'USD') {
        profit = await toUSD(profit, avCurrency);
        ebitda = await toUSD(ebitda, avCurrency);
    }

    return { name: overview.Name || null, emps, profit, ebitda, logo: null, source: 'alphavantage' };
}

async function fetchFromYahooFinance(symbol) {
    // Yahoo Finance is blocked from Vercel's AWS IPs.
    // Instead, use FMP's financial-statements-as-reported endpoint
    // which covers foreign ADRs and returns data in reported currency.
    // Also try twelvedata as a secondary source.
    
    // Attempt 1: FMP annual income + cash-flow statements
    try {
        const [incRes, cfRes] = await Promise.all([
            fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=1&period=annual&apikey=${FMP_KEY}`),
            fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=1&period=annual&apikey=${FMP_KEY}`)
        ]);
        const incArr = incRes.ok ? await incRes.json() : [];
        const cfArr  = cfRes.ok  ? await cfRes.json()  : [];
        const inc = incArr?.[0] || {};
        const cf  = cfArr?.[0]  || {};

        let profit = (inc.netIncome != null && inc.netIncome !== 0) ? inc.netIncome : null;
        let ebitda = (inc.ebitda != null && inc.ebitda !== 0) ? inc.ebitda : null;

        // Derive EBITDA from operatingIncome + D&A when not directly provided
        if (!ebitda && inc.operatingIncome && (inc.depreciationAndAmortization || cf.depreciationAndAmortization)) {
            const dna = inc.depreciationAndAmortization || cf.depreciationAndAmortization;
            ebitda = inc.operatingIncome + Math.abs(dna);
        }

        const reportedCurrency = inc.reportedCurrency || 'USD';
        if (reportedCurrency !== 'USD') {
            profit = await toUSD(profit, reportedCurrency);
            ebitda = await toUSD(ebitda, reportedCurrency);
        }

        if (profit !== null || ebitda !== null) {
            return { name: null, emps: null, profit, ebitda, logo: null, source: 'fmp_intl' };
        }
    } catch(e) {}

    // Attempt 2: TTM from quarterly data (covers companies without a full annual filing in FMP)
    try {
        const [incQRes, cfQRes] = await Promise.all([
            fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=4&period=quarter&apikey=${FMP_KEY}`),
            fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=4&period=quarter&apikey=${FMP_KEY}`)
        ]);
        const incQArr = incQRes.ok ? await incQRes.json() : [];
        const cfQArr  = cfQRes.ok  ? await cfQRes.json()  : [];

        if (incQArr.length >= 4) {
            const reportedCurrency = incQArr[0].reportedCurrency || 'USD';
            // Sum last 4 quarters for TTM
            let ttmProfit = 0, ttmEbitda = 0, ttmOpInc = 0, ttmDna = 0;
            let hasProfit = false, hasEbitda = false;
            for (const q of incQArr) {
                if (q.netIncome != null && q.netIncome !== 0) { ttmProfit += q.netIncome; hasProfit = true; }
                if (q.ebitda != null && q.ebitda !== 0) { ttmEbitda += q.ebitda; hasEbitda = true; }
                if (q.operatingIncome != null) ttmOpInc += q.operatingIncome;
            }
            for (const q of cfQArr) {
                if (q.depreciationAndAmortization != null) ttmDna += q.depreciationAndAmortization;
            }
            // Derive TTM EBITDA from operatingIncome + D&A if not directly available
            if (!hasEbitda && ttmOpInc && ttmDna) {
                ttmEbitda = ttmOpInc + Math.abs(ttmDna);
                hasEbitda = true;
            }
            let profit = hasProfit ? ttmProfit : null;
            let ebitda = hasEbitda ? ttmEbitda : null;
            if (reportedCurrency !== 'USD') {
                profit = await toUSD(profit, reportedCurrency);
                ebitda = await toUSD(ebitda, reportedCurrency);
            }
            if (profit !== null || ebitda !== null) {
                return { name: null, emps: null, profit, ebitda, logo: null, source: 'fmp_ttm' };
            }
        }
    } catch(e) {}

    throw new Error(`fetchFromYahooFinance: no financial data for ${symbol}`);
}



// Known Wikipedia page titles for ambiguous tickers/names
const WIKI_TITLE_MAP = {
    'RTX': 'RTX Corporation',
    'RTX CORP': 'RTX Corporation',
    'LHX': 'L3Harris Technologies',
    'L3HARRIS': 'L3Harris Technologies',
    'L3HARRIS TECHNOLOGIES': 'L3Harris Technologies',
    'GD': 'General Dynamics',
    'LMT': 'Lockheed Martin',
    'BA': 'Boeing',
    'HON': 'Honeywell',
    'MMM': '3M',
    'GE': 'GE Aerospace',
    'CAT': 'Caterpillar Inc.',
    'DE': 'John Deere',
    'F': 'Ford Motor Company',
    'GM': 'General Motors',
    'TSLA': 'Tesla Inc.',
    'AMZN': 'Amazon',
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft',
    'NVDA': 'Nvidia',
    'BAESY': 'BAE Systems',
    'CAE': 'CAE Inc.',
    'CW':   'Curtiss-Wright Corporation',
    'LMT':  'Lockheed Martin',
    'NOC':  'Northrop Grumman',
    'GD':   'General Dynamics',
    'LHX':  'L3Harris Technologies',
    'LDOS': 'Leidos',
    'HII':  'Huntington Ingalls Industries',
    'BAH':  'Booz Allen Hamilton',
    'GE':   'GE Aerospace',
    'HON':  'Honeywell',
    'KBR':  'KBR Inc.',
    'SAIC': 'Science Applications International Corporation',
    'TXT':  'Textron',
    'TDG':  'TransDigm Group',
    'OSK':  'Oshkosh Corporation',
    'BWXT': 'BWX Technologies',
    'VSAT': 'Viasat Inc.',
    'PH':   'Parker Hannifin',
    'APH':  'Amphenol',
    'ETN':  'Eaton Corporation',
    'PLTR': 'Palantir Technologies',
    'MOG.A':'Moog Inc.',
    'PH':   'Parker Hannifin',
    'HEI':  'HEICO',
    'HWM':  'Howmet Aerospace',
    'KEYS': 'Keysight Technologies',
    'TDY':  'Teledyne Technologies',
    'KTOS': 'Kratos Defense & Security Solutions',
    'OSK':  'Oshkosh Corporation',
    'BWXT': 'BWX Technologies',
    'VSAT': 'Viasat (American company)',
    // Tech 100 additions
    'NVDA':  'Nvidia',
    'AAPL':  'Apple Inc.',
    'MSFT':  'Microsoft',
    'AVGO':  'Broadcom Inc.',
    'ORCL':  'Oracle Corporation',
    'MU':    'Micron Technology',
    'AMD':   'Advanced Micro Devices',
    'CSCO':  'Cisco',
    'AMAT':  'Applied Materials',
    'LRCX':  'Lam Research',
    'CRM':   'Salesforce',
    'KLAC':  'KLA Corporation',
    'TXN':   'Texas Instruments',
    'ANET':  'Arista Networks',
    'ADI':   'Analog Devices',
    'UBER':  'Uber',
    'QCOM':  'Qualcomm',
    'PANW':  'Palo Alto Networks',
    'NOW':   'ServiceNow',
    'INTU':  'Intuit',
    'ADBE':  'Adobe Inc.',
    'GLW':   'Corning Inc.',
    'CRWD':  'CrowdStrike',
    'DELL':  'Dell Technologies',
    'ADP':   'ADP (company)',
    'WDC':   'Western Digital',
    'SNPS':  'Synopsys',
    'CDNS':  'Cadence Design Systems',
    'STX':   'Seagate Technology',
    'MRVL':  'Marvell Technology',
    'MSI':   'Motorola Solutions',
    'NET':   'Cloudflare',
    'SNOW':  'Snowflake Inc.',
    'FTNT':  'Fortinet',
    'ADSK':  'Autodesk',
    'MPWR':  'Monolithic Power Systems',
    'COHR':  'Coherent (company)',
    'TER':   'Teradyne',
    'DDOG':  'Datadog',
    'WDAY':  'Workday, Inc.',
    'ROP':   'Roper Technologies',
    // International tech
    'TSM':   'TSMC',
    'ASML':  'ASML Holding',
    'SSNLF': 'Samsung Electronics',
    'SAP':   'SAP',
    'SHOP':  'Shopify',
    'ACN':   'Accenture',
    'SONY':  'Sony',
    'ARM':   'Arm Holdings',
    'TOELY': 'Tokyo Electron',
    'ATEYY': 'Advantest',
    'TEL':   'TE Connectivity',
    'IFNNY': 'Infineon Technologies',
    'INFY':  'Infosys',
    'NXPI':  'NXP Semiconductors',
    'GRMN':  'Garmin',
    'NOK':   'Nokia',
    'ERIC':  'Ericsson',
    // Tech100 new additions
    'UI':    'Ubiquiti',
    'XYZ':   'Block, Inc.',
    'CRWV':  'CoreWeave',
    'CIEN':  'Ciena',
    'LITE':  'Lumentum Holdings',
    'HNHPF': 'Hon Hai Precision Industry',
    // Healthcare companies
    'LLY':   'Eli Lilly and Company',
    'JNJ':   'Johnson & Johnson',
    'ABBV':  'AbbVie',
    'MRK':   'Merck & Co.',
    'UNH':   'UnitedHealth Group',
    'AMGN':  'Amgen',
    'ABT':   'Abbott Laboratories',
    'TMO':   'Thermo Fisher Scientific',
    'GILD':  'Gilead Sciences',
    'ISRG':  'Intuitive Surgical',
    'PFE':   'Pfizer',
    'SYK':   'Stryker Corporation',
    'DHR':   'Danaher Corporation',
    'BMY':   'Bristol-Myers Squibb',
    'HCA':   'HCA Healthcare',
    'VRTX':  'Vertex Pharmaceuticals',
    'MCK':   'McKesson Corporation',
    'BSX':   'Boston Scientific',
    'CVS':   'CVS Health',
    'REGN':  'Regeneron Pharmaceuticals',
    'CI':    'The Cigna Group',
    'COR':   'Cencora',
    'ELV':   'Elevance Health',
    'BDX':   'Becton Dickinson',
    'ZTS':   'Zoetis',
    'CAH':   'Cardinal Health',
    'IDXX':  'IDEXX Laboratories',
    'EW':    'Edwards Lifesciences',
    'RMD':   'ResMed',
    'GEHC':  'GE HealthCare',
    'A':     'Agilent Technologies',
    'VEEV':  'Veeva Systems',
    'IQV':   'IQVIA',
    'WAT':   'Waters Corporation',
    'NTRA':  'Natera (company)',
    'BIIB':  'Biogen',
    'DXCM':  'Dexcom',
    'RPRX':  'Royalty Pharma',
    'ALNY':  'Alnylam Pharmaceuticals',
    'ONC':   'BeiGene',
    'INSM':  'Insmed',
    // International healthcare
    'RHHBY': 'Roche',
    'NVS':   'Novartis',
    'AZN':   'AstraZeneca',
    'NVO':   'Novo Nordisk',
    'MDT':   'Medtronic',
    'ESLOY': 'EssilorLuxottica',
    'GSK':   'GSK plc',
    'SNY':   'Sanofi',
    'TAK':   'Takeda Pharmaceutical',
    'ARGX':  'argenx',
    'CSLLY': 'CSL Limited',
    'HLN':   'Haleon',
    'TEVA':  'Teva Pharmaceutical Industries',
    'PHG':   'Philips',
    'BNTX':  'BioNTech',
    'BAYRY': 'Bayer',
    'MKKGY': 'Merck KGaA',
    'SMMNY': 'Siemens Healthineers',
    'FSNUY': 'Fresenius SE',
    'DSNKY': 'Daiichi Sankyo',
    'OTSKY': 'Otsuka Holdings',
    'LZAGY': 'Lonza',
    'GALDY': 'Galderma',
    'ALPMY': 'Astellas Pharma',
    'SDZNY': 'Sandoz',
    'MOG.A':'Moog Inc.',
    'PH':   'Parker Hannifin',
    'HXL':  'Hexcel',
    'FINMY': 'Leonardo S.p.A.',
    'THLEF': 'Thales Group',
    'SAABF': 'Saab AB',
    'RNMBY': 'Rheinmetall',
    'SHEL': 'Shell plc',
    'TM': 'Toyota',
    'EADSY': 'Airbus',
    'RYCEY': 'Rolls-Royce Holdings',
    'TSM': 'TSMC',
    'BABA': 'Alibaba Group',
    'META': 'Meta Platforms',
    'GOOGL': 'Alphabet Inc.',
    'GOOGLE': 'Alphabet Inc.',
    'ALPHABET': 'Alphabet Inc.',
    'BRK': 'Berkshire Hathaway',
    'BERKSHIRE': 'Berkshire Hathaway',
    'JPM': 'JPMorgan Chase',
    'JPMORGAN': 'JPMorgan Chase',
    'GS': 'Goldman Sachs',
    'MS': 'Morgan Stanley',
    'BAC': 'Bank of America',
    'WFC': 'Wells Fargo',
    'C': 'Citigroup',
    'USB': 'U.S. Bancorp',

    // ── Retail & Consumer ──────────────────────────────────────────────────────
    'WMT':  'Walmart',
    'AMZN': 'Amazon (company)',
    'COST': 'Costco',
    'HD':   'The Home Depot',
    'TGT':  'Target Corporation',
    'TJX':  'TJX Companies',
    'LOW':  "Lowe's",
    'KR':   'Kroger',
    'WBA':  'Walgreens Boots Alliance',
    'ACI':  'Albertsons',
    'ROST': 'Ross Stores',
    'DG':   'Dollar General',
    'DLTR': 'Dollar Tree',
    'BBY':  'Best Buy',
    'NKE':  'Nike, Inc.',
    'EBAY': 'eBay',
    'ETSY': 'Etsy',
    'W':    'Wayfair',
    'TSCO': 'Tractor Supply Company',
    'AZO':  'AutoZone',
    'ORLY': "O'Reilly Auto Parts",
    'ULTA': 'Ulta Beauty',
    'TPR':  'Tapestry, Inc.',
    'RL':   'Ralph Lauren',
    'ANF':  'Abercrombie & Fitch',
    'LULU': 'Lululemon Athletica',
    'WSM':  'Williams-Sonoma',
    'M':    "Macy's",
    'KMX':  'CarMax',
    'CVNA': 'Carvana',
    'POOL': 'Pool Corporation',
    'DECK': 'Deckers Brands',
    'GPS':  'Gap Inc.',
    'PVH':  'PVH Corp.',
    'HBI':  'Hanesbrands',
    'VFC':  'VF Corporation',
    'LEVI': 'Levi Strauss & Co.',
    'UAA':  'Under Armour',
    'COLM': 'Columbia Sportswear',
    'NVR':  'NVR, Inc.',
    'RH':   'RH (company)',
    'FIVE': 'Five Below',
    'BJ':   "BJ's Wholesale Club",
    'DRVN': 'Driven Brands',
    'BURL': 'Burlington Stores',
    'ODP':  'The ODP Corporation',
    'GPC':  'Genuine Parts Company',
    'AAP':  'Advance Auto Parts',
    'SFM':  'Sprouts Farmers Market',
    'GO':   'Grocery Outlet',
    'CASY': "Casey's General Stores",

    // ── Finance, Banking & Insurance ──────────────────────────────────────────
    'BRK.B': 'Berkshire Hathaway',
    'SCHW':  'Charles Schwab Corporation',
    'BK':    'BNY Mellon',
    'STT':   'State Street Corporation',
    'BLK':   'BlackRock',
    'BX':    'Blackstone Inc.',
    'KKR':   'KKR & Co.',
    'APO':   'Apollo Global Management',
    'ARES':  'Ares Management',
    'PYPL':  'PayPal',
    'FIS':   'Fidelity National Information Services',
    'SPGI':  'S&P Global',
    'MCO':   "Moody's Corporation",
    'ICE':   'Intercontinental Exchange',
    'CME':   'CME Group',
    'NDAQ':  'Nasdaq, Inc.',
    'CBOE':  'Cboe Global Markets',
    'MSCI':  'MSCI Inc.',
    'TROW':  'T. Rowe Price',
    'AMP':   'Ameriprise Financial',
    'IVZ':   'Invesco',
    'BEN':   'Franklin Templeton',
    'RJF':   'Raymond James Financial',
    'IBKR':  'Interactive Brokers',
    'HOOD':  'Robinhood Markets',
    'COIN':  'Coinbase',
    'SYF':   'Synchrony Financial',
    'DFS':   'Discover Financial Services',
    'HBAN':  'Huntington Bancshares',
    'FITB':  'Fifth Third Bancorp',
    'MTB':   'M&T Bank',
    'RF':    'Regions Financial',
    'KEY':   'KeyCorp',
    'CFG':   'Citizens Financial Group',
    'NTRS':  'Northern Trust',
    'CPAY':  'Corpay',
    'FICO':  'FICO',
    'BR':    'Broadridge Financial Solutions',
    'VRSK':  'Verisk Analytics',
    'EFX':   'Equifax',
    'TRU':   'TransUnion',
    'DNB':   'Dun & Bradstreet',
    'AJG':   'Arthur J. Gallagher & Co.',
    'WTW':   'WTW (company)',
    'AON':   'Aon plc',
    'MMC':   'Marsh McLennan',
    'SNEX':  'StoneX Group',
    'MET':   'MetLife',
    'PRU':   'Prudential Financial',
    'AFL':   'Aflac',
    'ALL':   'Allstate',
    'PGR':   'Progressive Corporation',
    'TRV':   'The Travelers Companies',
    'HIG':   'The Hartford',
    'CB':    'Chubb Limited',
    'AIG':   'American International Group',
    'L':     'Loews Corporation',
    'ACGL':  'Arch Capital Group',
    'EG':    'Everest Group',
    'WRB':   'W. R. Berkley Corporation',
    'CINF':  'Cincinnati Financial',
    'AIZ':   'Assurant',
    'GL':    'Globe Life',
    'ERIE':  'Erie Indemnity',
    'PFG':   'Principal Financial Group',
    'BRO':   'Brown & Brown',
    'RLI':   'RLI Corp',
    'HUM':   'Humana',
    'CNC':   'Centene Corporation',
    'MOH':   'Molina Healthcare',
    'UHS':   'Universal Health Services',
    'ZION':  'Zions Bancorporation',
    'BOKF':  'BOK Financial',
    'WAL':   'Western Alliance Bancorporation',
    'PNFP':  'Pinnacle Financial Partners',
    'WTFC':  'Wintrust Financial',
    'TCBI':  'Texas Capital Bancshares',
    'SLM':   'SLM Corporation',
    'NAVI':  'Navient',
    'LPLA':  'LPL Financial',
    'RKT':   'Rocket Companies',
    'PFSI':  'PennyMac Financial Services',
    'UWMC':  'United Wholesale Mortgage',
    'AL':    'Air Lease Corporation',
    'AFG':   'American Financial Group',
    'MKL':   'Markel Group',
    'RNR':   'RenaissanceRe',
    'KNSL':  'Kinsale Capital Group',
    'PLMR':  'Palomar Holdings',
    'SIGI':  'Selective Insurance',
    'KMPR':  'Kemper Corporation',
    'FFIN':  'First Financial Bankshares',
    'IBOC':  'International Bancshares Corporation',
    'BANR':  'Banner Bank',
    'CBSH':  'Commerce Bancshares',
    'CVBF':  'CVB Financial',
    'WABC':  'Westamerica Bancorporation',
    'WSFS':  'WSFS Financial',
    'UMBF':  'UMB Financial Corporation',
    'FCF':   'First Commonwealth Financial',
    'NBTB':  'NBT Bancorp',
    'SBCF':  'Seacoast Banking Corporation of Florida',
    'SFNC':  'Simmons First National Corporation',
    'HBNC':  'Horizon Bancal',
    'RNST':  'Renasant Corporation',
    'GABC':  'German American Bancorp',
    'FFBC':  'First Financial Bancorp',
    'CCNE':  'CNB Financial',
    'AROW':  'Arrow Financial Corporation',
    'CHMG':  'Chemung Financial',
    'ESNT':  'Essent Group',

    // ── Energy ────────────────────────────────────────────────────────────────
    'COP':   'ConocoPhillips',
    'PSX':   'Phillips 66',
    'MPC':   'Marathon Petroleum',
    'VLO':   'Valero Energy',
    'OXY':   'Occidental Petroleum',
    'EOG':   'EOG Resources',
    'SLB':   'Schlumberger',
    'HAL':   'Halliburton',
    'BKR':   'Baker Hughes',
    'DVN':   'Devon Energy',
    'FANG':  'Diamondback Energy',
    'HES':   'Hess Corporation',
    'APA':   'APA Corporation',
    'ET':    'Energy Transfer',
    'EPD':   'Enterprise Products Partners',
    'KMI':   'Kinder Morgan',
    'WMB':   'Williams Companies',
    'OKE':   'ONEOK',
    'TRGP':  'Targa Resources',
    'LNG':   'Cheniere Energy',
    'EQT':   'EQT Corporation',
    'CTRA':  'Coterra Energy',
    'EXE':   'Expand Energy',
    'TPL':   'Texas Pacific Land Corporation',
    'PAA':   'Plains All American Pipeline',
    'CRC':   'California Resources Corporation',
    'RRC':   'Range Resources',
    'CNX':   'CNX Resources',
    'OVV':   'Ovintiv',
    'PR':    'Permian Resources',
    'MTDR':  'Matador Resources',
    'PBF':   'PBF Energy',
    'DINO':  'HF Sinclair',
    'MPLX':  'MPLX',
    'WES':   'Western Midstream Partners',
    'CQP':   'Cheniere Energy Partners',
    'SM':    'SM Energy',
    'AROC':  'Archrock',
    'NGL':   'NGL Energy Partners',
    'HESM':  'Hess Midstream',
    'WTTR':  'Select Water Solutions',
    'BATL':  'Battalion Oil',
    'TALO':  'Talos Energy',
    'MGY':   'Magnolia Oil & Gas',

    // ── Utilities ─────────────────────────────────────────────────────────────
    'NEE':   'NextEra Energy',
    'SO':    'Southern Company',
    'EXC':   'Exelon',
    'AEP':   'American Electric Power',
    'SRE':   'Sempra',
    'PCG':   "PG&E Corporation",
    'ED':    'Consolidated Edison',
    'XEL':   'Xcel Energy',
    'ES':    'Eversource Energy',
    'AWK':   'American Water Works',
    'PPL':   'PPL Corporation',
    'EIX':   'Edison International',
    'CMS':   'CMS Energy',
    'NI':    'NiSource',
    'CNP':   'CenterPoint Energy',
    'AEE':   'Ameren',
    'ETR':   'Entergy',
    'DTE':   'DTE Energy',
    'FE':    'FirstEnergy',
    'PEG':   'Public Service Enterprise Group',
    'NRG':   'NRG Energy',
    'VST':   'Vistra Corp.',
    'CEG':   'Constellation Energy',
    'FSLR':  'First Solar',
    'EVRG':  'Evergy',
    'PNW':   'Pinnacle West Capital',
    'ATO':   'Atmos Energy',
    'AES':   'The AES Corporation',
    'OGE':   'OGE Energy',
    'NWE':   'NorthWestern Energy',
    'OTTR':  'Otter Tail Corporation',
    'SWX':   'Southwest Gas',
    'NWN':   'Northwest Natural',
    'CWT':   'California Water Service Group',
    'MSEX':  'Middlesex Water Company',
    'ENPH':  'Enphase Energy',
    'SEDG':  'SolarEdge Technologies',
    'PLUG':  'Plug Power',
    'AMRC':  'Ameresco',
    'CWEN':  'Clearway Energy',

    // ── Telecom, Media & Entertainment ────────────────────────────────────────
    'VZ':    'Verizon',
    'CHTR':  'Charter Communications',
    'WBD':   'Warner Bros. Discovery',
    'FOXA':  'Fox Corporation',
    'FOX':   'Fox Corporation',
    'NYT':   'The New York Times Company',
    'LYV':   'Live Nation Entertainment',
    'EA':    'Electronic Arts',
    'TTWO':  'Take-Two Interactive',
    'RBLX':  'Roblox Corporation',
    'SPOT':  'Spotify',
    'SIRI':  'Sirius XM',
    'OMC':   'Omnicom Group',
    'TTD':   'The Trade Desk',
    'TKO':   'TKO Group Holdings',
    'NWS':   'News Corp',
    'NWSA':  'News Corp',
    'IAC':   'IAC Inc.',
    'MTCH':  'Match Group',
    'BMBL':  'Bumble Inc.',
    'ROKU':  'Roku, Inc.',
    'NXST':  'Nexstar Media Group',
    'GTN':   'Gray Television',
    'SSP':   'The E.W. Scripps Company',
    'SBGI':  'Sinclair Broadcast Group',
    'TGNA':  'Tegna Inc.',
    'MSGS':  'Madison Square Garden Sports',
    'MSGE':  'Madison Square Garden Entertainment',
    'AMCX':  'AMC Networks',
    'CABO':  'Cable One',
    'LUMN':  'Lumen Technologies',
    'CCOI':  'Cogent Communications',
    'FUBO':  'Fubotv',

    // ── Transportation & Logistics ────────────────────────────────────────────
    'UPS':   'United Parcel Service',
    'JBLU':  'JetBlue',
    'SKYW':  'SkyWest Airlines',
    'UNP':   'Union Pacific Railroad',
    'CSX':   'CSX Corporation',
    'NSC':   'Norfolk Southern',
    'WAB':   'Wabtec',
    'CHRW':  'C.H. Robinson',
    'EXPD':  'Expeditors International',
    'XPO':   'XPO Inc.',
    'ODFL':  'Old Dominion Freight Line',
    'JBHT':  'J.B. Hunt Transport Services',
    'SAIA':  'Saia Inc.',
    'R':     'Ryder System',
    'DASH':  'DoorDash',
    'GXO':   'GXO Logistics',
    'RXO':   'RXO Inc.',
    'MATX':  'Matson, Inc.',
    'KEX':   'Kirby Corporation',
    'ARCB':  'ArcBest',
    'KNX':   'Knight-Swift Transportation',
    'LSTR':  'Landstar System',
    'HTLD':  'Heartland Express',
    'MRTN':  'Marten Transport',

    // ── Automotive ────────────────────────────────────────────────────────────
    'AN':    'AutoNation',
    'PAG':   'Penske Automotive Group',
    'LAD':   'Lithia Motors',
    'ABG':   'Asbury Automotive Group',
    'GPI':   'Group 1 Automotive',
    'SAH':   'Sonic Automotive',
    'APTV':  'Aptiv',
    'LEA':   'Lear Corporation',
    'BWA':   'BorgWarner',
    'DAN':   'Dana Incorporated',
    'LCID':  'Lucid Motors',
    'RIVN':  'Rivian',
    'PCAR':  'PACCAR',
    'ALSN':  'Allison Transmission',
    'WGO':   'Winnebago Industries',
    'THO':   'Thor Industries',
    'STLA':  'Stellantis',
    'HMC':   'Honda',
    'VWAGY': 'Volkswagen Group',
    'BMWYY': 'BMW',
    'MBGYY': 'Mercedes-Benz Group',
    'FOXF':  'Fox Factory',

    // ── Food, Beverage & Restaurants ──────────────────────────────────────────
    'YUM':   'Yum! Brands',
    'QSR':   'Restaurant Brands International',
    'DPZ':   "Domino's Pizza",
    'CMG':   'Chipotle Mexican Grill',
    'EAT':   'Brinker International',
    'TXRH':  'Texas Roadhouse',
    'JACK':  'Jack in the Box',
    'RRGB':  'Red Robin',
    'CAKE':  'The Cheesecake Factory',
    'SHAK':  'Shake Shack',
    'CAVA':  'Cava Group',
    'WING':  'Wingstop',
    'CBRL':  'Cracker Barrel',
    'PLAY':  "Dave & Buster's",
    'TSN':   'Tyson Foods',
    'ADM':   'Archer-Daniels-Midland',
    'BG':    'Bunge Limited',
    'SYY':   'Sysco',
    'PFGC':  'Performance Food Group',
    'USFD':  'US Foods',
    'CAG':   'Conagra Brands',
    'CPB':   'Campbell Soup Company',
    'SJM':   'J.M. Smucker',
    'MKC':   'McCormick & Company',
    'HSY':   'The Hershey Company',
    'MDLZ':  'Mondelez International',
    'STZ':   'Constellation Brands',
    'TAP':   'Molson Coors Beverage Company',
    'SAM':   'Boston Beer Company',
    'MNST':  'Monster Beverage',
    'KDP':   'Keurig Dr Pepper',
    'CELH':  'Celsius Holdings',
    'KHC':   'The Kraft Heinz Company',
    'LW':    'Lamb Weston',
    'CALM':  'Cal-Maine Foods',
    'NATH':  "Nathan's Famous",
    'UNFI':  'United Natural Foods',
    'CHEF':  "The Chefs' Warehouse",
    'VITL':  'Vital Farms',
    'DEO':   'Diageo',
    'BUD':   'Anheuser-Busch InBev',
    'BF.B':  'Brown-Forman',

    // ── Consumer Goods & Household ────────────────────────────────────────────
    'PG':    'Procter & Gamble',
    'CL':    'Colgate-Palmolive',
    'KMB':   'Kimberly-Clark',
    'CHD':   'Church & Dwight',
    'EL':    "Estée Lauder Companies",
    'CLX':   'Clorox',
    'KVUE':  'Kenvue',
    'COTY':  'Coty Inc.',
    'IFF':   'International Flavors & Fragrances',
    'HAS':   'Hasbro',
    'MAT':   'Mattel',
    'ACCO':  'ACCO Brands',
    'ENR':   'Energizer Holdings',
    'SPB':   'Spectrum Brands',
    'NWL':   'Newell Brands',
    'CENT':  'Central Garden and Pet',
    'HBB':   'Hamilton Beach Brands',
    'MHK':   'Mohawk Industries',
    'WSO':   'Watsco',
    'SMP':   'Standard Motor Products',
    'DORM':  'Dorman Products',
    'PTON':  'Peloton Interactive',
    'YETI':  'YETI Holdings',

    // ── Industrials & Manufacturing ───────────────────────────────────────────
    'GE':    'GE Aerospace',
    'GEV':   'GE Vernova',
    'MMM':   '3M',
    'CAT':   'Caterpillar Inc.',
    'DE':    'John Deere',
    'EMR':   'Emerson Electric',
    'ITW':   'Illinois Tool Works',
    'DOV':   'Dover Corporation',
    'AME':   'AMETEK',
    'FTV':   'Fortive',
    'IR':    'Ingersoll Rand',
    'TT':    'Trane Technologies',
    'CARR':  'Carrier Global',
    'OTIS':  'Otis Worldwide',
    'JCI':   'Johnson Controls',
    'LII':   'Lennox International',
    'SWK':   'Stanley Black & Decker',
    'PNR':   'Pentair',
    'FAST':  'Fastenal',
    'GWW':   'W.W. Grainger',
    'MSM':   'MSC Industrial Direct',
    'AOS':   'A. O. Smith',
    'FIX':   'Comfort Systems USA',
    'NDSN':  'Nordson Corporation',
    'IEX':   'IDEX Corporation',
    'LECO':  'Lincoln Electric',
    'WMS':   'Advanced Drainage Systems',
    'GT':    'Goodyear Tire and Rubber Company',
    'MOD':   'Modine Manufacturing',
    'AXON':  'Axon Enterprise',
    'CTAS':  'Cintas',
    'ROL':   'Rollins, Inc.',
    'URI':   'United Rentals',
    'WSC':   'WillScot Mobile Mini',
    'FLR':   'Fluor Corporation',
    'PRIM':  'Primoris Services',
    'DY':    'Dycom Industries',
    'AGCO':  'AGCO',
    'CNH':   'CNH Industrial',
    'CNHI':  'CNH Industrial',       // Euronext ticker for same company as CNH (NYSE ADR)
    'DK':    'Delek US',             // Delek US Holdings (parent; DKL is the MLP subsidiary)
    'CBTX':  'Stellar Bank',         // CommunityBank of Texas merged into Stellar Bank 2022
    'GNRC':  'Generac Holdings',
    'HUBB':  'Hubbell Incorporated',
    'JBL':   'Jabil',
    'IIPR':  'Innovative Industrial Properties',
    'HY':    'Hyster-Yale Group',
    'TKR':   'The Timken Company',
    'ATI':   'ATI Inc.',
    'CRS':   'Carpenter Technology',
    'KALU':  'Kaiser Aluminum',
    'APOG':  'Apogee Enterprises',
    'ASTE':  'Astec Industries',
    'FELE':  'Franklin Electric',
    'GTLS':  'Chart Industries',
    'HLIO':  'Helios Technologies',
    'POWL':  'Powell Industries',
    'SPXC':  'SPX Technologies',
    'GFF':   'Griffon Corporation',
    'KAI':   'Kadant',
    'MGRC':  'McGrath RentCorp',
    'RUSHA': 'Rush Enterprises',
    'LCII':  'LCI Industries',
    'ESAB':  'ESAB Corporation',
    'GTES':  'Gates Industrial Corporation',
    'TNC':   'Tennant Company',
    'FWRD':  'Forward Air',
    'ZBRA':  'Zebra Technologies',

    // ── Construction & Building Materials ─────────────────────────────────────
    'MLM':   'Martin Marietta Materials',
    'VMC':   'Vulcan Materials Company',
    'CRH':   'CRH plc',
    'BLDR':  'Builders FirstSource',
    'MHO':   'M/I Homes',
    'DHI':   'D.R. Horton',
    'LEN':   'Lennar',
    'PHM':   'PulteGroup',
    'IBP':   'Installed Building Products',
    'EXP':   'Eagle Materials',
    'CVCO':  'Cavco Industries',
    'SKY':   'Skyline Champion Corporation',
    'UFPI':  'UFP Industries',
    'PATK':  'Patrick Industries',
    'NX':    'Quanex Building Products',

    // ── Metals, Mining & Chemicals ────────────────────────────────────────────
    'NUE':   'Nucor',
    'STLD':  'Steel Dynamics',
    'CLF':   'Cleveland-Cliffs',
    'AA':    'Alcoa',
    'CENX':  'Century Aluminum',
    'FCX':   'Freeport-McMoRan',
    'RS':    'Reliance, Inc.',
    'CMC':   'Commercial Metals Company',
    'NEM':   'Newmont',
    'GOLD':  'Barrick Gold',
    'SCCO':  'Southern Copper',
    'MP':    'MP Materials',
    'IP':    'International Paper',
    'SEE':   'Sealed Air',
    'BALL':  'Ball Corporation',
    'ATR':   'AptarGroup',
    'SLGN':  'Silgan Holdings',
    'SON':   'Sonoco Products',
    'GPK':   'Graphic Packaging',
    'SW':    'Smurfit WestRock',
    'WY':    'Weyerhaeuser',
    'RYN':   'Rayonier',
    'LIN':   'Linde plc',
    'APD':   'Air Products and Chemicals',
    'ECL':   'Ecolab',
    'SHW':   'Sherwin-Williams',
    'RPM':   'RPM International',
    'ALB':   'Albemarle Corporation',
    'CE':    'Celanese',
    'HUN':   'Huntsman Corporation',
    'LYB':   'LyondellBasell',
    'CTVA':  'Corteva',
    'FMC':   'FMC Corporation',
    'CF':    'CF Industries',
    'MOS':   'Mosaic Company',
    'EMN':   'Eastman Chemical Company',
    'ASH':   'Ashland Inc.',
    'TROX':  'Tronox',
    'KWR':   'Quaker Houghton',
    'TREX':  'Trex Company',
    'FUL':   'H.B. Fuller',
    'CBT':   'Cabot Corporation',
    'NEU':   'NewMarket Corporation',
    'RIO':   'Rio Tinto',
    'BHP':   'BHP',
    'VALE':  'Vale S.A.',
    'MT':    'ArcelorMittal',
    'PKX':   'POSCO Holdings',
    'HTHIY': 'Hitachi',
    'AEM':   'Agnico Eagle Mines',
    'KGC':   'Kinross Gold',
    'SQM':   'Sociedad Química y Minera',
    'NTR':   'Nutrien',
    'MEOH':  'Methanex',
    'LAC':   'Lithium Americas',

    // ── Real Estate & REITs ───────────────────────────────────────────────────
    'PLD':   'Prologis',
    'AMT':   'American Tower',
    'CCI':   'Crown Castle',
    'EQIX':  'Equinix',
    'SPG':   'Simon Property Group',
    'DLR':   'Digital Realty',
    'PSA':   'Public Storage',
    'EXR':   'Extra Space Storage',
    'AVB':   'AvalonBay Communities',
    'EQR':   'Equity Residential',
    'MAA':   'Mid-America Apartment Communities',
    'O':     'Realty Income',
    'VICI':  'VICI Properties',
    'VTR':   'Ventas',
    'SBAC':  'SBA Communications',
    'INVH':  'Invitation Homes',
    'AMH':   'American Homes 4 Rent',
    'IRM':   'Iron Mountain',
    'CBRE':  'CBRE Group',
    'KIM':   'Kimco Realty',
    'REG':   'Regency Centers',
    'FRT':   'Federal Realty Investment Trust',
    'NNN':   'NNN REIT',
    'ADC':   'Agree Realty',
    'BXP':   'BXP Inc.',
    'ARE':   'Alexandria Real Estate Equities',
    'CPT':   'Camden Property Trust',
    'UDR':   'UDR, Inc.',
    'ESS':   'Essex Property Trust',
    'LXP':   'LXP Industrial Trust',
    'COLD':  'Americold Realty Trust',
    'NSA':   'National Storage Affiliates',
    'CUBE':  'CubeSmart',
    'TRNO':  'Terreno Realty',
    'REXR':  'Rexford Industrial Realty',
    'EGP':   'EastGroup Properties',
    'STAG':  'STAG Industrial',
    'SVC':   'Service Properties Trust',
    'APLE':  'Apple Hospitality REIT',
    'OHI':   'Omega Healthcare Investors',
    'SBRA':  'Sabra Health Care REIT',
    'CIGI':  'Colliers International',
    'YELP':  'Yelp',
    'ANGI':  'Angi Inc.',
    'CARS':  'Cars.com',
    'CARG':  'CarGurus',
    'OPEN':  'Opendoor Technologies',
    'COMP':  'Compass, Inc.',
    'RMAX':  'RE/MAX',
    'RDN':   'Radian Group',
    'NMIH':  'NMI Holdings',
    'MTG':   'MGIC Investment',

    // ── HR, Staffing & Business Services ─────────────────────────────────────
    'PAYX':  'Paychex',
    'PAYC':  'Paycom',
    'MAN':   'ManpowerGroup',
    'RHI':   'Robert Half International',
    'KFRC':  'Kforce',
    'KELYA': 'Kelly Services',
    'WU':    'Western Union',
    'CPRT':  'Copart',
    'CSGP':  'CoStar Group',
    'IT':    'Gartner',
    'JKHY':  'Jack Henry & Associates',
    'VRSN':  'VeriSign',
    'MANH':  'Manhattan Associates',
    'PCTY':  'Paylocity',

    // ── Technology (top-1000 specific) ────────────────────────────────────────
    'CTSH':  'Cognizant',
    'HPE':   'Hewlett Packard Enterprise',
    'CDW':   'CDW Corporation',
    'MCHP':  'Microchip Technology',
    'ON':    'Onsemi',
    'SWKS':  'Skyworks Solutions',
    'QRVO':  'Qorvo',
    'PTC':   'PTC Inc.',
    'EPAM':  'EPAM Systems',
    'AKAM':  'Akamai Technologies',
    'FFIV':  'F5, Inc.',
    'GEN':   'Gen Digital',
    'SMCI':  'Super Micro Computer',
    'TWLO':  'Twilio',
    'WK':    'Workiva',
    'HUBS':  'HubSpot',
    'MKTX':  'MarketAxess',
    'CVLT':  'Commvault',
    'EXTR':  'Extreme Networks',
    'VIAV':  'Viavi Solutions',
    'CALX':  'Calix Inc.',
    'IRDM':  'Iridium Communications',
    'DOMO':  'Domo, Inc.',
    'FRSH':  'Freshworks',
    'TTEC':  'TTEC Holdings',
    'CEVA':  'CEVA Inc.',
    'FORM':  'FormFactor',
    'ACLS':  'Axcelis Technologies',
    'UCTT':  'Ultra Clean Holdings',
    'ICHR':  'Ichor Holdings',
    'AZTA':  'Azenta',
    'ONTO':  'Onto Innovation',
    'MKSI':  'MKS Instruments',
    'WOLF':  'Wolfspeed',
    'LSCC':  'Lattice Semiconductor',
    'SITM':  'SiTime',
    'AMBA':  'Ambarella',
    'COHU':  'Cohu',
    'DIOD':  'Diodes Incorporated',
    'MTSI':  'MACOM Technology Solutions',
    'POWI':  'Power Integrations',
    'SLAB':  'Silicon Laboratories',
    'SMTC':  'Semtech',
    'ANSS':  'Ansys',
    'ALTR':  'Altair Engineering',
    'JNPR':  'Juniper Networks',
    'NABL':  'N-able',

    // ── Healthcare Services & Med-Tech (top-1000 specific) ────────────────────
    'DVA':   'DaVita',
    'LH':    'Labcorp',
    'DGX':   'Quest Diagnostics',
    'RVTY':  'Revvity',
    'HSIC':  'Henry Schein',
    'CRL':   'Charles River Laboratories',
    'SOLV':  'Solventum',
    'VTRS':  'Viatris',
    'BAX':   'Baxter International',
    'ZBH':   'Zimmer Biomet',
    'COO':   'Cooper Companies',
    'ALGN':  'Align Technology',
    'PODD':  'Insulet Corporation',
    'WST':   'West Pharmaceutical Services',
    'MRNA':  'Moderna',
    'TECH':  'Bio-Techne',
    'ENSG':  'Ensign Group',
    'ADUS':  'Addus HomeCare',
    'NVCR':  'NovaCure',
    'TNDM':  'Tandem Diabetes Care',
    'GKOS':  'Glaukos',
    'IART':  'Integra LifeSciences',
    'OMCL':  'Omnicell',
    'NVST':  'Envista Holdings',
    'ITGR':  'Integer Holdings',
    'TFX':   'Teleflex',
    'PDCO':  'Patterson Companies',
    'PNTG':  'Pennant Group',
    'ACHC':  'Acadia Healthcare',
    'SGRY':  'Surgery Partners',
    'HIMS':  'Hims & Hers Health',
    'MMSI':  'Merit Medical Systems',
    'IONS':  'Ionis Pharmaceuticals',
    'SRPT':  'Sarepta Therapeutics',
    'RARE':  'Ultragenyx Pharmaceutical',
    'ACAD':  'ACADIA Pharmaceuticals',
    'APLS':  'Apellis Pharmaceuticals',
    'FRPT':  'Freshpet',

    // ── Hospitality, Travel & Gaming ──────────────────────────────────────────
    'HLT':   'Hilton Worldwide',
    'WH':    'Wyndham Hotels & Resorts',
    'CHH':   'Choice Hotels',
    'BKNG':  'Booking Holdings',
    'EXPE':  'Expedia Group',
    'ABNB':  'Airbnb',
    'CCL':   'Carnival Corporation',
    'RCL':   'Royal Caribbean Group',
    'MGM':   'MGM Resorts International',
    'CZR':   'Caesars Entertainment',
    'LVS':   'Las Vegas Sands',
    'WYNN':  'Wynn Resorts',
    'BYD':   'Boyd Gaming',
    'PENN':  'PENN Entertainment',
    'DKNG':  'DraftKings',
    'FLUT':  'Flutter Entertainment',
    'FUN':   'Cedar Fair',
    'TNL':   'Travel + Leisure Co.',

    // ── Education ─────────────────────────────────────────────────────────────
    'CHGG':  'Chegg',
    'PRDO':  'Perdoceo Education',
    'LOPE':  'Grand Canyon University',
    'LAUR':  'Laureate Education',
    'ATGE':  'Adtalem Global Education',
    'COUR':  'Coursera',
    'DUOL':  'Duolingo',

    // ── Waste, Environment & Cannabis ────────────────────────────────────────
    'WM':    'Waste Management, Inc.',
    'RSG':   'Republic Services',
    'CLH':   'Clean Harbors',
    'CWST':  'Casella Waste Systems',
    'ECVT':  'Ecovyst',
    'GTBIF': 'Green Thumb Industries',
    'TCNNF': 'Trulieve Cannabis',

    // ── Tobacco ───────────────────────────────────────────────────────────────
    'MO':    'Altria',
    'PM':    'Philip Morris International',
    'BTI':   'British American Tobacco',
    'TPB':   'Turning Point Brands',

    // ── Alternative Asset Managers & BDCs ────────────────────────────────────
    'ARCC':  'Ares Capital Corporation',
    'OWL':   'Blue Owl Capital',
    'HLNE':  'Hamilton Lane',
    'STEP':  'StepStone Group',
    'MAIN':  'Main Street Capital',
    'HTGC':  'Hercules Capital',

    // ── Regional & Commercial Banks ───────────────────────────────────────────
    'CMA':   'Comerica',
    'ZION':  'Zions Bancorporation',

    // ── Still-active companies with API lookup issues ──────────────────────
    'ALK':   'Alaska Airlines',
    'TT':    'Trane Technologies',
    'DENN':  "Denny's",
    'SEAS':  'SeaWorld Entertainment',
    'LGF.A': 'Lionsgate',
    'CORE':  'Core & Main',
    'DINE':  'Dine Brands Global',
    'SJW':   'SJW Group',
    'BIGC':  'BigCommerce',
    'AMEH':  'Apollo Medical Holdings',
    'ROLSY': 'Rolls-Royce Holdings',
    'CDAY':  'Dayforce HCM',
    'LANC':  'Lancaster Colony',
    'ROLL':  'RBC Bearings',
    'OMI':   'Owens & Minor',
    'VTRS':  'Viatris',
    'ZEUS':  'Olympic Steel',

    // ── Aerospace & Aviation ──────────────────────────────────────────────────
    'JOBY':  'Joby Aviation',
    'ACHR':  'Archer Aviation',
    'AL':    'Air Lease Corporation',
    'AER':   'AerCap',

    // ── Tickers that need explicit title to resolve on Wikipedia ─────────────
    'EOG':   'EOG Resources',
    'PAG':   'Penske Automotive Group',
    'CAKE':  'The Cheesecake Factory',
    'CAVA':  'Cava Group',
    'VTRS':  'Viatris',          // overrides earlier entry; ensures symbol lookup wins
    'CNHI':  'CNH Industrial',   // Euronext ticker, same company as CNH
    'PARA':  'Paramount Global',
    'PACW':  'PacWest Bancorp',
    'BIG':   'Big Lots',
    'OSTK':  'Overstock.com',    // now Beyond Inc / BYON
    'DK':    'Delek US',
    'ARES':  'Ares Management',
    // Fix 1 additions — disambiguate generic names that Wikipedia gets wrong
    'BOX':   'Box (company)',
    'DBX':   'Dropbox',
    'LULU':  'Lululemon Athletica',
    'DKS':   "Dick's Sporting Goods",
    'BBWI':  'Bath & Body Works',
    'SCI':   'Service Corporation International',
    'TFC':   'Truist Financial',
    'ORI':   'Old Republic International',
    'GEF':   'Greif',
    'IDA':   'IDACORP',
    'BKH':   'Black Hills Corporation',
    'RGLD':  'Royal Gold',
    'RBC':   'RBC Bearings',
    'REYN':  'Reynolds Consumer Products',
    'HELE':  'Helen of Troy Limited',
    'WDFC':  'WD-40 Company',
    'CHDN':  'Churchill Downs',
    'HGV':   'Hilton Grand Vacations',
    'BSM':   'Black Stone Minerals',
    'CQP':   'Cheniere Energy Partners',
    'HESM':  'Hess Midstream',
    'NOG':   'Northern Oil and Gas',
    'BLKB':  'Blackbaud',
    'CGNX':  'Cognex',
    'PLTK':  'Playtika',
    'SPOK':  'Spok Holdings',
    'AMN':   'AMN Healthcare',
    'CCRN':  'Cross Country Healthcare',
    'SXI':   'Standex International',
    'PLXS':  'Plexus Corp.',
    'TWIN':  'Twin Disc',
    'GOOD':  'Gladstone Commercial',
    'ARCC':  'Ares Capital',
    'WRLD':  'World Acceptance Corporation',
    'UBSI':  'United Bankshares',
    'BANF':  'BancFirst',
    'WASH':  'Washington Trust Bancorp',
    'INDB':  'Independent Bank Corp',
    'SNBR':  'Sleep Number',
    'OLLI':  "Ollie's Bargain Outlet",
    'GIII':  'G-III Apparel Group',
    'OXM':   'Oxford Industries',
    'CATO':  'Cato Corporation',
    'SHOO':  'Steve Madden',
    'BOOT':  'Boot Barn',
    'VSCO':  "Victoria's Secret & Co.",
    'TPG':   'TPG Inc.',
    'DXC':   'DXC Technology',
    'TDOC':  'Teladoc Health',
    'AVNS':  'Avanos Medical',
    'PRVA':  'Privia Health',
    'BJRI':  "BJ's Restaurants",
    'LWAY':  'Lifeway Foods',
    'NGVC':  'Natural Grocers by Vitamin Cottage',
    'PTLO':  "Portillo's",
    'ARTNA': 'Artesian Resources',
    'CWCO':  'Consolidated Water',
    'AMC':   'AMC Entertainment',
    'LKQ':   'LKQ Corporation',
    'EXPO':  'Exponent Inc.',
    'ANDE':  'Andersons Inc.',
    'GNK':   'Genco Shipping & Trading',
    'ULCC':  'Frontier Airlines',
    'ALGT':  'Allegiant Travel',
    'CURI':  'CuriosityStream',
    'ATOM':  'Atomera',
    'GLAD':  'Gladstone Capital',
    'ECPG':  'Encore Capital Group',
    'LOAN':  'Manhattan Bridge Capital',
    'SHFS':  'SHF Holdings',
    'GSHD':  'Goosehead Insurance',
    'UFCS':  'United Fire Group',
    'CBKM':  'Consumers Bancorp',
    'WLKP':  'Westlake Chemical Partners',
    'RGEN':  'Repligen',
    'IPI':   'Intrepid Potash',
    'FIGS':  'Figs Inc.',
    'BARK':  'Bark Inc.',
    'CRDO':  'Credo Technology',
    'AMSF':  'AMERISAFE',
    'PRCT':  'PROCEPT BioRobotics',
    'RXST':  'RxSight',
    'HCAT':  'Health Catalyst',
    'CNMD':  'Conmed',
    'BLFS':  'BioLife Solutions',
    'ATMU':  'Atmus Filtration Technologies',
    'FTCI':  'FTC Solar',
    'SPWR':  'SunPower',
    'SHLS':  'Shoals Technologies',
    'DKL':   'Delek Logistics Partners',
    'BRT':   'BRT Apartments',
    'NXRT':  'NexPoint Residential Trust',
    'PINE':  'Alpine Income Property Trust',
    'GTY':   'Getty Realty',
    'SHO':   'Sunstone Hotel Investors',
    'RLJ':   'RLJ Lodging Trust',
    'CLDT':  'Chatham Lodging Trust',
    'CTRE':  'CareTrust REIT',
    'UNIT':  'Uniti Group',
    'ALEX':  'Alexander & Baldwin',
    // Regression fixes — these broke in the name normalization update
    'PAYO':  'Payoneer',
    'RELY':  'Remitly',
    'DXLG':  'Destination XL Group',
    'AMWL':  'American Well',
    'HE':    'Hawaiian Electric Industries',
    'BLMN':  "Bloomin' Brands",
    'FIZZ':  'National Beverage Corp',
    'DOCS':  'Doximity',
    'VSTM':  'Verastem',
    'ARI':   'Apollo Commercial Real Estate Finance',
    'BBVA':  'BBVA',
    'HSBC':  'HSBC Holdings',
    'CRVL':  'CorVel',
    // Round 3 — persistent NO_EMPS + foreign companies
    'TPVG':  'TriplePoint Venture Growth BDC',
    'SLRC':  'SLR Investment Corp',
    'DKL':   'Delek Logistics Partners',
    'GOOD':  'Gladstone Commercial',
    'PINE':  'Alpine Income Property Trust',
    'RPT':   'Rithm Property Trust',
    'GLAD':  'Gladstone Capital',
    'WLKP':  'Westlake Chemical Partners',
    'DCOMP': 'Dime Community Bancshares',
    'CBKM':  'Consumers Bancorp',
    // Foreign companies — explicit titles avoid wrong-article disambiguation
    'CHKP':  'Check Point Software Technologies',
    'NICE':  'Nice Systems',
    'INMD':  'InMode',
    'GLBE':  'Global-E Online',
    'ICLR':  'ICON plc',
    'DAVA':  'Endava',
    'GOOS':  'Canada Goose',
    'GLOB':  'Globant',
    'SSYS':  'Stratasys',
    'ZIM':   'ZIM Integrated Shipping Services',
    'SRAD':  'Sportradar',
    'STNE':  'StoneCo',
    'DLO':   'dLocal',
    'NOMD':  'Nomad Foods',
    'CLBT':  'Cellebrite',
    'GFL':   'GFL Environmental',
    'CVE':   'Cenovus Energy',
    'TECK':  'Teck Resources',
    'BTG':   'B2Gold',
    'PAAS':  'Pan American Silver',
    'GFI':   'Gold Fields',
    'FNV':   'Franco-Nevada',
    'MANU':  'Manchester United',
    'MLCO':  'Melco Resorts & Entertainment',
    'MMYT':  'MakeMyTrip',
    'HTHT':  'H World Group',
    'PDD':   'PDD Holdings',
    'SE':    'Sea Limited',
    'GRAB':  'Grab Holdings',
    'NU':    'Nu Holdings',
    'DCBO':  'Docebo',
    'DSGX':  'Descartes Systems',
    'ASND':  'Ascendis Pharma',
    'LEGN':  'Legend Biotech',
    // Companies that frequently fail name-based Wikipedia lookup
    'NFLX':  'Netflix',
    'PARA':  'Paramount Global',
    'PFGC':  'Performance Food Group',
    'ENSG':  'Ensign Group',
    'CHKP':  'Check Point Software Technologies',
    'NICE':  'NICE Ltd.',
    'CYBR':  'CyberArk',
    'GLOB':  'Globant',
    'DAVA':  'Endava',
    'AZPN':  'Aspen Technology',
    'ARCO':  'Arcos Dorados',
    'GOOS':  'Canada Goose',
    'MNSO':  'MINISO',
    'NU':    'Nu Holdings',
    'PAGS':  'PagSeguro',
    'QFIN':  'Qifu Technology',
    'GLBE':  'Global-E Online',
    'WIT':   'Wipro',
    'LDI':   'loanDepot',
    'SQ':    'Block, Inc.',
    'TCEHY': 'Tencent',
    'BYDDY': 'BYD Company',
    'IBN':   'ICICI Bank',
    'NTDOY': 'Nintendo',
    'GELYF': 'Geely',
    'BRFS':  'BRF S.A.',
    'JBSAY': 'JBS S.A.',
};

// ── Wikidata ticker→Wikipedia article lookup ─────────────────────────────────
// Uses Wikidata SPARQL to map a stock ticker symbol directly to a Wikipedia title.
// Most reliable disambiguation — avoids Lord of the Rings, GPU articles, etc.
async function lookupWikidataTitle(tickerSymbol) {
    const query = `SELECT ?articleTitle WHERE {
  ?company wdt:P249 "${tickerSymbol.toUpperCase()}" .
  ?article schema:about ?company ;
           schema:isPartOf <https://en.wikipedia.org/> ;
           schema:name ?articleTitle .
} LIMIT 3`;
    const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(query) + '&format=json';
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/sparql-results+json',
            'User-Agent': 'YourFairShare/1.0 (admin@yourfairshare.com)'
        }
    });
    if (!res.ok) throw new Error('Wikidata SPARQL HTTP ' + res.status);
    const json = await res.json();
    const bindings = json?.results?.bindings || [];
    if (!bindings.length) throw new Error('Wikidata: no result for ticker ' + tickerSymbol);
    return bindings[0].articleTitle.value;
}

// ── Parse employee count from Wikipedia infobox wikitext ─────────────────────
// Handles: ~10,000 | circa 10,000 | c. 10,000 | 10,000 (2021) | 10,000–12,000
// {{increase}} 10,000 | {{formatnum:10000}} | 10 000 (European spacing)
function parseEmployeeCountFromWikitext(wikitext) {
    if (!wikitext) return null;
    const lines = wikitext.split('\n');
    const empLine = lines.find(l =>
        /\|\s*(?:num_employees|number_of_employees)\s*=/.test(l)
    );
    if (!empLine) return null;

    // Extract value after the = sign
    let cleaned = empLine.replace(/^\|\s*(?:num_employees|number_of_employees)\s*=\s*/, '');

    // Remove ref tags
    cleaned = cleaned.replace(/<ref[^>]*\/>/g, ' ');
    cleaned = cleaned.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, ' ');
    cleaned = cleaned.replace(/<[^>]+>/g, ' ');

    // Flatten known templates
    cleaned = cleaned.replace(/\{\{(?:increase|decrease|steady|profit|loss)[^}]*\}\}/gi, ' ');
    cleaned = cleaned.replace(/\{\{formatnum:\s*([\d,\s]+)\s*\}\}/gi, ' $1 ');
    cleaned = cleaned.replace(/\{\{(?:circa|c\.|approximately)[^|]*\|\s*([\d,\s]+)\s*\}\}/gi, ' $1 ');
    cleaned = cleaned.replace(/\{\{val\s*\|\s*([\d,\s]+)[^}]*\}\}/gi, ' $1 ');
    cleaned = cleaned.replace(/\{\{[^}]+\}\}/g, ' ');

    // Remove wikilinks
    cleaned = cleaned.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1');

    // Remove approximate prefixes and citation brackets
    cleaned = cleaned.replace(/[~≈]/g, '');
    cleaned = cleaned.replace(/\b(?:circa|c\.|approximately|approx\.?|about)\s*/gi, '');
    cleaned = cleaned.replace(/\[\w+\]/g, ' ');
    cleaned = cleaned.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

    // Handle ranges — return the midpoint
    const rangeMatch = cleaned.match(/([\d][\d,.\s]*[\d])\s*[–\-—]\s*([\d][\d,.\s]*[\d])/);
    if (rangeMatch) {
        const lo = parseInt(rangeMatch[1].replace(/[,.\s]/g, ''), 10);
        const hi = parseInt(rangeMatch[2].replace(/[,.\s]/g, ''), 10);
        if (!isNaN(lo) && !isNaN(hi) && hi > 100) return Math.round((lo + hi) / 2);
    }

    // Extract standalone numbers (including European-style "10 000")
    const numPattern = /\b(\d{1,3}(?:[,.\s]\d{3})+|\d{4,})\b/g;
    const candidates = [];
    let m;
    while ((m = numPattern.exec(cleaned)) !== null) {
        const raw = m[1].replace(/[,.\s]/g, '');
        const n = parseInt(raw, 10);
        if (!isNaN(n) && n > 100 && !(n >= 2010 && n <= 2030)) candidates.push(n);
    }

    // For tiny companies (REITs, royalty trusts) allow smaller numbers
    if (!candidates.length) {
        const smallMatch = cleaned.match(/\b(\d{2,3})\b/);
        if (smallMatch) {
            const n = parseInt(smallMatch[1], 10);
            if (n >= 10 && !(n >= 20 && n <= 30)) candidates.push(n);
        }
    }

    if (!candidates.length) return null;
    return Math.max(...candidates);
}

// ── Fetch Wikipedia wikitext by page title (follows redirects) ────────────────
async function fetchWikitextByTitle(title) {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' +
        encodeURIComponent(title) + '&prop=revisions&rvprop=content&rvslots=main&format=json&redirects=1';
    const res = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'YourFairShare/1.0' }
    });
    if (!res.ok) throw new Error('Wikipedia page HTTP ' + res.status);
    const json = await res.json();
    const pages = json?.query?.pages || {};
    const page = Object.values(pages)[0];
    if (!page || page.missing === '') throw new Error('Wikipedia: page missing');
    const text = page?.revisions?.[0]?.slots?.main?.['*']
              || page?.revisions?.[0]?.['*'] || '';
    if (!text) throw new Error('Wikipedia: empty wikitext');
    // Manual redirect fallback (in case redirects=1 missed something)
    const redirectMatch = text.match(/^#(?:REDIRECT|redirect)\s*\[\[([^\]]+)\]\]/m);
    if (redirectMatch) {
        return fetchWikitextByTitle(redirectMatch[1].split('|')[0].trim());
    }
    return text;
}

async function fetchEmployeeCountFromWikipedia(companyName, knownTitle = null, tickerSymbol = null) {
    // Check WIKI_TITLE_MAP by uppercased name
    const upperName = companyName.toUpperCase().trim();
    if (!knownTitle) knownTitle = WIKI_TITLE_MAP[upperName] || null;

    // Normalise company name for search
    // Strip trailing state/exchange suffixes like /DE/ /MD/ or INC/WV
    const preStripped = companyName
        .replace(/\s*\/[A-Z]{2,}\/\s*$/, '')    // /DE/ style (both slashes)
        .replace(/\s+(inc|corp|co|ltd)\.?\s*\/[A-Z]{2,}\s*$/i, '') // INC/WV style
        .trim();
    const isAllCaps = preStripped === preStripped.toUpperCase() && /[A-Z]{3}/.test(preStripped);
    const normalizedName = isAllCaps
        // Title-case, then fix apostrophe: "Dick'S" -> "Dick's"
        ? preStripped.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                                   .replace(/(\w)'([A-Z])/g, (_, a, b) => a + "'" + b.toLowerCase())
        : preStripped;
    const cleanName = normalizedName
        // Strip legal suffixes — now includes LP, L.P., MLP
        .replace(/,?\s+(Inc\.?|Corp\.?|Ltd\.?|LLC|L\.L\.C\.?|L\.P\.?|\bLP\b|\bMLP\b|Co\.?|Holdings?|Holding|Corporation|Limited|plc|Incorporated|Companies)\s*$/i, '')
        .replace(/,\s*$/, '')
        .replace(/\s+/g, ' ').trim();
    // Fix title-case prepositions/articles: "Helen Of Troy" -> "Helen of Troy"
    const fixedCleanName = cleanName
        .replace(/\b(Of|And|The|In|At|By|For|Or|To|A|An)\b/g, w => w.toLowerCase())
        .replace(/^([a-z])/, c => c.toUpperCase());
    const firstWord = fixedCleanName.split(' ')[0];
    const firstTwo = fixedCleanName.split(' ').slice(0, 2).join(' ');

    const nameCandidates = [
        knownTitle,
        fixedCleanName,
        cleanName,
        companyName,
        fixedCleanName + ' Corporation', fixedCleanName + ' Company',
        fixedCleanName + ' Group', fixedCleanName + ' Inc.',
        firstTwo, firstTwo + ' Corporation',
        firstWord + ' Corporation', firstWord,
    ].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i);

    const blocklist = [
        'middle-earth', 'lord of the rings', 'tolkien', 'disambiguation',
        'film', 'novel', 'song', 'album', 'band', 'musician', 'athlete',
        'footballer', 'politician', 'character', 'fictional',
    ];
    const companySignals = [
        'company', 'corporation', 'conglomerate', 'manufacturer', 'aerospace',
        'defense', 'defence', 'founded', 'headquartered', 'multinational',
        'contractor', 'technologies', 'systems', 'industry', 'industries',
        'pharmaceutical', 'financial', 'services', 'holding', 'nasdaq', 'nyse',
        'listed', 'publicly traded', 'stock exchange', 'incorporated',
        'american', 'software', 'cloud', 'enterprise', 'revenue', 'employees',
        'subsidiary', 'acquisition', 'merger', 'ipo', 'shares', 'investors',
        'bank', 'insurance', 'reit', 'trust', 'energy', 'retail', 'healthcare',
        'biotech', 'startup', 'provider', 'platform', 'market cap',
    ];

    // Strategy A: Wikidata ticker lookup (authoritative disambiguation)
    async function strategyWikidata() {
        if (!tickerSymbol) throw new Error('No ticker for Wikidata lookup');
        const title = await lookupWikidataTitle(tickerSymbol);
        const text = await fetchWikitextByTitle(title);
        const count = parseEmployeeCountFromWikitext(text);
        if (!count) throw new Error('Wikidata path: employee count not found in ' + title);
        return count;
    }

    // Strategy B: Name-based fuzzy search
    async function strategyNameSearch() {
        // If we have a known title, try it directly first (no search needed)
        if (knownTitle) {
            try {
                const text = await fetchWikitextByTitle(knownTitle);
                const count = parseEmployeeCountFromWikitext(text);
                if (count) return count;
            } catch(e) { /* fall through to opensearch */ }
        }

        for (const query of nameCandidates) {
            if (!query || query.length < 2) continue;
            try {
                const searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                    encodeURIComponent(query) + '&limit=8&format=json';
                const searchRes = await fetch(searchUrl, {
                    headers: { 'Accept': 'application/json', 'User-Agent': 'YourFairShare/1.0' }
                });
                if (!searchRes.ok) continue;
                const searchJson = await searchRes.json();
                const titles = searchJson[1] || [];
                const descs = searchJson[2] || [];

                let match = titles.find(t => t.toLowerCase() === query.toLowerCase());
                if (!match) match = titles.find(t => t.toLowerCase() === fixedCleanName.toLowerCase());
                if (!match) match = titles.find((t, i) => {
                    const tl = t.toLowerCase(), dl = (descs[i] || '').toLowerCase();
                    return tl.includes(fixedCleanName.toLowerCase()) &&
                        !blocklist.some(b => tl.includes(b) || dl.includes(b)) &&
                        companySignals.some(s => dl.includes(s));
                });
                if (!match) match = titles.find(t =>
                    t.toLowerCase().startsWith(fixedCleanName.toLowerCase()) &&
                    !blocklist.some(b => t.toLowerCase().includes(b))
                );
                if (!match) match = titles.find((t, i) => {
                    const tl = t.toLowerCase(), dl = (descs[i] || '').toLowerCase();
                    return tl.includes(fixedCleanName.toLowerCase()) &&
                        !blocklist.some(b => tl.includes(b) || dl.includes(b));
                });
                if (!match) continue;

                const text = await fetchWikitextByTitle(match);
                const count = parseEmployeeCountFromWikitext(text);
                if (count) return count;
                // Page found but no emp count — keep trying other candidates
            } catch(e) { continue; }
        }
        throw new Error('Wikipedia: employee count not found for ' + companyName);
    }

    // Strategy: Wikidata first (authoritative), name search as fallback
    try {
        const count = await strategyWikidata();
        if (count) return count;
    } catch(e) {
        // Wikidata failed or returned no employee count — fall through to name search
    }

    return strategyNameSearch();
}



// Known name->ticker aliases to avoid fuzzy match failures
const TICKER_ALIASES = {
    'l3harris': 'LHX',
    'l3harris technologies': 'LHX',
    'l3': 'LHX',
    'raytheon': 'RTX',
    'raytheon technologies': 'RTX',
    'rtx corporation': 'RTX',
    'lockheed': 'LMT',
    'lockheed martin': 'LMT',
    'general dynamics': 'GD',
    'northrop': 'NOC',
    'northrop grumman': 'NOC',
    'boeing': 'BA',
    'honeywell': 'HON',
    'apple': 'AAPL',
    'microsoft': 'MSFT',
    'google': 'GOOGL',
    'alphabet': 'GOOGL',
    'amazon': 'AMZN',
    'meta': 'META',
    'facebook': 'META',
    'nvidia': 'NVDA',
    'tesla': 'TSLA',
    'ford': 'F',
    'general motors': 'GM',
    'walmart': 'WMT',
    'jpmorgan': 'JPM',
    'jp morgan': 'JPM',
    'goldman sachs': 'GS',
    'morgan stanley': 'MS',
    'bank of america': 'BAC',
    'wells fargo': 'WFC',
    'caterpillar': 'CAT',
    '3m': 'MMM',
    'ge': 'GE',
    'ge aerospace': 'GE',
    'john deere': 'DE',
    'deere': 'DE',
    'exxon': 'XOM',
    'exxonmobil': 'XOM',
    'chevron': 'CVX',
    'pfizer': 'PFE',
    'johnson and johnson': 'JNJ',
    'johnson & johnson': 'JNJ',
    'unitedhealth': 'UNH',
    'united health': 'UNH',
    'cvs': 'CVS',
    'cvs health': 'CVS',
    'ups': 'UPS',
    'fedex': 'FDX',
    'target': 'TGT',
    'home depot': 'HD',
    'costco': 'COST',
    'mcdonalds': 'MCD',
    "mcdonald's": 'MCD',
    'starbucks': 'SBUX',
    'disney': 'DIS',
    'netflix': 'NFLX',
    'palantir': 'PLTR',
    'lyft': 'LYFT',
    'uber': 'UBER',
    'airbnb': 'ABNB',
    'salesforce': 'CRM',
    'oracle': 'ORCL',
    'intel': 'INTC',
    'amd': 'AMD',
    'ibm': 'IBM',
    'att': 'T',
    'at&t': 'T',
    'verizon': 'VZ',
    'comcast': 'CMCSA',
    // International companies (OTC ADRs)
    'bae systems': 'BAESY',
    'leonardo': 'FINMY',
    'leonardo spa': 'FINMY',
    'leonardo s.p.a.': 'FINMY',
    'finmeccanica': 'FINMY',
    'thales': 'THLEF',
    'dassault': 'DUAVF',
    'saab': 'SAABF',
    'rheinmetall': 'RNMBY',
    'huntington ingalls industries': 'HII',
    'huntington ingalls': 'HII',
    'booz allen': 'BAH',
    'booz allen hamilton': 'BAH',
    'leidos': 'LDOS',
    'cae': 'CAE',
    'cae inc': 'CAE',
    'cae inc.': 'CAE',
    'amentum': 'AMTM',
    'v2x': 'VVX', 'v2x inc': 'VVX',
    'standardaero': 'SAX', 'standard aero': 'SAX',
    'parsons': 'PSN', 'parsons corporation': 'PSN',
    'mantech': 'MANT',
    'spirit aerosystems': 'SPR', 'spirit aero': 'SPR',
    'mercury systems': 'MRCY',
    'howmet': 'HWM', 'howmet aerospace': 'HWM',
    'heico': 'HEI',
    'bwx technologies': 'BWXT', 'bwx': 'BWXT',
    'kratos': 'KTOS', 'kratos defense': 'KTOS',
    'viasat': 'VSAT',
    'elbit': 'ESLT', 'elbit systems': 'ESLT',
    'safran': 'SAFRY',
    'dassault': 'DUAVF', 'dassault aviation': 'DUAVF',
    'babcock': 'BCIGY', 'babcock international': 'BCIGY',
    'qinetiq': 'QNTQF',
    'ttm technologies': 'TTMI',
    'keysight': 'KEYS', 'keysight technologies': 'KEYS',
    'teledyne': 'TDY', 'teledyne technologies': 'TDY',
    'moog': 'MOG.A',
    // Tech companies
    'nvidia': 'NVDA',
    'apple': 'AAPL',
    'microsoft': 'MSFT',
    'tsmc': 'TSM',
    'taiwan semiconductor': 'TSM',
    'broadcom': 'AVGO',
    'asml': 'ASML',
    'oracle': 'ORCL',
    'micron': 'MU',
    'micron technology': 'MU',
    'samsung': 'SSNLF',
    'amd': 'AMD',
    'advanced micro devices': 'AMD',
    'cisco': 'CSCO',
    'applied materials': 'AMAT',
    'lam research': 'LRCX',
    'salesforce': 'CRM',
    'kla': 'KLAC',
    'kla corporation': 'KLAC',
    'texas instruments': 'TXN',
    'shopify': 'SHOP',
    'arista networks': 'ANET',
    'analog devices': 'ADI',
    'qualcomm': 'QCOM',
    'palo alto networks': 'PANW',
    'palo alto': 'PANW',
    'accenture': 'ACN',
    'servicenow': 'NOW',
    'intuit': 'INTU',
    'sony': 'SONY',
    'arm holdings': 'ARM',
    'arm': 'ARM',
    'tokyo electron': 'TOELY',
    'adobe': 'ADBE',
    'corning': 'GLW',
    'crowdstrike': 'CRWD',
    'dell': 'DELL',
    'dell technologies': 'DELL',
    'western digital': 'WDC',
    'synopsys': 'SNPS',
    'cadence': 'CDNS',
    'cadence design': 'CDNS',
    'seagate': 'STX',
    'marvell': 'MRVL',
    'motorola solutions': 'MSI',
    'cloudflare': 'NET',
    'snowflake': 'SNOW',
    'fortinet': 'FTNT',
    'autodesk': 'ADSK',
    'te connectivity': 'TEL',
    'infineon': 'IFNNY',
    'infosys': 'INFY',
    'nxp': 'NXPI',
    'nxp semiconductors': 'NXPI',
    'garmin': 'GRMN',
    'nokia': 'NOK',
    'ericsson': 'ERIC',
    'datadog': 'DDOG',
    'workday': 'WDAY',
    'roper technologies': 'ROP',
    'teradyne': 'TER',
    'xiaomi': 'XIACY',
    // Healthcare
    'eli lilly': 'LLY', 'lilly': 'LLY',
    'johnson & johnson': 'JNJ', 'j&j': 'JNJ',
    'abbvie': 'ABBV',
    'merck': 'MRK',
    'unitedhealth': 'UNH', 'united health': 'UNH',
    'amgen': 'AMGN',
    'abbott': 'ABT', 'abbott laboratories': 'ABT',
    'thermo fisher': 'TMO', 'thermo fisher scientific': 'TMO',
    'gilead': 'GILD', 'gilead sciences': 'GILD',
    'intuitive surgical': 'ISRG',
    'pfizer': 'PFE',
    'stryker': 'SYK',
    'danaher': 'DHR',
    'bristol-myers squibb': 'BMY', 'bristol myers squibb': 'BMY',
    'hca healthcare': 'HCA',
    'vertex pharmaceuticals': 'VRTX', 'vertex': 'VRTX',
    'mckesson': 'MCK',
    'boston scientific': 'BSX',
    'cvs health': 'CVS', 'cvs': 'CVS',
    'regeneron': 'REGN',
    'cigna': 'CI',
    'cencora': 'COR',
    'elevance health': 'ELV',
    'becton dickinson': 'BDX',
    'zoetis': 'ZTS',
    'cardinal health': 'CAH',
    'idexx': 'IDXX', 'idexx laboratories': 'IDXX',
    'edwards lifesciences': 'EW',
    'resmed': 'RMD',
    'ge healthcare': 'GEHC',
    'agilent': 'A', 'agilent technologies': 'A',
    'veeva': 'VEEV', 'veeva systems': 'VEEV',
    'iqvia': 'IQV',
    'waters corporation': 'WAT',
    'natera': 'NTRA',
    'biogen': 'BIIB',
    'dexcom': 'DXCM',
    'royalty pharma': 'RPRX',
    'alnylam': 'ALNY',
    'beone medicines': 'ONC', 'beigene': 'ONC',
    'insmed': 'INSM',
    'roche': 'RHHBY',
    'novartis': 'NVS',
    'astrazeneca': 'AZN',
    'novo nordisk': 'NVO',
    'medtronic': 'MDT',
    'essilor': 'ESLOY', 'essilorluxottica': 'ESLOY',
    'gsk': 'GSK',
    'sanofi': 'SNY',
    'takeda': 'TAK',
    'argenx': 'ARGX',
    'csl limited': 'CSLLY', 'csl': 'CSLLY',
    'haleon': 'HLN',
    'teva': 'TEVA',
    'philips': 'PHG',
    'biontech': 'BNTX',
    'bayer': 'BAYRY',
    'merck kgaa': 'MKKGY',
    'siemens healthineers': 'SMMNY',
    'fresenius': 'FSNUY',
    'daiichi sankyo': 'DSNKY',
    'otsuka': 'OTSKY',
    'lonza': 'LZAGY',
    'galderma': 'GALDY',
    'astellas': 'ALPMY', 'astellas pharma': 'ALPMY',
    'sandoz': 'SDZNY',
    // Ambiguous tickers that need explicit aliases
    'gap': 'GPS', 'gap inc': 'GPS', 'the gap': 'GPS',
    'office depot': 'ODP', 'odp corporation': 'ODP', 'officemax': 'ODP',
    'berkshire hathaway': 'BRK.B', 'berkshire': 'BRK.B',
    'paramount': 'PARA', 'paramount global': 'PARA', 'cbs': 'PARA', 'viacom': 'PARA',
    'interpublic': 'IPG', 'interpublic group': 'IPG',
    'dun bradstreet': 'DNB', 'dun & bradstreet': 'DNB',
    "denny's": 'DENN', 'dennys': 'DENN',
    'overstock': 'OSTK', 'overstock.com': 'OSTK',
    'olympic steel': 'ZEUS',
    'haynes international': 'HAYN',
    'healthpeak': 'DOC', // renamed to Healthpeak Properties, ticker changed to DOC
    'ncr': 'VYX', // NCR split into NCR Atleos (NATL) and NCR Voyix (VYX)
    'howard hughes': 'HHC',
    'six flags': 'FUN', // merged with Cedar Fair, now just FUN
    'seaworld': 'SEAS',
    'spartan nash': 'SPTN', 'spartannash': 'SPTN',
    'sjw group': 'SJW',
    'mrc global': 'MRC',
    'lions gate': 'LGF.A', 'lionsgate': 'LGF.A',
    'sunnova': 'NOVA',
    'nextera energy partners': 'NEP',
    'cresco labs': 'CCHWF',
    'dine brands': 'DIN', 'ihop': 'DIN', "applebee's": 'DIN',
    'comerica': 'CMA',
    'synovus': 'SNV',
    'mr cooper': 'COOP', 'mr. cooper': 'COOP',
    'ceridian': 'CDAY',
    'olin corporation': 'OLN', 'olin corp': 'OLN',
    'ubiquiti': 'UI',
    'block': 'SQ', 'block inc': 'SQ', 'square': 'XYZ',
    'coreweave': 'CRWV',
    'ciena': 'CIEN',
    'lumentum': 'LITE',
    'foxconn': 'HNHPF', 'hon hai': 'HNHPF',
    'saic': 'SAIC',
    'science applications': 'SAIC',
    'textron': 'TXT',
    'transdigm': 'TDG',
    'curtiss wright': 'CW',
    'curtiss-wright': 'CW',
    'heico': 'HEI',
    'kbr': 'KBR',
    'caci': 'CACI',
    'mantech': 'MANT',
    'bae': 'BAESY',
    'shell': 'SHEL',
    'bp': 'BP',
    'toyota': 'TM',
    'samsung': 'SSNLF',
    'volkswagen': 'VWAGY',
    'siemens': 'SIEGY',
    'airbus': 'EADSY',
    'rolls royce': 'RYCEY',
    'rolls-royce': 'RYCEY',
    'tsmc': 'TSM',
    'alibaba': 'BABA',
    'sony': 'SONY',
    // Fix 2 additions — companies where name->ticker resolution needs help
    'block': 'XYZ',
    'block inc': 'XYZ',
    'square': 'XYZ',
    'cyberark': 'CYBR',
    'cyberark software': 'CYBR',
    'gen digital': 'GEN',
    'nortonlifelock': 'GEN',
    'cencora': 'COR',
    'amerisourcebergen': 'COR',
    'revvity': 'RVTY',
    'perkinelmer': 'RVTY',
    'origin bancorp': 'OBNK',
    'golub capital': 'GBDC',
    'blue owl capital': 'OWL',
    'owl rock capital': 'OWL',
    'championx': 'CHX',
    'suncoke energy': 'SXC',
    'renewable energy group': 'REGI',
    'dish': 'DISH',
    'dish network': 'DISH',
    'gannett': 'GCI',
    'mesa air': 'MESA',
    'shyft group': 'SHYF',
    'the shyft group': 'SHYF',
    'eagle bulk': 'EGLE',
    'eagle bulk shipping': 'EGLE',
    'summit materials': 'SUM',
    'totalenergies': 'TTE',
    'total energies': 'TTE',
    'icici bank': 'IBN',
    'astrazeneca': 'AZN',
    'meituan': 'MPNGY',
    'america movil': 'AMX',
    'américa móvil': 'AMX',
    'irobot': 'IRBT',
    'vizio': 'VZIO',
    'jbs': 'JBSAY',
    'brf': 'BRFS',
    'hibbett': 'HIBB',
    'hibbett sports': 'HIBB',
    'nordstrom': 'JWN',
    'skechers': 'SKX',
    'big 5 sporting goods': 'BGFV',
    'big5': 'BGFV',
    'express': 'EXPR',
    "francesca's": 'FRAN',
    "conn's": 'CONN',
    'tuesday morning': 'TUEM',
    'petiq': 'PETQ',
    'r1 rcm': 'RCM',
    'benchmark electronics': 'BEL',
    'icf international': 'ICFI',
    'medical properties trust': 'MPW',
    'primo brands': 'PRMB',
    'primo water': 'PRMB',
    'treehouse foods': 'THS',
    'everi holdings': 'EVRI',
    'everi': 'EVRI',
    'despegar': 'DESP',
    'scandinavian tobacco': 'SWMAY',
    'aphria': 'APHA',
    'ssr mining': 'SSRM',
    'ezcorp': 'EZPW',
    'composecure': 'CMPO',
    'faro technologies': 'FARO',
    'jamf': 'JAMF',
    'knowbe4': 'KNBE',
    'blueprint medicines': 'BPMC',
    'cymabay': 'CBAY',
    'dril-quip': 'DRQ',
    'drillquip': 'DRQ',
    'enerplus': 'ERF',
    'us silica': 'SLCA',
    'u.s. silica': 'SLCA',
    'solaris oilfield': 'SOI',
    'marathon oil': 'MRO',
    'pioneer natural resources': 'PXD',
    'potbelly': 'PBPB',
    'msg networks': 'MSGN',
    'california bancorp': 'CALB',
    'first bank': 'FRBA',
    'capstar financial': 'CSTR',
    'guaranty federal': 'GFED',
    'veritex': 'VBTX',
    'veritex community bank': 'VBTX',
    'american national bankshares': 'AMNB',
    'bryn mawr bank': 'BMTC',
    'lakeland bancorp': 'LBAI',
    'old line bancshares': 'OLBK',
    'united community banks': 'UCBI',
    'independent bank group': 'IBTX',
    'atlas air': 'AAWW',
    'air transport services': 'ATSG',
    'revance': 'RVNC',
    'revance therapeutics': 'RVNC',
    'athira pharma': 'ATHA',
    'blucora': 'BCOR',
    'infosys': 'INFY',
    'nintendo': 'NTDOY',
    'matterport': 'MTTR',
    'umpqua': 'UMPQ',
    'umpqua holdings': 'UMPQ',
    'lamar advertising': 'LAMR',
    'lamar': 'LAMR',
    // Round 2 additions
    'frontier communications': 'FYBR',
    'frontier': 'FYBR',
    'medical properties trust': 'MPW',
    'medical properties': 'MPW',
    'icf international': 'ICF',
    'icf': 'ICF',
    'icfi': 'ICFI',
    'benchmark electronics': 'BEL',
    'csw industrials': 'CSWI',
    'lincoln educational': 'LRFC',
    'tandy leather': 'TSC',
    'guess': 'GES',
    "guess?": 'GES',
    'luna innovations': 'LUNA',
    'capstar financial': 'CSTR',
    'capstar': 'CSTR',
    'guaranty federal bancshares': 'GFED',
    'guaranty federal': 'GFED',
    'veritex community bank': 'VBTX',
    'veritex': 'VBTX',
    'united community banks': 'UCBI',
    'golub capital': 'GBDC',
    'golub capital bdc': 'GBDC',
    'blue owl': 'OWL',
    'blue owl capital': 'OWL',
    'owl rock': 'OWL',
    'cushman wakefield': 'CWK',
    'cushman & wakefield': 'CWK',
    'tpi composites': 'TPIC',
    'corvel': 'CRVL',
    'akero therapeutics': 'AKRO',
    'chimerix': 'CMRX',
    'catalent': 'CTLT',
    '89bio': 'ETNB',
    'evelo biosciences': 'EVLO',
    'everbridge': 'EVBG',
    'aspen technology': 'AZPN',
    'aspentech': 'AZPN',
    'redfin': 'RDFN',
    'essa bancorp': 'ESSA',
    'triumph financial': 'TBK',
    'evans bancorp': 'EVBN',
    'first of long island': 'FLIC',
    'knowbe4': 'KNBE',
    'composecure': 'CMPO',
    'compoSecure': 'CMPO',
    'new york community bancorp': 'NYCB',
    'nycb': 'NYCB',
    'sumitomo mitsui': 'SMFG',
    'meituan': 'MEITUY',
    'america movil': 'AMX',
    'summit hotel properties': 'INN',
    'diamondrock': 'DRH',
    'diamondrock hospitality': 'DRH',
    'easterly government': 'DEA',
    'farmland partners': 'FPI',
    // Round 3 additions — persistent API_ERROR fixes
    'check point': 'CHKP',
    'checkpoint software': 'CHKP',
    'check point software': 'CHKP',
    'championx': 'CHX',
    'champion x': 'CHX',
    'everi': 'EVRI',
    'everi holdings': 'EVRI',
    'light wonder': 'LNW',
    'light & wonder': 'LNW',
    'scientific games': 'LNW',
    'cool company': 'CLCO',
    'golden ocean': 'GOGL',
    'golden ocean group': 'GOGL',
    'infinera': 'INFN',
    'treehouse foods': 'THS',
    'brf': 'BRFS',
    'brf sa': 'BRFS',
    'jbs': 'JBSAY',
    'glencore': 'GLNCY',
    'geely automobile': 'GELYF',
    'geely': 'GELYF',
    'byd': 'BYDDY',
    'byd company': 'BYDDY',
    'tencent': 'TCEHY',
    'tencent holdings': 'TCEHY',
    'marpai': 'MRAI',
    'northeast bank': 'NBN',
    'enstar group': 'ESGR',
    'ssr mining': 'SSRM',
    'william penn bancorporation': 'WMPN',
    'axonics': 'AXNX',
    'triumph group': 'TGI',
    'avid bioservices': 'CDMO',
    'cadence bank': 'CADE',
    'dynavax': 'DVAX',
    'dynavax technologies': 'DVAX',
    'enfusion': 'ENFN',
    'hingham institution': 'HIFS',
    'hingham savings': 'HIFS',
    'icad': 'ICAD',
    'petiq': 'PETQ',
    'companhia paranaense': 'ELP',
    'copel': 'ELP',
    'marathon oil': 'MRO',
    'potbelly': 'PBPB',
    'air transport services': 'ATSG',
    'slca': 'SLCA',
    'us silica': 'SLCA',
    'athira pharma': 'ATHA',
    'chimerix': 'CMRX',
    'catalent': 'CTLT',
    '89bio': 'ETNB',
    // Round 4 — missing aliases discovered in testing
    'inari medical': 'NARI',
    'inari': 'NARI',
    'fat brands': 'FAT',
    'h&e equipment services': 'HEES',
    'h&e equipment': 'HEES',
    'zynex medical': 'ZYXI',
    'zynex': 'ZYXI',
    'verve therapeutics': 'VERV',
    'verve': 'VERV',
    'guaranty bancshares': 'GNTY',
    'model n': 'MODN',
    'nuvei': 'NVEI',
    'nuvei corp': 'NVEI',
    'marinus pharmaceuticals': 'MRNS',
    'marinus': 'MRNS',
    'apartment income reit': 'AIRC',
    'equitrans midstream': 'ETRN',
    'luna innovations': 'LUNA',
    'tpi composites': 'TPIC',
    'evans bancorp': 'EVBN',
    'first of long island': 'FLIC',
    'first of long island corp': 'FLIC',
    'jamf': 'JAMF',
    'knowbe4': 'KNBE',
    'composecure': 'CMPO',
    'faro technologies': 'FARO',
    'faro': 'FARO',
    'gannett': 'GCI',
    'bright scholar': 'BEDU',
    'bright scholar education': 'BEDU',
    'ssrm': 'SSRM',
    'ssr mining': 'SSRM',
    'nycb': 'NYCB',
    'new york community bancorp': 'NYCB',
    'triumph financial': 'TBK',
    'mackinac savings': 'MCBC',
    'macatawa bank': 'MCBC',
    'veritex community bank': 'VBTX',
    'veritex': 'VBTX',
    // viral500 list — clean names that weren't in TICKER_ALIASES
    'vale s.a.': 'VALE',
    'vale': 'VALE',
    'honda motor': 'HMC',
    'honda': 'HMC',
    'alphabet (google)': 'GOOGL',
    'alphabet': 'GOOGL',
    'google': 'GOOGL',
    'mercedes-benz': 'MBGYY',
    'lear corporation': 'LEA',
    'lear': 'LEA',
    'bmw': 'BMWYY',
    'anheuser-busch inbev': 'BUD',
    'ab inbev': 'BUD',
    'arcelormittal': 'MT',
    'abb ltd': 'ABBNY',
    'abb': 'ABBNY',
    'sap': 'SAP',
    'universal health services': 'UHS',
    'bayer ag': 'BAYRY',
    'bayer': 'BAYRY',
    'charter communications': 'CHTR',
    'bhp group': 'BHP',
    'bhp': 'BHP',
    'mondelez international': 'MDLZ',
    'mondelez': 'MDLZ',
    'marsh mclennan': 'MMC',
    'marsh & mclennan': 'MMC',
    'astrazeneca adr': 'AZN',
    'astrazeneca': 'AZN',
    "kohl's": 'KSS',
    'kohls': 'KSS',
    'philip morris international': 'PM',
    'philip morris': 'PM',
    'thales group': 'THLEF',
    'thales': 'THLEF',
    'u.s. bancorp': 'USB',
    'us bancorp': 'USB',
    'hewlett packard enterprise': 'HPE',
    'wns holdings': 'WNS',
    'wns': 'WNS',
    'brinker international': 'EAT',
    'brinker': 'EAT',
    'bank of new york mellon': 'BK',
    'bny mellon': 'BK',
    'community health systems': 'CYH',
    'parker hannifin': 'PH',
    'parker': 'PH',
    'rio tinto': 'RIO',
    "dick's sporting goods": 'DKS',
    'dicks sporting goods': 'DKS',
    'hp inc.': 'HPQ',
    'hp inc': 'HPQ',
    'ge healthcare technologies': 'GEHC',
    'ge healthcare': 'GEHC',
    'cedar fair': 'FUN',
    'caesars entertainment': 'CZR',
    'caesars': 'CZR',
    "casey's general stores": 'CASY',
    'caseys': 'CASY',
    'stanley black & decker': 'SWK',
    'stanley black and decker': 'SWK',
    'genuine parts company': 'GPC',
    'genuine parts': 'GPC',
    'british american tobacco': 'BTI',
    'archer-daniels-midland': 'ADM',
    'archer daniels midland': 'ADM',
    'lkq corporation': 'LKQ',
    'lkq': 'LKQ',
    'performance food group': 'PFGC',
    'norwegian cruise line': 'NCLH',
    'xpo logistics': 'XPO',
    'xpo': 'XPO',
    'sprouts farmers market': 'SFM',
    'sprouts': 'SFM',
    'warner bros. discovery': 'WBD',
    'warner bros discovery': 'WBD',
    'j.b. hunt transport': 'JBHT',
    'jb hunt': 'JBHT',
    'vf corporation': 'VFC',
    'diageo': 'DEO',
    'petco health and wellness': 'WOOF',
    'petco': 'WOOF',
    'southern company': 'SO',
    'knight-swift transportation': 'KNX',
    'knight swift': 'KNX',
    'dana incorporated': 'DAN',
    'dana': 'DAN',
    'fortune brands innovations': 'FBIN',
    'fortune brands': 'FBIN',
    'agco corporation': 'AGCO',
    'agco': 'AGCO',
    'wabtec': 'WAB',
    'barrick gold': 'GOLD',
    'barrick': 'GOLD',
    'hertz global holdings': 'HTZ',
    'hertz': 'HTZ',
    'w.w. grainger': 'GWW',
    'grainger': 'GWW',
    'canadian national railway': 'CNI',
    'cn rail': 'CNI',
    'dover corporation': 'DOV',
    'dover': 'DOV',
    'nutrien': 'NTR',
    'fidelity national financial': 'FNF',
    'big lots': 'BIG',
    'international flavors & fragrances': 'IFF',
    'iff': 'IFF',
    'hilton grand vacations': 'HGV',
    'u.s. steel': 'X',
    'us steel': 'X',
    'celestica': 'CLS',
    'old dominion freight line': 'ODFL',
    'old dominion': 'ODFL',
    'discover financial services': 'DFS',
    'discover financial': 'DFS',
    'service corporation international': 'SCI',
    'marriott vacations worldwide': 'VAC',
    'marriott vacations': 'VAC',
    'alaska airlines': 'ALK',
    'canadian pacific kansas city': 'CP',
    'cp rail': 'CP',
    'huntington bancshares': 'HBAN',
    'huntington bank': 'HBAN',
    'charles river laboratories': 'CRL',
    'charles river': 'CRL',
    'first american financial': 'FAF',
    'expeditors international': 'EXPD',
    'expeditors': 'EXPD',
    'raymond james financial': 'RJF',
    'raymond james': 'RJF',
    'travel + leisure': 'TNL',
    'travel and leisure': 'TNL',
    'hartford financial services': 'HIG',
    'the hartford': 'HIG',
    'timken company': 'TKR',
    'timken': 'TKR',
    'red robin gourmet burgers': 'RRGB',
    'red robin': 'RRGB',
    'principal financial group': 'PFG',
    'principal financial': 'PFG',
    'first citizens bancshares': 'FCNCA',
    'first citizens bank': 'FCNCA',
    'citizens financial group': 'CFG',
    'citizens bank': 'CFG',
    'markel corp': 'MKL',
    'markel': 'MKL',
    'coca-cola consolidated': 'COKE',
    'coke consolidated': 'COKE',
    'agnico eagle mines': 'AEM',
    'agnico eagle': 'AEM',
    "papa john's international": 'PZZA',
    'papa johns': 'PZZA',
    'seaworld entertainment': 'SEAS',
    'seaworld': 'SEAS',
    'sealed air corporation': 'SEE',
    'sealed air': 'SEE',
    'american electric power': 'AEP',
    'aep': 'AEP',
    'live nation entertainment': 'LYV',
    'live nation': 'LYV',
    'westlake corporation': 'WLK',
    'westlake': 'WLK',
    'perspecta': 'PRSP',
    'cadence design systems': 'CDNS',
    'cadence': 'CDNS',
    'ncr corporation': 'NCR',
    'ncr': 'NCR',
    'mosaic company': 'MOS',
    'mosaic': 'MOS',
    'ihg hotels': 'IHG',
    'ihg': 'IHG',
    'loews corporation': 'L',
    'loews': 'L',
    'playa hotels & resorts': 'PLYA',
    'playa hotels': 'PLYA',
    'advanced energy industries': 'AEIS',
    'advanced energy': 'AEIS',
    'pseg': 'PEG',
    'intercontinental exchange': 'ICE',
    'c.h. robinson': 'CHRW',
    'ch robinson': 'CHRW',
    "ollie's bargain outlet": 'OLLI',
    'ollies': 'OLLI',
    'americold realty trust': 'COLD',
    'americold': 'COLD',
    'party city': 'PRTY',
    'terex corporation': 'TEX',
    'terex': 'TEX',
    // Round 5 — missing aliases
    'city office reit': 'CIO',
    'midwestone financial': 'MOFG',
    'midwestone': 'MOFG',
    'preferred bank': 'PFBC',
    'scpharmaceuticals': 'SCPH',
    'scpharma': 'SCPH',
    'icad inc': 'ICAD',
    'icad': 'ICAD',
    '89bio inc': 'ETNB',
    '89bio': 'ETNB',
    'the shyft group': 'SHYF',
    'shyft group': 'SHYF',
    'essa bancorp': 'ESSA',
    'essa bank': 'ESSA',
    'nintendo': 'NTDOY',
    'guess': 'GES',
    'guess?': 'GES',
};

async function resolveTicker(input) {
    // Check alias map first
    const alias = TICKER_ALIASES[input.toLowerCase().trim()];
    if (alias) return alias;

    const res = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(input)}&token=${FINNHUB_KEY}`);
    if (!res.ok) throw new Error(`Finnhub search HTTP ${res.status}`);
    const json = await res.json();
    const results = json?.result || [];
    const match = results.find(r => r.type === 'Common Stock' && r.symbol && !r.symbol.includes('.'))
               || results.find(r => r.type === 'Common Stock' && r.symbol)
               || results.find(r => r.symbol);
    if (!match) throw new Error(`No ticker found for: ${input}`);
    return match.symbol;
}

// ── Smart cross-validation merge ─────────────────────────────────────────────
// Collects all values per field, rejects outliers, picks best estimate

function median(arr) {
    if (!arr.length) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function rejectOutliers(values) {
    if (values.length <= 1) return values;
    const med = median(values);
    if (med === 0) return values;
    // Reject any value that is more than 10x away from the median
    return values.filter(v => Math.abs(v / med) < 10 && Math.abs(med / (v || 1)) < 10);
}

function bestFinancial(values) {
    // values is array of {val, source} objects
    // Filter out exact zeros — a profit/ebitda of $0 is almost always a failed
    // XBRL lookup, not real data. A company truly reporting $0 is astronomically
    // rare and would appear in other sources too.
    const nums = values.map(v => v.val).filter(v => v !== null && !isNaN(v) && v !== 0);
    if (!nums.length) return null;
    const clean = rejectOutliers(nums);
    if (!clean.length) return Math.round(median(nums));
    // Priority: FMP > Finnhub > EDGAR > AV
    // EDGAR wins on emps but can have wrong-period or malformed financial data.
    const priority = ['fmp', 'finnhub', 'edgar', 'alphavantage'];
    for (const src of priority) {
        const match = values.find(v => v.source === src && clean.includes(v.val));
        if (match) return match.val;
    }
    return Math.round(median(clean));
}

function bestEmps(values) {
    // values is array of {val, source} objects
    const nums = values.map(v => v.val).filter(v => v !== null && !isNaN(v) && v >= 100);
    if (!nums.length) return null;
    const clean = rejectOutliers(nums);
    if (!clean.length) return Math.round(median(nums));
    // Prefer Wikipedia (most up to date) > Finnhub > EDGAR > AV
    const priority = ['wikipedia', 'cmc', 'finnhub', 'edgar', 'alphavantage', 'fmp'];
    for (const src of priority) {
        const match = values.find(v => v.source === src && clean.includes(v.val));
        if (match) return match.val;
    }
    return Math.round(median(clean));
}

function detectOneTimeItem(profit, ebitda) {
    // If net income is > 3x EBITDA (in absolute terms), it likely contains a one-time item
    // In that case, flag it so the caller can decide what to show
    if (profit === null || ebitda === null || ebitda === 0) return false;
    return Math.abs(profit) > Math.abs(ebitda) * 3;
}

function smartMerge(results) {
    // Gather all values per field with source tags
    const nameVals   = results.filter(r => r.name).map(r => r.name);
    const logoVals   = results.filter(r => r.logo).map(r => r.logo);
    const empsVals   = results.filter(r => r.emps).map(r => ({ val: r.emps,   source: r.source }));
    const profitVals = results.filter(r => r.profit !== null && r.profit !== undefined)
                              .map(r => ({ val: r.profit, source: r.source }));
    const ebitdaVals = results.filter(r => r.ebitda !== null && r.ebitda !== undefined)
                              .map(r => ({ val: r.ebitda, source: r.source }));

    const emps   = bestEmps(empsVals);
    let profit   = bestFinancial(profitVals);
    let ebitda   = bestFinancial(ebitdaVals);

    // If profit looks like it contains a one-time item vs ebitda, note it
    // and use an ebitda-derived estimate as a cross-check
    const hasOneTimeItem = detectOneTimeItem(profit, ebitda);
    if (hasOneTimeItem && ebitda !== null) {
        // Don't discard profit - but flag it in the response so the UI can handle it
        profit = profit; // keep as-is, flagged below
    }

    // If ebitda missing but profit exists, estimate it
    if (ebitda === null && profit !== null) {
        ebitda = profit > 0 ? Math.round(profit * 1.3) : null;
    }

    return {
        name:          nameVals[0] || null,
        logo:          logoVals[0] || null,
        emps,
        profit,
        ebitda,
        hasOneTimeItem // flag for UI to optionally show a note
    };
}


module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { symbol: rawSymbol, resolve } = req.query;
    if (!rawSymbol) return res.status(400).json({ error: 'Missing symbol parameter' });

    let symbol = rawSymbol.toUpperCase().trim();

    if (resolve === '1') {
        try { symbol = await resolveTicker(rawSymbol.trim()); }
        catch(e) { return res.status(404).json({ error: `Could not resolve: ${rawSymbol}` }); }
    }

    const errors = [];

    // Round 1: EDGAR + FMP + Finnhub in parallel
    const [edgarR, fmpR, finnhubR] = await Promise.allSettled([
        fetchFromEDGAR(symbol),
        fetchFromFMP(symbol),
        fetchFromFinnhub(symbol),
    ]);

    const round1 = [];
    if (edgarR.status   === 'fulfilled') round1.push(edgarR.value);
    else errors.push('EDGAR: ' + edgarR.reason.message);
    if (fmpR.status     === 'fulfilled') round1.push(fmpR.value);
    else errors.push('FMP: ' + fmpR.reason.message);
    if (finnhubR.status === 'fulfilled') round1.push(finnhubR.value);
    else errors.push('Finnhub: ' + finnhubR.reason.message);

    const merged = smartMerge(round1);

    // Only call AV if we're still missing employee count (preserve 25/day limit)
    if (merged.name && !merged.emps) {
        try {
            const avResult = await fetchFromAlphaVantage(symbol);
            round1.push(avResult);
            const remerged = smartMerge(round1);
            Object.assign(merged, remerged);
        } catch(e) {
            errors.push('AV: ' + e.message);
        }
    }

    // FMP cash-flow / TTM fallback — fires when profit or ebitda are missing
    if (merged.name && (merged.profit === null || merged.ebitda === null)) {
        try {
            const yfResult = await fetchFromYahooFinance(symbol);
            // Merge: only fill in what's missing
            if (yfResult.emps   && !merged.emps)   merged.emps   = yfResult.emps;
            if (yfResult.profit !== null && merged.profit === null) merged.profit = yfResult.profit;
            if (yfResult.ebitda !== null && merged.ebitda === null) merged.ebitda = yfResult.ebitda;
        } catch(e) {
            errors.push('Yahoo: ' + e.message);
        }
    }

    // Try Wikipedia first (fast, reliable for large public companies)
    if (merged.emps == null || merged.emps === 0) {
        try {
            // Pass both the known title (if any) AND the raw name so
            // fetchEmployeeCountFromWikipedia can try multiple strategies
            const wikiTitle = WIKI_TITLE_MAP[symbol] || null;
            const rawMergedName = merged.name || '';
            // If name is ALL CAPS (EDGAR style e.g. "HUMANA INC"), convert to title case
            const isAllCapsName = rawMergedName === rawMergedName.toUpperCase() && /[A-Z]{3}/.test(rawMergedName);
            const finnhubName = (isAllCapsName
                ? rawMergedName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                                             .replace(/(\w)'([A-Z])/g, (_, a, b) => a + "'" + b.toLowerCase())
                : rawMergedName)
                .replace(/\s*\/[A-Z]{2,}\/\s*$/, '')       // strip /DE/ /MD/ etc
                .replace(/\s+(inc|corp|co|ltd)\.?\s*\/[A-Z]{2,}\s*$/i, '') // INC/WV style
                .replace(/\s*\(US\)\s*$/i, '')              // strip Finnhub's (US) suffix
                .replace(/,?\s+(L\.P\.|LP|MLP)\s*$/i, '')  // strip LP/L.P. suffix
                .replace(/,\s*$/, '')
                .trim();
            const wikiEmps = await fetchEmployeeCountFromWikipedia(finnhubName, wikiTitle, symbol);
            if (wikiEmps) merged.emps = wikiEmps;
        } catch(e) {
            errors.push('Wikipedia: ' + e.message);
        }
    }

    // Last resort: parse actual 10-K document text (slow but comprehensive)
    if (!merged.emps) {
        try {
            const tickerRes2 = await fetch('https://www.sec.gov/files/company_tickers.json', {
                headers: { 'User-Agent': 'YourFairShare admin@yourfairshare.com' }
            });
            if (tickerRes2.ok) {
                const tickers2 = await tickerRes2.json();
                let cik10k = null;
                for (const entry of Object.values(tickers2)) {
                    if (entry.ticker && entry.ticker.toUpperCase() === symbol.toUpperCase()) {
                        cik10k = String(entry.cik_str).padStart(10, '0');
                        break;
                    }
                }
                if (cik10k) {
                    const tenKEmps = await fetchEmployeeCountFrom10K(cik10k);
                    if (tenKEmps) merged.emps = tenKEmps;
                }
            }
        } catch(e) {
            errors.push('10-K text: ' + e.message);
        }
    }

    // StockAnalysis.com — reliable employee data, fires before CMC
    if (!merged.emps) {
        try {
            const saEmps = await fetchEmployeeCountFromStockAnalysis(symbol);
            if (saEmps) merged.emps = saEmps;
        } catch(e) {
            errors.push('StockAnalysis: ' + e.message);
        }
    }

    // Final fallback: companiesmarketcap.com
    if (!merged.emps && merged.name) {
        try {
            const cmcEmps = await fetchEmployeeCountFromCMC(symbol, merged.name);
            if (cmcEmps) merged.emps = cmcEmps;
        } catch(e) {
            errors.push('CMC: ' + e.message);
        }
    }

    // If all APIs failed to return a name but we have a known Wikipedia title,
    // seed the name and try Wikipedia directly — handles GPS, ODP, BRK.B etc.
    if (!merged.name && WIKI_TITLE_MAP[symbol]) {
        merged.name = WIKI_TITLE_MAP[symbol];
        try {
            const wikiEmps = await fetchEmployeeCountFromWikipedia(merged.name, WIKI_TITLE_MAP[symbol], symbol);
            if (wikiEmps) merged.emps = wikiEmps;
        } catch(e) {
            errors.push('Wikipedia (fallback name): ' + e.message);
        }
    }

    // Server-side fallback: if API returned no name/data, use FALLBACK_DB before 404
    if (!merged.name && SERVER_FALLBACK_DB[symbol]) {
        const fb = SERVER_FALLBACK_DB[symbol];
        merged.name = fb.name;
        if (fb.emps != null && merged.emps == null)   merged.emps   = fb.emps;
        if (fb.profit != null && merged.profit == null) merged.profit = fb.profit;
        if (fb.ebitda != null && merged.ebitda == null) merged.ebitda = fb.ebitda;
        if (fb.logo && !merged.logo) merged.logo = fb.logo;
    }
    if (!merged.name) {
        return res.status(404).json({ error: 'Could not find company data', details: errors });
    }

    // Fill any remaining null fields from SERVER_FALLBACK_DB (even when name resolved via API)
    if (SERVER_FALLBACK_DB[symbol]) {
        const fb = SERVER_FALLBACK_DB[symbol];
        if (fb.emps != null && merged.emps == null)     merged.emps   = fb.emps;
        if (fb.profit != null && merged.profit == null) merged.profit = fb.profit;
        if (fb.ebitda != null && merged.ebitda == null) merged.ebitda = fb.ebitda;
        if (fb.logo && !merged.logo)                    merged.logo   = fb.logo;
    }

    // Force-override block: some companies return bad API data (wrong entity, minority share
    // attribution, data truncation, etc.). These are unconditional overwrites.
    const FORCE_OVERRIDES = {
        // Barrick Gold: API returns stub with 1,000 emps / $17M profit.
        // Reality (FY2024): 26,800 employees, $2.14B net income, $5.19B EBITDA.
        "GOLD":  { emps: 26800, profit: 2140000000, ebitda: 5190000000 },

        // Interactive Brokers: API returns net income attributable to Class A public
        // shareholders only (~15% of company). Full consolidated FY2024 net income = $755M.
        "IBKR":  { profit: 755000000, ebitda: 1000000000 },

        // Microchip Technology: profit = -$500,000 is a data truncation artifact.
        // Real FY2024 GAAP net loss was approximately -$163M (inventory correction cycle).
        "MCHP":  { profit: -163000000 },

        // Ashland Global: API mixes periods/GAAP — returns profit=$505M / ebitda=-$538M.
        // FY2024 (ending Sep 2024): net income=$169M, adjusted EBITDA=$459M.
        "ASH":   { profit: 169000000, ebitda: 459000000 },

        // Booking Holdings: profit=$288M is a single quarter, not full year.
        // FY2024 full-year net income = $6.0B. EBITDA=$9.45B from API is correct.
        "BKNG":  { profit: 6000000000 },

        // Arthur J. Gallagher: API returns 706,000 employees. Reality: ~53,000.
        "AJG":   { emps: 53000 },

        // StoneX Group: ebitda=$2.8M is a data error (units confusion).
        // Reality: ebitda ~$400M; profit $306M is correct.
        "SNEX":  { ebitda: 400000000 },

        // Estee Lauder: profit=$684M is from a blended/wrong period.
        // FY2024 (ending June 2024) net income = $390M. EBITDA corrected to $600M.
        "EL":    { profit: 390000000, ebitda: 600000000 },

        // Duolingo: emps=700 is wrong (real: ~5,600). Profit=$414M inflated by tax benefit.
        // Real FY2024 net income = $183M.
        "DUOL":  { emps: 5600, profit: 183000000 },

        // HBNC — Horizon Bancal: API returns ~39,078 employees (filing year as headcount artifact).
        // Real employee count: ~1,200.
        "HBNC":  { emps: 1200 },

        // TCBK — TriCo Bancshares: API returns ~6,000 (wrong). Real: ~1,100.
        "TCBK":  { emps: 1100 },

        // SITM — SiTime Corporation: API returns 2,022 (year artifact). Real: ~220.
        "SITM":  { emps: 220 },

        // ── Year-artifact employee count fixes ──────────────────────────────
        // These companies have fiscal year numbers (2020–2025) or other
        // small round numbers returned as employee counts by the API.

        // UNP — Union Pacific: API returns 600. Real FY2023: ~32,000.
        "UNP":   { emps: 32000 },
        // BWA — BorgWarner: API returns 200. Real FY2023: ~35,000.
        "BWA":   { emps: 35000 },
        // PAA — Plains All American: API returns 200. Real FY2023: ~4,300.
        "PAA":   { emps: 4300 },
        // AA — Alcoa: API returns 200. Real FY2023: ~14,800.
        "AA":    { emps: 14800 },
        // FFIV — F5 Networks: API returns 600. Real FY2023: ~6,600.
        "FFIV":  { emps: 6600 },
        // CBOE — Cboe Global Markets: API returns 2,025 (year). Real: ~1,500.
        "CBOE":  { emps: 1500 },
        // EQT — EQT Corporation: API returns 2,025 (year). Real: ~1,600.
        "EQT":   { emps: 1600 },
        // CTRA — Coterra Energy: API returns 2,024 (year). Real: ~1,200.
        "CTRA":  { emps: 1200 },
        // RRC — Range Resources: API returns 2,025 (year). Real: ~490.
        "RRC":   { emps: 490 },
        // SWN — Southwestern Energy: API returns 2,023 (year). Real: ~1,000.
        "SWN":   { emps: 1000 },
        // CNX — CNX Resources: API returns 2,024 (year). Real: ~1,000.
        "CNX":   { emps: 1000 },
        // OVV — Ovintiv: API returns 2,022 (year). Real FY2023: ~2,600.
        "OVV":   { emps: 2600 },
        // FANG — Diamondback Energy: API returns 2,024 (year). Real: ~950.
        "FANG":  { emps: 950 },
        // EXE — Expand Energy (fka Chesapeake): API returns 2,024 (year). Real: ~1,300.
        "EXE":   { emps: 1300 },
        // TPL — Texas Pacific Land: API returns 2,025 (year). Real: ~100.
        "TPL":   { emps: 100 },
        // O — Realty Income: API returns 2,023 (year). Real: ~450.
        "O":     { emps: 450 },
        // INVH — Invitation Homes: API returns 2,021 (year). Real: ~1,800.
        "INVH":  { emps: 1800 },
        // AMH — American Homes 4 Rent: API returns 2,023 (year). Real: ~2,000.
        "AMH":   { emps: 2000 },
        // FRT — Federal Realty: API returns 2,021 (year). Real: ~200 (small REIT staff).
        "FRT":   { emps: 200 },
        // BXP — Boston Properties: API returns 2,023 (year). Real: ~750.
        "BXP":   { emps: 750 },
        // ARE — Alexandria Real Estate: API returns 2,024 (year). Real: ~600.
        "ARE":   { emps: 600 },
        // UDR — UDR Inc: API returns 2,024 (year). Real: ~500.
        "UDR":   { emps: 500 },
        // VRSN — VeriSign: API returns 2,025 (year). Real: ~1,100.
        "VRSN":  { emps: 1100 },
        // DOC — Physicians Realty Trust: API returns 2,024 (year). Real: ~200.
        "DOC":   { emps: 200 },
        // BMBL — Bumble: API returns 2,024 (year). Real FY2023: ~600.
        "BMBL":  { emps: 600 },
        // GO — Grocery Outlet: API returns 2,024 (year). Real: ~6,400.
        "GO":    { emps: 6400 },
        // IRDM — Iridium Communications: API returns 2,024 (year). Real: ~600.
        "IRDM":  { emps: 600 },
        // AMCX — AMC Networks: API returns 2,024 (year). Real: ~2,900.
        "AMCX":  { emps: 2900 },
        // OWL — Blue Owl Capital: API returns 2,025 (year). Real: ~800.
        "OWL":   { emps: 800 },
        // HLNE — Hamilton Lane: API returns 2,024 (year). Real: ~800.
        "HLNE":  { emps: 800 },
        // DINE — Dine Brands Global: API returns 2,023 (year). Real: ~500 (franchises out).
        "DINE":  { emps: 500 },
        // IONS — Ionis Pharmaceuticals: API returns 2,024 (year). Real: ~2,000.
        "IONS":  { emps: 2000 },
        // NN — NN Inc: API returns 2,021 (year). Real: ~6,500.
        "NN":    { emps: 6500 },
        // TNDM — Tandem Diabetes Care: API returns 2,020 (year). Real: ~1,900.
        "TNDM":  { emps: 1900 },
        // VTLE — Vital Energy: API returns 2,020 (year). Real: ~700.
        "VTLE":  { emps: 700 },
        // HAS — Hasbro: API returns 2,023 (year). Real: ~6,300.
        "HAS":   { emps: 6300 },
        // ZEUS — Olympic Steel: API returns 2,020 (year). Real: ~2,100.
        "ZEUS":  { emps: 2100 },

        // ── API returns incorrect/missing financial data ──────────────────────
        // PARA — Paramount Global: FY2024 net loss = -$5.98B (goodwill impairment).
        // EBITDA (operating-basis) ~$2.4B. Live API frequently returns null/stale data
        // due to the large write-down confusing FMP/Finnhub field mapping.
        "PARA":  { profit: -5978000000, ebitda: 2400000000 },
    };

    if (FORCE_OVERRIDES[symbol]) {
        const fo = FORCE_OVERRIDES[symbol];
        if (fo.emps   != null) merged.emps   = fo.emps;
        if (fo.profit != null) merged.profit = fo.profit;
        if (fo.ebitda != null) merged.ebitda = fo.ebitda;
    }

    // Re-run one-time item detection after force overrides, then hard-force flag
    // for known anomalous companies (EL: impairment charges; DUOL: tax benefit;
    // LYFT: tax benefit already documented).
    merged.hasOneTimeItem = detectOneTimeItem(merged.profit, merged.ebitda);
    const FORCE_ONE_TIME = new Set(["LYFT", "EL", "DUOL"]);
    if (FORCE_ONE_TIME.has(symbol)) merged.hasOneTimeItem = true;

    // If still no employee count, return what we have and let the client use fallback DB
    return res.status(200).json({ ...merged, resolvedSymbol: symbol, _errors: errors });
};
