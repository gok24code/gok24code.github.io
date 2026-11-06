// Hand-written timeline entries, merged with the automatic ones (projects from
// GitHub, certificates from the certificates repo). Add education, jobs, awards,
// competitions here. date: 'YYYY-MM' or 'YYYY-MM-DD'.
//
// { date: '2026-09', title: 'Started X', text: 'One line of context', href: 'https://…', kind: 'milestone' }
// kind: 'milestone' | 'education' | 'work' | 'award'
export const milestones = [
  // now: shown at the top of the timeline, labelled "now" instead of a date
  {
    now: true,
    kind: 'work',
    title: 'Game Development Group Lead',
    text: 'ISUBÜ Siber Güvenlik ve Yapay Zeka Kulübü',
  },
  {
    now: true,
    kind: 'work',
    title: 'Software Coordinator',
    text: 'ISUBÜ TEKNOFEST Kulübü',
  },
  {
    now: true,
    kind: 'project',
    title: 'TEKNOFEST Air Defense Systems competition',
    text: 'Active project · competing with the TEKNOFEST team',
  },
  {
    now: true,
    kind: 'project',
    title: 'Embedded AI project',
    text: 'Active project · AI running on embedded hardware',
  },

  {
    date: '2025-09', // academic year start, so it sorts after earlier 2025 entries
    period: '2025',
    kind: 'education',
    title: 'Isparta Uygulamalı Bilimler Üniversitesi',
    text: 'Computer Engineering · Isparta',
  },
  {
    date: '2021',
    kind: 'education',
    title: 'Hacı Malike Mehmet Bileydi Anadolu Lisesi',
    text: 'High school · Antalya. Most of my itch.io games were published between high school and university.',
  },
  {
    date: '2021',
    period: '2021 – 2025',
    kind: 'education',
    title: 'M.E.B. Antalya Bilim ve Sanat Merkezi (BİLSEM)',
    text: 'Gifted & talented programme, continued through high school until university',
  },
  {
    date: '2017',
    period: '2017 – 2021',
    kind: 'education',
    title: 'M.E.B. Antalya Bilim ve Sanat Merkezi (BİLSEM)',
    text: 'Gifted & talented programme · Antalya. Around this time I started publishing my first games.',
  },
  { date: '2017', kind: 'education', title: 'Başöğretmen Atatürk İlkokulu', text: 'Antalya' },
  {
    date: '2014',
    kind: 'education',
    title: 'M.E.B. Bilecik Bilim ve Sanat Merkezi (BİLSEM)',
    text: 'Gifted & talented programme · Bilecik',
  },
  { date: '2013', kind: 'education', title: 'Atatürk İlkokulu', text: 'Primary school · Bilecik' },
]

// Completion dates of certificates already in My_Online_Certificates, keyed by
// image file name. New certificates can carry their date in that repo's README
// instead (any dd.mm.yyyy or yyyy-mm-dd between the heading and the image).
export const certDates = {
  '1.png': '2025-11-22',
  '2.png': '2025-11-18',
  '3.png': '2025-09-05',
  '4.png': '2025-11-19',
  '5.png': '2026-06-02',
}

export const contact = {
  email: 'goktugtoyguc@gmail.com',
}
