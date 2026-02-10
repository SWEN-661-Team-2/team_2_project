// Patient criticality levels
export const PatientCriticality = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Sample patient data
export class PatientsRepository {

  patients = [
  // ============================================================================
  // NO VISIT, NO ATTENTION (11 patients - IDs 22-32)
  // ============================================================================
    {
      id: '22',
      firstName: 'Sophie',
      lastName: 'Mitchell',
      fullName: 'Sophie Mitchell',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '23',
      firstName: 'Henry',
      lastName: 'Clarke',
      fullName: 'Henry Clarke',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '24',
      firstName: 'Grace',
      lastName: 'Bennett',
      fullName: 'Grace Bennett',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '25',
      firstName: 'Oscar',
      lastName: 'Fletcher',
      fullName: 'Oscar Fletcher',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '26',
      firstName: 'Lily',
      lastName: 'Chambers',
      fullName: 'Lily Chambers',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '27',
      firstName: 'Felix',
      lastName: 'Grant',
      fullName: 'Felix Grant',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '28',
      firstName: 'Nora',
      lastName: 'Holt',
      fullName: 'Nora Holt',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '29',
      firstName: 'Liam',
      lastName: 'Pearce',
      fullName: 'Liam Pearce',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '30',
      firstName: 'Isla',
      lastName: 'Watts',
      fullName: 'Isla Watts',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '31',
      firstName: 'Hugo',
      lastName: 'Simmons',
      fullName: 'Hugo Simmons',
      criticality: null,
      nextVisit: null,
    },
    {
      id: '32',
      firstName: 'Clara',
      lastName: 'Norris',
      fullName: 'Clara Norris',
      criticality: null,
      nextVisit: null,
    },

// ============================================================================
// NO VISIT, NEED ATTENTION (5 patients - IDs 12-15, 33)
// ============================================================================
    {
      id: '12',
      firstName: 'Amina',
      lastName: 'Hassan',
      fullName: 'Amina Hassan',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: null,
    },
    {
      id: '13',
      firstName: 'Carlos',
      lastName: 'Rivera',
      fullName: 'Carlos Rivera',
      criticality: PatientCriticality.HIGH,
      nextVisit: null,
    },
    {
      id: '14',
      firstName: 'Linda',
      lastName: 'Baker',
      fullName: 'Linda Baker',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: null,
    },
    {
      id: '15',
      firstName: 'Noah',
      lastName: 'Brooks',
      fullName: 'Noah Brooks',
      criticality: PatientCriticality.LOW,
      nextVisit: null,
    },
    {
      id: '33',
      firstName: 'Victor',
      lastName: 'Stone',
      fullName: 'Victor Stone',
      criticality: PatientCriticality.HIGH,
      nextVisit: null,
    },

// ============================================================================
// NEED ATTENTION + OVERDUE (6 patients - IDs 34-39)
// ============================================================================
    {
      id: '34',
      firstName: 'Diana',
      lastName: 'Cross',
      fullName: 'Diana Cross',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0)),
    },
    {
      id: '35',
      firstName: 'Marcus',
      lastName: 'Webb',
      fullName: 'Marcus Webb',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).setHours(10, 0, 0, 0)),
    },
    {
      id: '36',
      firstName: 'Elena',
      lastName: 'Drake',
      fullName: 'Elena Drake',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).setHours(11, 0, 0, 0)),
    },
    {
      id: '37',
      firstName: 'Julian',
      lastName: 'Marsh',
      fullName: 'Julian Marsh',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).setHours(14, 0, 0, 0)),
    },
    {
      id: '38',
      firstName: 'Rosa',
      lastName: 'Frost',
      fullName: 'Rosa Frost',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: new Date(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(9, 30, 0, 0)),
    },
    {
      id: '39',
      firstName: 'Theo',
      lastName: 'Barker',
      fullName: 'Theo Barker',
      criticality: PatientCriticality.LOW,
      nextVisit: new Date(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).setHours(15, 0, 0, 0)),
    },

// ============================================================================
// OVERDUE ONLY (4 patients - IDs 40-43)
// ============================================================================
    {
      id: '40',
      firstName: 'Chloe',
      lastName: 'Horton',
      fullName: 'Chloe Horton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).setHours(10, 0, 0, 0)),
    },
    {
      id: '41',
      firstName: 'Owen',
      lastName: 'Dalton',
      fullName: 'Owen Dalton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).setHours(11, 0, 0, 0)),
    },
    {
      id: '42',
      firstName: 'Stella',
      lastName: 'Payne',
      fullName: 'Stella Payne',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).setHours(13, 0, 0, 0)),
    },
    {
      id: '43',
      firstName: 'Finn',
      lastName: 'Sutton',
      fullName: 'Finn Sutton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).setHours(14, 30, 0, 0)),
    },

// ============================================================================
// NEED ATTENTION + TODAY (3 patients - IDs 44-46)
// ============================================================================
    {
      id: '44',
      firstName: 'Vera',
      lastName: 'Cannon',
      fullName: 'Vera Cannon',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date().setHours(8, 0, 0, 0)),
    },
    {
      id: '45',
      firstName: 'Rex',
      lastName: 'Doyle',
      fullName: 'Rex Doyle',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date().setHours(11, 30, 0, 0)),
    },
    {
      id: '46',
      firstName: 'Iris',
      lastName: 'Forde',
      fullName: 'Iris Forde',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: new Date(new Date().setHours(15, 0, 0, 0)),
    },

// ============================================================================
// TODAY ONLY (10 patients - IDs 1, 47-56)
// ============================================================================
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date().setHours(10, 0, 0, 0)),
    },
    {
      id: '47',
      firstName: 'Miles',
      lastName: 'Garrett',
      fullName: 'Miles Garrett',
      criticality: null,
      nextVisit: new Date(new Date().setHours(7, 30, 0, 0)),
    },
    {
      id: '48',
      firstName: 'Penny',
      lastName: 'Haines',
      fullName: 'Penny Haines',
      criticality: null,
      nextVisit: new Date(new Date().setHours(8, 45, 0, 0)),
    },
    {
      id: '49',
      firstName: 'Caleb',
      lastName: 'Ingram',
      fullName: 'Caleb Ingram',
      criticality: null,
      nextVisit: new Date(new Date().setHours(9, 15, 0, 0)),
    },
    {
      id: '50',
      firstName: 'Hazel',
      lastName: 'Jennings',
      fullName: 'Hazel Jennings',
      criticality: null,
      nextVisit: new Date(new Date().setHours(10, 0, 0, 0)),
    },
    {
      id: '51',
      firstName: 'Eli',
      lastName: 'Keane',
      fullName: 'Eli Keane',
      criticality: null,
      nextVisit: new Date(new Date().setHours(10, 45, 0, 0)),
    },
    {
      id: '52',
      firstName: 'Matilda',
      lastName: 'Lawson',
      fullName: 'Matilda Lawson',
      criticality: null,
      nextVisit: new Date(new Date().setHours(11, 30, 0, 0)),
    },
    {
      id: '53',
      firstName: 'Seth',
      lastName: 'Morton',
      fullName: 'Seth Morton',
      criticality: null,
      nextVisit: new Date(new Date().setHours(13, 0, 0, 0)),
    },
    {
      id: '54',
      firstName: 'Ivy',
      lastName: 'Nash',
      fullName: 'Ivy Nash',
      criticality: null,
      nextVisit: new Date(new Date().setHours(14, 15, 0, 0)),
    },
    {
      id: '55',
      firstName: 'Cole',
      lastName: 'Osborne',
      fullName: 'Cole Osborne',
      criticality: null,
      nextVisit: new Date(new Date().setHours(15, 30, 0, 0)),
    },
    {
      id: '56',
      firstName: 'Luna',
      lastName: 'Preston',
      fullName: 'Luna Preston',
      criticality: null,
      nextVisit: new Date(new Date().setHours(16, 45, 0, 0)),
    },

// ============================================================================
// NEED ATTENTION + TOMORROW (5 patients - IDs 57-61)
// ============================================================================
    {
      id: '57',
      firstName: 'Beau',
      lastName: 'Quinn',
      fullName: 'Beau Quinn',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0)),
    },
    {
      id: '58',
      firstName: 'Wren',
      lastName: 'Rhodes',
      fullName: 'Wren Rhodes',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(10, 30, 0, 0)),
    },
    {
      id: '59',
      firstName: 'Jasper',
      lastName: 'Savage',
      fullName: 'Jasper Savage',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(13, 0, 0, 0)),
    },
    {
      id: '60',
      firstName: 'Opal',
      lastName: 'Tanner',
      fullName: 'Opal Tanner',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(14, 45, 0, 0)),
    },
    {
      id: '61',
      firstName: 'Reid',
      lastName: 'Underwood',
      fullName: 'Reid Underwood',
      criticality: PatientCriticality.LOW,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(16, 0, 0, 0)),
    },

// ============================================================================
// TOMORROW ONLY (9 patients - IDs 2, 62-70)
// ============================================================================
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(14, 0, 0, 0)),
    },
    {
      id: '62',
      firstName: 'Sage',
      lastName: 'Vance',
      fullName: 'Sage Vance',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(8, 0, 0, 0)),
    },
    {
      id: '63',
      firstName: 'Troy',
      lastName: 'Wade',
      fullName: 'Troy Wade',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(9, 15, 0, 0)),
    },
    {
      id: '64',
      firstName: 'Jade',
      lastName: 'Xavier',
      fullName: 'Jade Xavier',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(10, 0, 0, 0)),
    },
    {
      id: '65',
      firstName: 'Cole',
      lastName: 'Yates',
      fullName: 'Cole Yates',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(11, 30, 0, 0)),
    },
    {
      id: '66',
      firstName: 'Dawn',
      lastName: 'Zimmerman',
      fullName: 'Dawn Zimmerman',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(13, 0, 0, 0)),
    },
    {
      id: '67',
      firstName: 'Blake',
      lastName: 'Ashford',
      fullName: 'Blake Ashford',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(14, 0, 0, 0)),
    },
    {
      id: '68',
      firstName: 'Faye',
      lastName: 'Bolton',
      fullName: 'Faye Bolton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(15, 15, 0, 0)),
    },
    {
      id: '69',
      firstName: 'Gene',
      lastName: 'Compton',
      fullName: 'Gene Compton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(16, 0, 0, 0)),
    },
    {
      id: '70',
      firstName: 'Hope',
      lastName: 'Dalton',
      fullName: 'Hope Dalton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).setHours(17, 0, 0, 0)),
    },

// ============================================================================
// NEED ATTENTION + RANDOM FUTURE (8 patients - IDs 71-78)
// ============================================================================
    {
      id: '71',
      firstName: 'Ivan',
      lastName: 'Everett',
      fullName: 'Ivan Everett',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0)),
    },
    {
      id: '72',
      firstName: 'Juno',
      lastName: 'Fitzgerald',
      fullName: 'Juno Fitzgerald',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).setHours(10, 0, 0, 0)),
    },
    {
      id: '73',
      firstName: 'Kurt',
      lastName: 'Goodwin',
      fullName: 'Kurt Goodwin',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).setHours(11, 0, 0, 0)),
    },
    {
      id: '74',
      firstName: 'Leah',
      lastName: 'Hayward',
      fullName: 'Leah Hayward',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).setHours(13, 30, 0, 0)),
    },
    {
      id: '75',
      firstName: 'Milo',
      lastName: 'Irving',
      fullName: 'Milo Irving',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: new Date(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).setHours(9, 45, 0, 0)),
    },
    {
      id: '76',
      firstName: 'Nina',
      lastName: 'Jenkinson',
      fullName: 'Nina Jenkinson',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).setHours(14, 0, 0, 0)),
    },
    {
      id: '77',
      firstName: 'Otto',
      lastName: 'Kirkland',
      fullName: 'Otto Kirkland',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: new Date(new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).setHours(10, 30, 0, 0)),
    },
    {
      id: '78',
      firstName: 'Pia',
      lastName: 'Langford',
      fullName: 'Pia Langford',
      criticality: PatientCriticality.LOW,
      nextVisit: new Date(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).setHours(15, 0, 0, 0)),
    },

// ============================================================================
// RANDOM FUTURE ONLY (12 patients - IDs 3, 4, 5, 79-90)
// ============================================================================
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      fullName: 'Bob Johnson',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: new Date(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0)),
    },
    {
      id: '4',
      firstName: 'Alice',
      lastName: 'Williams',
      fullName: 'Alice Williams',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).setHours(15, 30, 0, 0)),
    },
    {
      id: '5',
      firstName: 'Charlie',
      lastName: 'Brown',
      fullName: 'Charlie Brown',
      criticality: PatientCriticality.LOW,
      nextVisit: new Date(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).setHours(11, 0, 0, 0)),
    },
    {
      id: '79',
      firstName: 'Quinn',
      lastName: 'Mercer',
      fullName: 'Quinn Mercer',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).setHours(8, 30, 0, 0)),
    },
    {
      id: '80',
      firstName: 'Rose',
      lastName: 'Neville',
      fullName: 'Rose Neville',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0)),
    },
    {
      id: '81',
      firstName: 'Sam',
      lastName: 'Ogden',
      fullName: 'Sam Ogden',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).setHours(10, 15, 0, 0)),
    },
    {
      id: '82',
      firstName: 'Tara',
      lastName: 'Pemberton',
      fullName: 'Tara Pemberton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).setHours(11, 0, 0, 0)),
    },
    {
      id: '83',
      firstName: 'Uma',
      lastName: 'Quigley',
      fullName: 'Uma Quigley',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).setHours(13, 30, 0, 0)),
    },
    {
      id: '84',
      firstName: 'Wade',
      lastName: 'Ramsey',
      fullName: 'Wade Ramsey',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).setHours(14, 0, 0, 0)),
    },
    {
      id: '85',
      firstName: 'Xena',
      lastName: 'Shelton',
      fullName: 'Xena Shelton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).setHours(15, 0, 0, 0)),
    },
    {
      id: '86',
      firstName: 'Yale',
      lastName: 'Thornton',
      fullName: 'Yale Thornton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).setHours(9, 30, 0, 0)),
    },
    {
      id: '87',
      firstName: 'Zara',
      lastName: 'Upton',
      fullName: 'Zara Upton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).setHours(10, 0, 0, 0)),
    },
    {
      id: '88',
      firstName: 'Abel',
      lastName: 'Vickers',
      fullName: 'Abel Vickers',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).setHours(11, 30, 0, 0)),
    },
    {
      id: '89',
      firstName: 'Beth',
      lastName: 'Walton',
      fullName: 'Beth Walton',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).setHours(13, 0, 0, 0)),
    },
    {
      id: '90',
      firstName: 'Cora',
      lastName: 'Xenon',
      fullName: 'Cora Xenon',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).setHours(16, 0, 0, 0)),
    },

// ============================================================================
// NEED ATTENTION + UPCOMING VISIT - OLDER DATA (6 patients - IDs 6-11)
// ============================================================================
    {
      id: '6',
      firstName: 'Sarah',
      lastName: 'Johnson',
      fullName: 'Sarah Johnson',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0)),
    },
    {
      id: '7',
      firstName: 'Michael',
      lastName: 'Chen',
      fullName: 'Michael Chen',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).setHours(21, 0, 0, 0)),
    },
    {
      id: '8',
      firstName: 'Emma',
      lastName: 'Williams',
      fullName: 'Emma Williams',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).setHours(14, 30, 0, 0)),
    },
    {
      id: '9',
      firstName: 'David',
      lastName: 'Nguyen',
      fullName: 'David Nguyen',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(10, 15, 0, 0)),
    },
    {
      id: '10',
      firstName: 'Priya',
      lastName: 'Patel',
      fullName: 'Priya Patel',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: new Date(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).setHours(16, 45, 0, 0)),
    },
    {
      id: '11',
      firstName: 'Robert',
      lastName: 'King',
      fullName: 'Robert King',
      criticality: PatientCriticality.LOW,
      nextVisit: new Date(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).setHours(11, 30, 0, 0)),
    },

// ============================================================================
// OVERDUE ONLY - OLDER DATA (6 patients - IDs 16-21)
// ============================================================================
    {
      id: '16',
      firstName: 'Anna',
      lastName: 'Lopez',
      fullName: 'Anna Lopez',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).setHours(14, 30, 0, 0)),
    },
    {
      id: '17',
      firstName: 'Mark',
      lastName: 'Lee',
      fullName: 'Mark Lee',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).setHours(16, 0, 0, 0)),
    },
    {
      id: '18',
      firstName: 'Zoe',
      lastName: 'Adams',
      fullName: 'Zoe Adams',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).setHours(8, 15, 0, 0)),
    },
    {
      id: '19',
      firstName: 'James',
      lastName: 'Stewart',
      fullName: 'James Stewart',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).setHours(9, 45, 0, 0)),
    },
    {
      id: '20',
      firstName: 'Mia',
      lastName: 'Carter',
      fullName: 'Mia Carter',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(13, 0, 0, 0)),
    },
    {
      id: '21',
      firstName: 'Ethan',
      lastName: 'Turner',
      fullName: 'Ethan Turner',
      criticality: null,
      nextVisit: new Date(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).setHours(15, 15, 0, 0)),
    },
  ];

  allPatients() {
    return this.patients;
  }

  needingAttentionSorted() {
    return [...this.patients]
      .filter(p => p.criticality !== null)
      .sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.criticality] - order[b.criticality];
      });
  }

  topNeedingAttention(n) {
    return this.needingAttentionSorted().slice(0, n);
  }

  upcomingVisitsSorted() {
    return [...this.patients]
      .filter(p => p.nextVisit !== null)
      .sort((a, b) => 
        a.nextVisit.getTime() - b.nextVisit.getTime()
      );
  }

  topUpcomingVisits(n) {
    return this.upcomingVisitsSorted().slice(0, n);
  }
}

export const patientsRepository = new PatientsRepository();

// Helper functions
export const getCriticalityText = (criticality) => {
  switch (criticality) {
    case PatientCriticality.CRITICAL: return 'Critical';
    case PatientCriticality.HIGH: return 'High';
    case PatientCriticality.MEDIUM: return 'Medium';
    case PatientCriticality.LOW: return 'Low';
    default: return '—';
  }
};

export const getCriticalityTag = (criticality) => {
  switch (criticality) {
    case PatientCriticality.CRITICAL: return 'CRITICAL';
    case PatientCriticality.HIGH: return 'HIGH';
    case PatientCriticality.MEDIUM: return 'MED';
    case PatientCriticality.LOW: return 'LOW';
    default: return null;
  }
};

export const getCriticalityColor = (criticality) => {
  switch (criticality) {
    case PatientCriticality.CRITICAL: return '#ef4444';
    case PatientCriticality.HIGH: return '#f97316';
    case PatientCriticality.MEDIUM: return '#64748b';
    case PatientCriticality.LOW: return '#10b981';
    default: return '#6b7280';
  }
};
