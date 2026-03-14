import { TracksData } from '../types/tracks';

export const tracksData: TracksData = {
  meta: {
    version: 1,
    lang: "he",
    generatedAt: "2026-03-13",
    sourceType: "official"
  },
  filters: {
    categories: [
      { id: "combat_elite", label: "עילית" },
      { id: "air_force", label: "חיל האוויר" },
      { id: "navy", label: "חיל הים" },
      { id: "intelligence", label: "מודיעין" },
      { id: "cyber", label: "סייבר" },
      { id: "technology", label: "טכנולוגיה" },
      { id: "combat", label: "קרבי" },
      { id: "border_defense", label: "גבולות" }
    ],
    entryTypes: [
      { id: "screening", label: "דורש מיון" },
      { id: "assignment", label: "שיבוץ" }
    ],
    kinds: [
      { id: "screening_gate", label: "שער מיון" },
      { id: "track", label: "מסלול" },
      { id: "role_family", label: "משפחת תפקידים" },
      { id: "role", label: "תפקיד" }
    ]
  },
  tracks: [
    {
      id: "yom-sayerot",
      name: "יום סיירות",
      kind: "screening_gate",
      category: "combat_elite",
      entryType: "screening",
      summary: "יום מיון פיזי ליחידות עילית.",
      audience: ["מלש\"ב"],
      gender: ["זכרים", "נקבות"],
      profileMin: 82,
      requirements: [
        "פרופיל 82 ומעלה",
        "דפ\"ר 50 ומעלה",
        "קב\"א 52 ומעלה"
      ],
      process: [
        "יום מיון",
        "קבלת תוצאה",
        "המשך למיוני המשך"
      ],
      keywords: ["יום סיירות", "יום שדה", "גיבוש", "מיון פיזי", "יחידות עילית"],
      ui: {
        homeGroup: "popular",
        cardTitle: "יום סיירות",
        cardSubtitle: "שער ליחידות עילית",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "מיון",
        searchWeight: 10
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/כתבות/כתבות-ציר-הזמן/מיון-מתקדם/יום-סיירות-המדריך-המלא/",
          title: "יום סיירות - המדריך המלא",
          snippet: "ימי הסיירות מתקיימים בחודשי ינואר ואוקטובר."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "pilot-course",
      name: "קורס טיס",
      kind: "track",
      category: "air_force",
      entryType: "screening",
      summary: "מסלול הכשרת צוות אוויר בן 3 שנים.",
      audience: ["מלש\"ב", "מלש\"בית"],
      gender: ["זכרים", "נקבות"],
      profileMin: 97,
      requirements: [
        "פרופיל 97",
        "דפ\"ר 60 ומעלה"
      ],
      process: [
        "מיונים קדם-צבאיים",
        "שלבי מיון ייעודיים",
        "קורס טיס"
      ],
      keywords: ["קורס טיס", "טייס", "טייסת", "חיל האוויר", "ירפא"],
      ui: {
        homeGroup: "popular",
        cardTitle: "קורס טיס",
        cardSubtitle: "מסלול צוות אוויר",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "עילית",
        searchWeight: 10
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/טייסת/",
          title: "טייס/ת - מתגייסים",
          snippet: "פרופיל 97, דפ\"ר 60 ומעלה ומעבר מיונים קדם צבאיים בהצלחה."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "hovlim",
      name: "חובלים",
      kind: "track",
      category: "navy",
      entryType: "screening",
      summary: "מסלול קציני הים של זרוע הים.",
      audience: ["מלש\"ב", "מלש\"בית"],
      gender: ["זכרים", "נקבות"],
      requirements: [
        "מעבר מיונים ייעודיים"
      ],
      process: [
        "מיונים",
        "גיבוש",
        "קורס חובלים"
      ],
      keywords: ["חובלים", "חובל", "קורס חובלים", "חיל הים", "קציני ים"],
      ui: {
        homeGroup: "popular",
        cardTitle: "חובלים",
        cardSubtitle: "קציני הים של צה\"ל",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "חיל הים",
        searchWeight: 9
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/חובלים/",
          title: "חובל/ת",
          snippet: "התפקיד כולל פיקוד על צוות לוחמים בכלי השייט השונים של זרוע הים."
        }
      ],
      verify: {
        confidence: "medium",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "shchakim",
      name: "שחקים",
      kind: "track",
      category: "intelligence",
      entryType: "screening",
      summary: "מסלול מודיעיני עם תתי-מסלולים ותוכניות תואר.",
      audience: ["מלש\"ב", "מלש\"בית"],
      gender: ["זכרים", "נקבות"],
      keywords: ["שחקים", "חיל המודיעין", "מודיעין", "מסלול שחקים"],
      ui: {
        homeGroup: "intelligence",
        cardTitle: "שחקים",
        cardSubtitle: "מסלול מודיעיני מוביל",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "מודיעין",
        searchWeight: 10
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/מסלול-שחקים/",
          title: "מסלול שחקים",
          snippet: "מסלול שחקים הוא מסלול משולב המאגד 7 תתי מסלולים ו2 תוכניות לימודים לתואר ראשון."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "gama-cyber",
      name: "גאמ\"א סייבר",
      kind: "track",
      category: "cyber",
      entryType: "screening",
      summary: "מסלול טכנולוגי-מודיעיני בתחומי מחשבים וסייבר.",
      audience: ["מלש\"ב", "מלש\"בית"],
      gender: ["זכרים", "נקבות"],
      requirements: [
        "ידע קודם באחד מתחומי המחשבים"
      ],
      keywords: ["גאמ\"א", "גאמא", "גאמ\"א סייבר", "סייבר", "מחשבים", "מודיעין"],
      ui: {
        homeGroup: "technology",
        cardTitle: "גאמ\"א סייבר",
        cardSubtitle: "מודיעין, קוד וסייבר",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "סייבר",
        searchWeight: 10
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/מסלול-גאמא-סייבר/",
          title: "מסלול גאמ\"א - סייבר",
          snippet: "כלל התפקידים במסלול גאמ\"א מחייבים שירות קבע של שלוש שנים."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "computer-professions",
      name: "אשכול מקצועות המחשב",
      kind: "screening_gate",
      category: "technology",
      entryType: "screening",
      summary: "אשכול מיון לתפקידי תוכנה, סייבר ותקשוב.",
      audience: ["מלש\"ב", "מלש\"בית"],
      gender: ["זכרים", "נקבות"],
      keywords: ["אשכול מקצועות המחשב", "מקצועות המחשב", "תוכנה", "תקשוב", "סייבר"],
      ui: {
        homeGroup: "technology",
        cardTitle: "אשכול מקצועות המחשב",
        cardSubtitle: "שער לתפקידים טכנולוגיים",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "טכנולוגיה",
        searchWeight: 9
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/כתבות/כתבות-ציר-הזמן/מיון-מתקדם/מיונים-לתפקידי-עורף/המיון-לאשכול-מקצועות-המחשב/",
          title: "המיון לאשכול מקצועות המחשב",
          snippet: "התפקידים פתוחים לגברים ונשים כאחד, וללא דרישת רקע טכנולוגי מוקדם, למעט יעדים ספציפיים."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "infantry",
      name: "חי\"ר",
      kind: "role_family",
      category: "combat",
      entryType: "assignment",
      summary: "משפחת תפקידי לוחם בחטיבות החי\"ר.",
      audience: ["מלש\"ב"],
      gender: ["זכרים"],
      profileMin: 82,
      requirements: [
        "פרופיל 82 ומעלה",
        "BMI 17-32"
      ],
      keywords: ["חי\"ר", "גולני", "גבעתי", "נח\"ל", "כפיר", "צנחנים", "לוחם"],
      ui: {
        homeGroup: "combat",
        cardTitle: "חי\"ר",
        cardSubtitle: "גולני, גבעתי, נח\"ל ועוד",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "קרבי",
        searchWeight: 10
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/לוחם-חוד-בחטיבת-גולני/",
          title: "לוחם חוד בחטיבת גולני",
          snippet: "פרופיל 82 ומעלה. BMI: 17-32."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "armor",
      name: "שריון",
      kind: "track",
      category: "combat",
      entryType: "assignment",
      summary: "מסלול לוחם טנק בחיל השריון.",
      audience: ["מלש\"ב"],
      gender: ["זכרים"],
      keywords: ["שריון", "לוחם שריון", "טנק", "מרכבה", "חיל השריון"],
      ui: {
        homeGroup: "combat",
        cardTitle: "שריון",
        cardSubtitle: "לוחם טנק בחיל השריון",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "קרבי",
        searchWeight: 8
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/לוחם-שריון/",
          title: "לוחם שריון",
          snippet: "לאחר ארבעת חודשי הטירונות ישנם עוד 4 חודשי אימון מתקדם."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "combat-engineering",
      name: "הנדסה קרבית",
      kind: "track",
      category: "combat",
      entryType: "assignment",
      summary: "מסלול לוחם בחיל ההנדסה הקרבית.",
      audience: ["מלש\"ב"],
      gender: ["זכרים"],
      profileMin: 82,
      requirements: [
        "פרופיל 82 ומעלה ללא סעיפים פוסלים"
      ],
      keywords: ["הנדסה קרבית", "לוחם הנדסה", "חבלה", "מוקשים", "פומ\"ה"],
      ui: {
        homeGroup: "combat",
        cardTitle: "הנדסה קרבית",
        cardSubtitle: "חבלה, מכשולים ופריצת דרך",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "קרבי",
        searchWeight: 8
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/לוחם-בחיל-ההנדסה-הקרבית/",
          title: "לוחם חוד בחיל ההנדסה הקרבית",
          snippet: "פרופיל 82 ומעלה ללא סעיפים פוסלים."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "combat-intelligence",
      name: "איסוף קרבי",
      kind: "track",
      category: "combat",
      entryType: "assignment",
      summary: "מסלול לוחם/ת חוד בחיל האיסוף הקרבי.",
      audience: ["מלש\"ב", "מלש\"בית"],
      gender: ["זכרים", "נקבות"],
      keywords: ["איסוף קרבי", "חיל האיסוף הקרבי", "מודיעין שדה", "תצפית", "לוחם חוד"],
      ui: {
        homeGroup: "combat",
        cardTitle: "איסוף קרבי",
        cardSubtitle: "לחימה ואיסוף מודיעין",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "קרבי",
        searchWeight: 8
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/לוחמת-חוד-איסוף-קרבי/",
          title: "לוחם/ת חוד בחיל האיסוף הקרבי",
          snippet: "טירונות 05 שאורכת 4 חודשים + אימון מתקדם שאורך ארבעה חודשים."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "naval-fighter",
      name: "לוחם ימי",
      kind: "track",
      category: "navy",
      entryType: "screening",
      summary: "מסלול לוחם/ת ימי בזרוע הים.",
      audience: ["מלש\"ב", "מלש\"בית"],
      gender: ["זכרים", "נקבות"],
      profileMin: 72,
      requirements: [
        "פרופיל 72 ומעלה"
      ],
      keywords: ["לוחם ימי", "סטי\"ל", "חיל הים", "ספינות טילים", "לוחם סטיל"],
      ui: {
        homeGroup: "navy",
        cardTitle: "לוחם ימי",
        cardSubtitle: "לחימה על כלי שיט",
        ctaLabel: "לפרטי המסלול",
        detailsScreen: "track_details",
        badge: "חיל הים",
        searchWeight: 8
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/לוחמת-חוד-ימי-לוחמת-סטיל/",
          title: "לוחם/ת חוד ימי - לוחמ/ת סטי\"ל",
          snippet: "פרופיל 72 ומעלה. גברים: דפ\"ר 30 ומעלה."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    },
    {
      id: "border-observer",
      name: "תצפיתנית",
      kind: "role",
      category: "border_defense",
      entryType: "assignment",
      summary: "תפקיד תצפית והתרעה בגבולות ישראל.",
      audience: ["מלש\"בית"],
      gender: ["נקבות"],
      keywords: ["תצפיתנית", "בקא\"סית", "גבולות", "הגנת גבולות", "חיל האיסוף הקרבי"],
      ui: {
        homeGroup: "border",
        cardTitle: "תצפיתנית",
        cardSubtitle: "תצפית והתרעה בגבולות",
        ctaLabel: "לפרטי התפקיד",
        detailsScreen: "track_details",
        badge: "גבולות",
        searchWeight: 9
      },
      sources: [
        {
          url: "https://www.mitgaisim.idf.il/roles/תצפיתנית-בחיל-האיסוף-הקרבי/",
          title: "תצפיתנית ובקא\"סית",
          snippet: "תהליך הגיוס של תצפיתנית ובקא״סית מתחיל בהכשרה בת 10 שבועות."
        }
      ],
      verify: {
        confidence: "high",
        verifiedAt: "2026-03-13",
        hasConflict: false
      }
    }
  ]
};

export const { tracks, filters, meta } = tracksData;
