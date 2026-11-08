/* Dati: Latvijas Saeimas vēlēšanas, valdības un budžeti (Providus, stāvoklis 07.11.2026) */
window.PDATA = (function () {
  const LV = [
    { s: 5, year: 1993, electStart: "1993-06-05", elect: "1993-06-06", pm: "Valdis Birkavs", gov: "1993-07-20", budgetYear: 1994, budget: "1994-02-03",
      parties: 2, seats: 48, majority: false, coalition: "LC, LZS", note: "Uzticība 20.07.1993.; funkciju pārņemšana 03.08.1993. Mazākuma valdība.",
      src: { gov: "https://likumi.lv/ta/id/286844", budget: "https://www.vestnesis.lv/ta/id/57949", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 6, year: 1995, electStart: "1995-09-30", elect: "1995-10-01", pm: "Andris Šķēle I", gov: "1995-12-21", budgetYear: 1996, budget: "1996-02-15",
      parties: 6, seats: 73, majority: true, coalition: "DPS, LC, TB, LNNK/LZP, LZS/KDS/LDP, LVP", note: "Divu dienu vēlēšanas; dienas skaita no pēdējās vēlēšanu dienas. Sešu frakciju „plašā” valdība.",
      src: { gov: "https://www.saeima.lv/lv/transcripts/view/1912", budget: "https://www.vestnesis.lv/ta/id/305652", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 7, year: 1998, electStart: "1998-10-03", elect: "1998-10-03", pm: "Vilis Krištopans", gov: "1998-11-26", budgetYear: 1999, budget: "1999-02-25",
      parties: 3, seats: 46, majority: false, coalition: "LC, TB/LNNK, JP", note: "Mazākuma valdība; budžetam bija vajadzīgs sociāldemokrātu atbalsts.",
      src: { gov: "https://www.saeima.lv/lv/transcripts/view/557", budget: "https://www.vestnesis.lv/ta/id/22778", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 8, year: 2002, electStart: "2002-10-05", elect: "2002-10-05", pm: "Einars Repše", gov: "2002-11-07", budgetYear: 2003, budget: "2003-02-28",
      parties: 4, seats: 55, majority: true, coalition: "JL, LPP, ZZS, TB/LNNK", note: "",
      src: { gov: "https://www.mk.gov.lv/lv/ministru-kabineta-vesture", budget: "https://www.vestnesis.lv/ta/id/72288", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 9, year: 2006, electStart: "2006-10-07", elect: "2006-10-07", pm: "Aigars Kalvītis II", gov: "2006-11-07", budgetYear: 2007, budget: "2006-12-19",
      parties: 4, seats: 59, majority: true, coalition: "TP, ZZS, LPP/LC, TB/LNNK", note: "Iepriekšējā koalīcija turpināja darbu.",
      src: { gov: "https://www.mk.gov.lv/lv/ministru-kabineta-vesture", budget: "https://www.vestnesis.lv/ta/id/150652", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 10, year: 2010, electStart: "2010-10-02", elect: "2010-10-02", pm: "Valdis Dombrovskis II", gov: "2010-11-03", budgetYear: 2011, budget: "2010-12-20",
      parties: 2, seats: 55, majority: true, coalition: "Vienotība, ZZS", note: "",
      src: { gov: "https://www.mk.gov.lv/lv/ministru-kabineta-vesture", budget: "https://www.vestnesis.lv/ta/id/223570", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 11, year: 2011, electStart: "2011-09-17", elect: "2011-09-17", pm: "Valdis Dombrovskis III", gov: "2011-10-25", budgetYear: 2012, budget: "2011-12-15",
      parties: 3, seats: 56, majority: true, coalition: "Vienotība, ZRP, NA", note: "Ārkārtas vēlēšanas. Saeimas uzticības balsojums 25.10.2011.",
      src: { gov: "https://www.saeima.lv/lv/sasaukumi/11-saeima/stenogrammas/latvijas-republikas-11-saeimas-rudens-sesijas-piekta-arkartas-sede-2011-gada-25-oktobri/", budget: "https://www.saeima.lv/lv/aktualitates/19156-saeima-galigaja-lasijuma-pienem-2012-gada-valsts-budzetu/", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 12, year: 2014, electStart: "2014-10-04", elect: "2014-10-04", pm: "Laimdota Straujuma II", gov: "2014-11-05", budgetYear: 2015, budget: "2014-12-17",
      parties: 3, seats: 61, majority: true, coalition: "Vienotība, ZZS, NA", note: "Iepriekšējā koalīcija turpināja darbu.",
      src: { gov: "https://www.mk.gov.lv/lv/ministru-kabineta-vesture", budget: "https://likumi.lv/ta/id/271309-par-valsts-budzetu-2015-gadam", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 13, year: 2018, electStart: "2018-10-06", elect: "2018-10-06", pm: "Arturs Krišjānis Kariņš I", gov: "2019-01-23", budgetYear: 2019, budget: "2019-04-03",
      parties: 5, seats: 66, majority: true, coalition: "JV, KPV LV, JKP, AP!, NA", note: "Gads sākās ar pagaidu budžetu; pamatbudžeta likums pieņemts 03.04.2019.",
      src: { gov: "https://www.mk.gov.lv/lv/ministru-kabineta-vesture", budget: "https://www.fm.gov.lv/lv/media/2040/download", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } },
    { s: 14, year: 2022, electStart: "2022-10-01", elect: "2022-10-01", pm: "Arturs Krišjānis Kariņš II", gov: "2022-12-14", budgetYear: 2023, budget: "2023-03-09",
      parties: 3, seats: 54, majority: true, coalition: "JV, AS, NA", note: "Gads sākās ar pagaidu (tehnisko) budžetu; budžets pieņemts 09.03.2023.",
      src: { gov: "https://www.mk.gov.lv/lv/ministru-kabineta-vesture", budget: "https://likumi.lv/doc.php?id=340396", elect: "https://arhivs.cvk.lv/lv/saeimas-velesanas/" } }
  ];

  const LV2026 = {
    s: 15, year: 2026, elect: "2026-10-03", budgetYear: 2027,
    steps: [
      { date: "2026-10-03", label: "15. Saeimas vēlēšanas", done: true, src: "https://www.cvk.lv/lv/velesanas/saeimas-velesanas" },
      { date: "2026-11-03", label: "15. Saeima sanāk; līdzšinējā Kulberga valdība (kopš 28.05.2026) atkāpjas, bet pilda pienākumus", done: true, src: "https://www.saeima.lv" },
      { date: "2026-11-04", label: "Prezidents uztic jaunās valdības veidošanu A. Kulbergam (AS)", done: true, src: "https://www.mk.gov.lv/lv/jaunums/valsts-prezidents-edgars-rinkevics-uztic-nakamas-valdibas-veidosanu-andrim-kulbergam" },
      { date: null, label: "Saeimas uzticības balsojums jaunajai valdībai", done: false, hint: "Mērķis — līdz 18.11.2026." },
      { date: null, label: "Budžeta likumprojekts Saeimā", done: false, hint: "LBFV 21. p. (3): ne vēlāk kā 4 mēnešus pēc uzticības balsojuma" },
      { date: null, label: "2027. gada budžets pieņemts", done: false, hint: "Ja līdz 01.01.2027. nav pieņemts — pagaidu budžets" }
    ],
    results: [
      { p: "Apvienotais saraksts", pct: 35.29, seats: 41 },
      { p: "Latvija pirmajā vietā", pct: 13.08, seats: 17 },
      { p: "Suverēnā vara / Jaunlatvieši", pct: 11.71, seats: 15 },
      { p: "Nacionālā apvienība", pct: 8.90, seats: 10 },
      { p: "Progresīvie", pct: 7.88, seats: 10 },
      { p: "Jaunā Vienotība", pct: 6.36, seats: 7 }
    ],
    positions: [
      { who: "Edvards Smiltēns (Saeimas priekšsēdētājs) un ekonomists Edgars Voļskis", view: "Budžets jāpieņem līdz Ziemassvētkiem — gadu nevajadzētu sākt ar pagaidu budžetu.", budget: "2026-12-23", label: "Līdz Ziemassvētkiem", src: "https://www.lsm.lv/raksts/zinas/latvija/06.11.2026-valdibas-veidosana-budzetu-nekave-bet-par-ta-pienemsanas-laiku-vienpratibas-nav.a670842/" },
      { who: "Finanšu ministrs Māris Kučinskis", view: "Reālistiskāk — janvāra beigas vai februāris: pilnam ciklam (EK saskaņošana, divi lasījumi) vajag ap diviem mēnešiem; pensijām un algām riska nav.", budget: "2027-01-29", label: "Janvāra beigas", src: "https://www.lsm.lv/raksts/zinas/latvija/06.11.2026-valdibas-veidosana-budzetu-nekave-bet-par-ta-pienemsanas-laiku-vienpratibas-nav.a670842/" },
      { who: "Vēsturiskais salīdzinājums (2019 un 2023)", view: "Abās pēdējās reizēs, kad valdība tapa ilgāk par 2 mēnešiem, budžets tika pieņemts martā–aprīlī.", budget: "2027-03-10", label: "Marta sākums", src: "https://likumi.lv/ta/id/340143" }
    ]
  };

  /* Kaimiņvalstis — trīs pēdējie vēlēšanu cikli katrā */
  const NEIGH = [
    { code: "LT", name: "Lietuva", ruleShort: "Projekts Seimā ≥ 75 d. pirms gada beigām; budžets jāapstiprina pirms 1. janvāra (Konst. 130.–131. p.)", electMonth: "oktobris (2 kārtas)", govDef: "Seims apstiprina valdības programmu (Konstitūcijas 92. pants) — valdība iegūst pilnvaras",
      rule: "Konstitūcijas 130. pants: valdība iesniedz budžeta projektu Seimā ne vēlāk kā 75 dienas pirms budžeta gada beigām; 131. pants: Seims apstiprina budžetu pirms jaunā gada sākuma.",
      ruleSrc: "https://e-seimas.lrs.lt/rs/legalact/TAD/TAIS.211295/",
      cycles: [
        { year: 2016, elect: "2016-10-23", electNote: "2. kārta (1. kārta 09.10.)", pm: "Saulius Skvernelis", gov: "2016-12-13", budget: "2016-12-22", budgetYear: 2017,
          src: { gov: "https://www.robert-schuman.eu/en/the-letter/741", budget: "https://lithuaniatribune.com/tag/2017-budget/" } },
        { year: 2020, elect: "2020-10-25", electNote: "2. kārta (1. kārta 11.10.)", pm: "Ingrida Šimonytė", gov: "2020-12-11", budget: "2020-12-22", budgetYear: 2021,
          src: { gov: "https://www.lrt.lt/en/news-in-english/19/1305444/lithuanian-parliament-adopts-2021-budget", budget: "https://www.lrt.lt/en/news-in-english/19/1305444/lithuanian-parliament-adopts-2021-budget" } },
        { year: 2024, elect: "2024-10-27", electNote: "2. kārta (1. kārta 13.10.)", pm: "Gintautas Paluckas", gov: "2024-12-12", budget: "2024-12-19", budgetYear: 2025,
          src: { gov: "https://www.lrs.lt/sip/portal.show?p_r=35403&p_k=2&p_t=290344", budget: "https://www.lrs.lt/sip/portal.show?p_r=35403&p_k=2&p_t=290433" } }
      ] },
    { code: "EE", name: "Igaunija", ruleShort: "Bez budžeta — 1/12 mēnesī; ja 2 mēn. pēc gada sākuma budžeta nav — ārkārtas vēlēšanas (Konst. 118.–119. §)", electMonth: "marts", govDef: "Valdība nodod zvērestu Riigikogu (pēc pilnvarojuma premjera kandidātam)",
      rule: "Konstitūcijas 118. §: ja budžets nav pieņemts līdz gada sākumam, mēneša izdevumi nedrīkst pārsniegt 1/12 no iepriekšējā gada; 119. §: ja budžets nav pieņemts 2 mēnešu laikā pēc gada sākuma, prezidents izsludina ārkārtas vēlēšanas.",
      ruleSrc: "https://www.riigiteataja.ee/en/eli/523042025001/consolide",
      cycles: [
        { year: 2015, elect: "2015-03-01", pm: "Taavi Rõivas II", gov: "2015-04-09", budget: "2015-12-09", budgetYear: 2016,
          src: { gov: "https://valitsus.ee/en/news/government-prime-minister-taavi-roivas-assumed-office", budget: "https://www.riigiteataja.ee/akt/123112016008" } },
        { year: 2019, elect: "2019-03-03", pm: "Jüri Ratas II", gov: "2019-04-29", budget: "2019-12-11", budgetYear: 2020,
          src: { gov: "https://www.riigikogu.ee/en/pressiteated/substitute-members-riigikogu-members-government-took-oaths-office/", budget: "https://www.riigikogu.ee/en/pressiteated/riigikogu-approved-next-years-state-budget-2/" } },
        { year: 2023, elect: "2023-03-05", pm: "Kaja Kallas III", gov: "2023-04-17", budget: "2023-12-08", budgetYear: 2024,
          src: { gov: "https://valitsus.ee/en/news/53rd-government-republic-estonia-took-office", budget: "https://www.riigikogu.ee/en/pressiteated/the-riigikogu-passed-next-years-state-budget/" } }
      ] },
    { code: "FI", name: "Somija", ruleShort: "Ja budžets nav pieņemts līdz gada sākumam, provizoriski piemēro valdības projektu (Konst. 83. §)", electMonth: "aprīlis", govDef: "Prezidents ieceļ valdību pēc tam, kad parlaments ievēlējis premjeru",
      rule: "Konstitūcijas 83. §: budžeta priekšlikums iesniedzams parlamentam „labu laiku” pirms nākamā budžeta gada; ja budžets nav publicēts līdz gada sākumam, valdības priekšlikumu piemēro provizoriski.",
      ruleSrc: "https://www.finlex.fi/api/media/statute-foreign-language-translation/688686/mainPdf/main.pdf",
      cycles: [
        { year: 2015, elect: "2015-04-19", pm: "Juha Sipilä", gov: "2015-05-29", budget: "2015-12-18", budgetYear: 2016,
          src: { gov: "https://valtioneuvosto.fi/en/-/sipila-s-government-appointed", budget: "https://www.finlex.fi/api/media/statute/59143/media/6573.pdf?timestamp=2015-12-18T00:00:00.000Z" } },
        { year: 2019, elect: "2019-04-14", pm: "Antti Rinne", gov: "2019-06-06", budget: "2019-12-20", budgetYear: 2020,
          src: { gov: "https://valtioneuvosto.fi/-/10616/rinteen-hallitus-nimitettiin", budget: "https://budjetti.vm.fi/indox/sisalto.jsp?year=2020&lang=fi&maindoc=/2020/aky/aky.xml&id=/2020/aky/YksityiskohtaisetPerustelut/31/01/01.html" } },
        { year: 2023, elect: "2023-04-02", pm: "Petteri Orpo", gov: "2023-06-20", budget: "2023-12-19", budgetYear: 2024,
          src: { gov: "https://valtioneuvosto.fi/en/-/236553176/prime-minister-orpo-s-government-appointed", budget: "https://www.finlex.fi/en/legislation/collection/2023/1148" } }
      ] },
    { code: "SE", name: "Zviedrija", ruleShort: "Budžeta projekts ne vēlāk kā 15. novembrī arī pēc valdības maiņas; Riksdāgs lemj decembrī (Riksdāga likums 9:5)", electMonth: "septembris", govDef: "Riksdāga balsojums par premjeru (tolerances princips — pret nebalso vairākums)",
      rule: "Riksdāga likums (9. nod. 5. §): budžeta projekts līdz 20. septembrim; valdības maiņas gadījumā — 3 nedēļu laikā pēc stāšanās amatā, bet ne vēlāk kā 15. novembrī. Riksdāgs var pieņemt arī opozīcijas budžetu (2014, 2018).",
      ruleSrc: "https://www.riksdagen.se/globalassets/05.-sa-fungerar-riksdagen/demokrati/the-riksdag-act-2023_new.pdf",
      cycles: [
        { year: 2014, elect: "2014-09-14", pm: "Stefan Löfven I", gov: "2014-10-02", budget: "2014-12-03", budgetYear: 2015, note: "Riksdāgs pieņēma opozīcijas (Alianses) budžetu.",
          src: { gov: "https://www.riksdagen.se/en/how-the-riksdag-works/democracy/forming-a-government/previous-formations-of-government-and-prime-ministers/", budget: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/statens-budget-2015-rambeslutet_h201fiu1/" } },
        { year: 2018, elect: "2018-09-09", pm: "Stefan Löfven II", gov: "2019-01-18", budget: "2018-12-12", budgetYear: 2019, note: "Budžets (M+KD priekšlikums) pieņemts 37 dienas PIRMS valdības apstiprināšanas — pārejas valdības laikā.",
          src: { gov: "https://www.riksdagen.se/en/how-the-riksdag-works/democracy/forming-a-government/previous-formations-of-government-and-prime-ministers/", budget: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/statens-budget-2019-rambeslutet_H601FiU1/" } },
        { year: 2022, elect: "2022-09-11", pm: "Ulf Kristersson", gov: "2022-10-17", budget: "2022-12-13", budgetYear: 2023,
          src: { gov: "https://www.riksdagen.se/sv/aktuellt/aktuelltnotiser/2022/okt/17/ulf-kristersson-approved-as-prime-minister_cms40110c18-74aa-4e0b-a28e-19df166633dben/", budget: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/statens-budget-2023-rambeslutet_ha01fiu1/" } }
      ] },
    { code: "PL", name: "Polija", ruleShort: "Ja budžets 4 mēn. pēc iesniegšanas nav nodots parakstīšanai, prezidents var atlaist Sejmu (Konst. 225. p.)", electMonth: "oktobris", govDef: "Sejma uzticības balsojums Ministru padomei",
      rule: "Konstitūcijas 222. pants: budžeta projekts Sejmā ne vēlāk kā 3 mēnešus pirms gada sākuma; 219. p.: ja budžets nav spēkā, valdība strādā pēc projekta; 225. pants: ja budžets 4 mēnešu laikā pēc iesniegšanas nav nodots prezidentam parakstīšanai, prezidents var atlaist Sejmu.",
      ruleSrc: "https://www.senat.gov.pl/en/about-the-senate/konstytucja/chapter-x/",
      cycles: [
        { year: 2015, elect: "2015-10-25", pm: "Beata Szydło", gov: "2015-11-18", budget: "2016-02-25", budgetYear: 2016, note: "Sejma 3. lasījums 29.–30.01.2016; galīgais balsojums par Senāta labojumiem 25.02.2016; prezidents parakstīja 03.03.2016.",
          src: { gov: "http://oide.sejm.gov.pl/oide/en/images/files/kronika/kronika003_8.pdf", budget: "https://api.sejm.gov.pl/sejm/term8/processes/146" } },
        { year: 2019, elect: "2019-10-13", pm: "Mateusz Morawiecki II", gov: "2019-11-19", budget: "2020-03-27", budgetYear: 2020, note: "Sejma 3. lasījums 14.02.2020; Senāta labojumi noraidīti 27.03.2020; parakstīts 30.03.2020.",
          src: { gov: "http://www.sejm.gov.pl/Sejm9.nsf/komunikat.xsp?documentId=9971712CDE799CFFC12584B80035A6EB", budget: "https://api.sejm.gov.pl/sejm/term9/processes/112" } },
        { year: 2023, elect: "2023-10-15", pm: "Donald Tusk", gov: "2023-12-12", budget: "2024-01-24", budgetYear: 2024, note: "Sejma 3. lasījums 18.01.2024; Senāts bez labojumiem 24.01.2024; parakstīts 31.01.2024.",
          src: { gov: "https://www.gov.pl/web/premier/rzad-premiera-donalda-tuska-zaprzysiezony", budget: "https://api.sejm.gov.pl/sejm/term10/processes/125" } }
      ] }
  ];

  const LV_RULES = {
    govDef: "Saeimas uzticības balsojums jaunajam Ministru kabinetam (Satversmes 59. pants)",
    ruleShort: "Vēlēšanu gadā budžeta projekts Saeimā ≤ 4 mēn. pēc uzticības balsojuma; bez budžeta — pagaidu budžets (LBFV 21. un 15. p.)",
    rule: "Satversmes 66. pants: Saeima ik gadus pirms saimnieciskā gada sākšanās lemj par budžetu. Likums par budžetu un finanšu vadību (LBFV) 21. p. (3): vēlēšanu gadā budžeta projekts iesniedzams Saeimā ne vēlāk kā 4 mēnešus pēc uzticības balsojuma; ja gads sākas bez budžeta — pagaidu budžets (LBFV 15. p.).",
    ruleSrc: "https://likumi.lv/ta/id/58057-likums-par-budzetu-un-finansu-vadibu"
  };

  const SOURCES_2026 = [
    { t: "Valsts prezidents uztic valdības veidošanu A. Kulbergam (04.11.2026)", u: "https://www.mk.gov.lv/lv/jaunums/valsts-prezidents-edgars-rinkevics-uztic-nakamas-valdibas-veidosanu-andrim-kulbergam" },
    { t: "LSM: „Valdības veidošana budžetu nekavē, bet par tā pieņemšanas laiku vienprātības nav” (06.11.2026)", u: "https://www.lsm.lv/raksts/zinas/latvija/06.11.2026-valdibas-veidosana-budzetu-nekave-bet-par-ta-pienemsanas-laiku-vienpratibas-nav.a670842/" },
    { t: "LSM: Kulbergs par valdības veidošanas sarunu modeli (27.10.2026)", u: "https://www.lsm.lv/raksts/zinas/latvija/27.10.2026-kulbergs-valdibas-veidosanas-sarunas-piedavas-jaunu-darba-modeli-un-ministru-misijas-vestules.a669228/" },
    { t: "MK informatīvais ziņojums par 2027. gada budžeta sagatavošanu (pagaidu budžeta nosacījumi)", u: "https://www.mk.gov.lv/lv/media/28089/download?attachment" },
    { t: "MK rīkojums Nr. 275 (15.05.2026) — 2027. gada budžeta sagatavošanas grafiks", u: "https://likumi.lv/ta/id/368399" },
    { t: "Likums par budžetu un finanšu vadību (21. p. (3) — 4 mēnešu termiņš vēlēšanu gadā)", u: "https://likumi.lv/ta/id/58057-likums-par-budzetu-un-finansu-vadibu" },
    { t: "FM: „2023. gadu sāksim ar pagaidu jeb tehnisko valsts budžetu” (23.11.2022) — kā darbojas pagaidu budžets", u: "https://www.fm.gov.lv/lv/jaunums/2023-gadu-saksim-ar-pagaidu-jeb-tehnisko-valsts-budzetu" },
    { t: "Satversme, 66. pants", u: "https://www.saeima.lv/Lapas/Satversme_Visa.htm" },
    { t: "CVK — Saeimas vēlēšanu rezultāti", u: "https://www.cvk.lv/lv/velesanas/saeimas-velesanas" }
  ];

  return { LV, LV2026, NEIGH, LV_RULES, SOURCES_2026, UPDATED: "2026-11-07" };
})();
