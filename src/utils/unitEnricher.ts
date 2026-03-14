/**
 * מנגנון להעשרת תשובות עם מידע על יחידות וקישורים לאתר מתגייסים
 */

interface UnitInfo {
  names: string[];
  description: string;
  searchTerm: string;
}

const UNITS_DATABASE: UnitInfo[] = [
  {
    names: ['שלדג'],
    description: 'יחידה מיוחדת של חיל האוויר',
    searchTerm: 'שלדג'
  },
  {
    names: ['סיירת מטכ"ל', 'סיירת מטכל', 'סיירת מטכ״ל', 'מטכ"ל', 'מטכל', 'מטכ״ל'],
    description: 'יחידת עילית של אגף המודיעין',
    searchTerm: 'מטכל'
  },
  {
    names: ['שייטת 13', 'שייטת'],
    description: 'יחידת קומנדו ימי של חיל הים',
    searchTerm: 'שייטת'
  },
  {
    names: ['669', 'יחידה 669', 'יחידת 669'],
    description: 'יחידת החילוץ הקרבי של חיל האוויר',
    searchTerm: '669'
  },
  {
    names: ['מגלן', 'יחידת מגלן'],
    description: 'יחידה בחטיבת הקומנדו',
    searchTerm: 'מגלן'
  },
  {
    names: ['דובדבן', 'יחידת דובדבן'],
    description: 'יחידה בחטיבת הקומנדו',
    searchTerm: 'דובדבן'
  },
  {
    names: ['אגוז', 'יחידת אגוז'],
    description: 'יחידה בחטיבת הקומנדו',
    searchTerm: 'אגוז'
  },
  {
    names: ['יהל"ם', 'יהלם', 'יהל״ם', 'יהלום', 'יחידת יהלם'],
    description: 'יחידה מיוחדת של חיל ההנדסה הקרבית',
    searchTerm: 'יהלם'
  },
  {
    names: ['קומנדו', 'חטיבת קומנדו', 'חטיבת הקומנדו'],
    description: 'חטיבת הקומנדו כוללת מגלן, דובדבן ואגוז',
    searchTerm: 'קומנדו'
  },
  {
    names: ['גולני', 'חטיבת גולני'],
    description: 'חטיבת חי"ר',
    searchTerm: 'גולני'
  },
  {
    names: ['צנחנים', 'חטיבת צנחנים'],
    description: 'חטיבת חי"ר',
    searchTerm: 'צנחנים'
  },
  {
    names: ['גבעתי', 'חטיבת גבעתי'],
    description: 'חטיבת חי"ר',
    searchTerm: 'גבעתי'
  },
  {
    names: ['נח"ל', 'נחל', 'חטיבת נחל'],
    description: 'חטיבת חי"ר',
    searchTerm: 'נחל'
  },
  {
    names: ['שריון', 'חיל השריון'],
    description: 'חיל השריון',
    searchTerm: 'שריון'
  },
  {
    names: ['תותחנים', 'חיל התותחנים'],
    description: 'חיל התותחנים',
    searchTerm: 'תותחנים'
  },
  {
    names: ['מודיעין', 'חיל המודיעין'],
    description: 'חיל המודיעין',
    searchTerm: 'מודיעין'
  },
  {
    names: ['8200', 'יחידה 8200', 'יחידת 8200'],
    description: 'יחידת מודיעין טכנולוגית',
    searchTerm: '8200'
  },
  {
    names: ['חיל האוויר'],
    description: 'חיל האוויר',
    searchTerm: 'חיל+האוויר'
  },
  {
    names: ['חיל הים'],
    description: 'חיל הים',
    searchTerm: 'חיל+הים'
  },
  {
    names: ['הנדסה קרבית', 'חיל ההנדסה'],
    description: 'חיל ההנדסה הקרבית',
    searchTerm: 'הנדסה+קרבית'
  },
  {
    names: ['עוקץ', 'יחידת עוקץ'],
    description: 'יחידת מודיעין מיוחדת',
    searchTerm: 'עוקץ'
  }
];

/**
 * מזהה יחידה בטקסט
 */
function detectUnit(text: string): UnitInfo | null {
  const normalized = text.toLowerCase().trim();

  for (const unit of UNITS_DATABASE) {
    for (const name of unit.names) {
      if (normalized.includes(name.toLowerCase())) {
        return unit;
      }
    }
  }

  return null;
}

/**
 * מעשיר תשובה עם מידע על יחידה וקישור לאתר מתגייסים
 * @param answer - התשובה המקורית
 * @param question - השאלה של המשתמש (אופציונלי)
 * @returns התשובה המועשרת
 */
export function enrichAnswerWithUnitInfo(answer: string, question?: string): string {
  if (!answer || answer.trim().length === 0) {
    return answer;
  }

  // בדיקה בשאלה ובתשובה
  const textToCheck = `${question || ''} ${answer}`;
  const detectedUnit = detectUnit(textToCheck);

  if (!detectedUnit) {
    return answer;
  }

  // הכנת המידע הנוסף
  const unitDescription = `\n\n${detectedUnit.description}.`;
  const mitgaisimLink = `\n\nלמידע רשמי ועדכני באתר מתגייסים:\nhttps://www.mitgaisim.idf.il/search/?q=${detectedUnit.searchTerm}`;

  // בדיקה אם כבר קיים קישור או מידע דומה בתשובה
  if (answer.includes('mitgaisim.idf.il') || answer.includes(detectedUnit.description)) {
    return answer;
  }

  // הוספת המידע המועשר
  return `${answer}${unitDescription}${mitgaisimLink}`;
}

/**
 * מזהה יחידה בטקסט ומחזיר את שם היחידה והקישור
 */
export function getUnitInfoForText(text: string): { unitName: string; description: string; link: string } | null {
  const detectedUnit = detectUnit(text);

  if (!detectedUnit) {
    return null;
  }

  return {
    unitName: detectedUnit.names[0],
    description: detectedUnit.description,
    link: `https://www.mitgaisim.idf.il/search/?q=${detectedUnit.searchTerm}`
  };
}
