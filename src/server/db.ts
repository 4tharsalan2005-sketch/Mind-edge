import fs from 'fs';
import path from 'path';
import { SyllabusBook, Paper, Quiz, GradeLevel } from '../types.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

interface DatabaseSchema {
  books: SyllabusBook[];
  papers: Paper[];
  quizzes: Quiz[];
}

const initialSeedData: DatabaseSchema = {
  books: [
    // Grade 6: 2 books (AT MAXIMUM CAPACITY to immediately test/demonstrate the 2-book limit rule!)
    {
      id: 'book-g6-part1',
      grade: 6,
      medium: 'English',
      subject: 'Islamic Studies & Arabic',
      title: 'Islamic Studies - Grade 6 (Part 1)',
      part: 1,
      author: 'Ministry of Education & Religious Curriculum Dept',
      edition: 'National Curriculum Standard Edition',
      pages: 142,
      fileSize: '14.8 MB',
      downloadUrl: '#',
      summary: 'Comprehensive foundation covering Iman, fundamental beliefs, purification principles, and character excellence for Grade 6 learners.',
      chapters: [
        'Chapter 1: The Core Articles of Faith (Iman)',
        'Chapter 2: Etiquettes of Daily Remembrance and Supplications',
        'Chapter 3: Taharah - Understanding Water Categories & Minor Impurities',
        'Chapter 4: The Pillars of Moral Excellence (Akhlaq Hasanah)',
        'Chapter 5: Early Childhood of Prophet Muhammad (PBUH) in Makkah'
      ],
      createdAt: '2024-01-15T08:00:00.000Z'
    },
    {
      id: 'book-g6-part2',
      grade: 6,
      medium: 'English',
      subject: 'Islamic Studies & Arabic',
      title: 'Islamic Studies - Grade 6 (Part 2)',
      part: 2,
      author: 'Ministry of Education & Religious Curriculum Dept',
      edition: 'National Curriculum Standard Edition',
      pages: 156,
      fileSize: '16.2 MB',
      downloadUrl: '#',
      summary: 'Continuation covering Salah in congregation, Ramadan fasts, family ethics, and historical milestones of the early Islamic community.',
      chapters: [
        'Chapter 6: Conditions and Nullifiers of Salat',
        'Chapter 7: Congregational Prayer and Friday Gathering (Jumuah)',
        'Chapter 8: Ramadan and the Ethics of Self-Discipline',
        'Chapter 9: The First Emigration to Abyssinia (Habasha)',
        'Chapter 10: Environmental Stewardship and Kindness to Living Beings'
      ],
      createdAt: '2024-01-15T08:00:00.000Z'
    },

    // Grade 7: 1 book (1 slot available - admin can test adding the 2nd book successfully, and then adding a 3rd will trigger validation block)
    {
      id: 'book-g7-part1',
      grade: 7,
      medium: 'English',
      subject: 'Islamic Studies & Jurisprudence',
      title: 'Islamic Studies - Grade 7 (Volume 1)',
      part: 1,
      author: 'Department of Educational Publications',
      edition: 'Standard Revised Edition',
      pages: 168,
      fileSize: '18.1 MB',
      downloadUrl: '#',
      summary: 'In-depth exploration of jurisprudence rules, societal contracts, civil etiquette, and the biography of the Prophet during the Madinah era.',
      chapters: [
        'Unit 1: The Divine Attributes and Human Responsibility',
        'Unit 2: Fiqh of Zakat - Calculation and Eligible Recipients',
        'Unit 3: The Hijrah to Yathrib (Madinah) and the Constitution',
        'Unit 4: Honesty in Commercial Trades and School Conduct',
        'Unit 5: Rights of Neighbors, Teachers, and Relatives'
      ],
      createdAt: '2024-02-10T09:30:00.000Z'
    },

    // Grade 8: 2 books (AT MAXIMUM CAPACITY)
    {
      id: 'book-g8-part1',
      grade: 8,
      medium: 'English',
      subject: 'Comparative Religion & Islamic Culture',
      title: 'Islamic Studies - Grade 8 (Part 1: Ethics & Law)',
      part: 1,
      author: 'National Institute of Education',
      edition: 'Second Print 2024',
      pages: 184,
      fileSize: '21.4 MB',
      downloadUrl: '#',
      summary: 'Systematic overview of Islamic legal terminology, principles of justice, and peacebuilding.',
      chapters: [
        'Chapter 1: The Methodology of Islamic Legal Rulings (Fiqh)',
        'Chapter 2: The Battle of Badr and the Lessons of Consultation (Shura)',
        'Chapter 3: The Treaties of Hudaybiyyah and Diplomatic Integrity',
        'Chapter 4: Digital Ethics, Cyber Etiquettes, and Avoiding Gossip'
      ],
      createdAt: '2024-03-01T10:00:00.000Z'
    },
    {
      id: 'book-g8-part2',
      grade: 8,
      medium: 'English',
      subject: 'Comparative Religion & Islamic Culture',
      title: 'Islamic Studies - Grade 8 (Part 2: Society & Civilization)',
      part: 2,
      author: 'National Institute of Education',
      edition: 'Second Print 2024',
      pages: 172,
      fileSize: '19.8 MB',
      downloadUrl: '#',
      summary: 'Focuses on civilizational contributions, sciences, architecture, and contemporary moral dilemmas.',
      chapters: [
        'Chapter 5: Golden Age of Scholarship in Medicine and Astronomy',
        'Chapter 6: Guardianship of Public Property and Anti-Corruption',
        'Chapter 7: Bioethics and Respect for Human Life',
        'Chapter 8: Farewell Pilgrimage and Universal Human Dignity'
      ],
      createdAt: '2024-03-01T10:00:00.000Z'
    },

    // Grade 9: 1 book (1 slot available)
    {
      id: 'book-g9-part1',
      grade: 9,
      medium: 'English',
      subject: 'Advanced Islamic Thought & Hermeneutics',
      title: 'Islamic Studies - Grade 9 (Comprehensive Textbook)',
      part: 1,
      author: 'Ministry of Education Board of Textbooks',
      edition: 'National Exam Preparation Edition',
      pages: 210,
      fileSize: '24.5 MB',
      downloadUrl: '#',
      summary: 'Comprehensive Grade 9 textbook preparing secondary students for national competitive examinations.',
      chapters: [
        'Module 1: Usul al-Fiqh: Primary and Secondary Sources of Legislation',
        'Module 2: The Conquest of Makkah and General Amnesty Principles',
        'Module 3: Leadership of the Rightly Guided Caliphs (Khulafa Rashidun)',
        'Module 4: Contemporary Financial Ethics and Modern Banking Rulings',
        'Module 5: Global Citizenship, Tolerance, and Interfaith Harmony'
      ],
      createdAt: '2024-04-12T11:15:00.000Z'
    }
  ],

  papers: [
    // Model Papers
    {
      id: 'paper-m-g6-t1',
      grade: 6,
      medium: 'English',
      category: 'model',
      subject: 'Islamic Studies',
      title: 'Grade 6 First Term Model Evaluation Paper',
      year: 2025,
      term: 'Term 1',
      durationMinutes: 90,
      totalMarks: 100,
      fileSize: '2.4 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2025-01-10T08:00:00.000Z'
    },
    {
      id: 'paper-m-g6-t2',
      grade: 6,
      medium: 'English',
      category: 'model',
      subject: 'Islamic Studies',
      title: 'Grade 6 Mid-Year Model Examination Paper',
      year: 2025,
      term: 'Term 2',
      durationMinutes: 90,
      totalMarks: 100,
      fileSize: '2.8 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2025-05-18T08:00:00.000Z'
    },
    {
      id: 'paper-m-g7-t1',
      grade: 7,
      medium: 'English',
      category: 'model',
      subject: 'Islamic Studies',
      title: 'Grade 7 Comprehensive Model Assessment',
      year: 2025,
      term: 'Term 1',
      durationMinutes: 120,
      totalMarks: 100,
      fileSize: '3.1 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2025-02-01T08:00:00.000Z'
    },
    {
      id: 'paper-m-g8-t1',
      grade: 8,
      medium: 'English',
      category: 'model',
      subject: 'Islamic Studies',
      title: 'Grade 8 Model Paper - Standard Curriculum Benchmarking',
      year: 2025,
      term: 'Term 1',
      durationMinutes: 120,
      totalMarks: 100,
      fileSize: '3.4 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2025-02-14T08:00:00.000Z'
    },
    {
      id: 'paper-m-g9-annual',
      grade: 9,
      medium: 'English',
      category: 'model',
      subject: 'Islamic Studies',
      title: 'Grade 9 Pre-Board National Model Paper',
      year: 2025,
      term: 'Annual',
      durationMinutes: 150,
      totalMarks: 100,
      fileSize: '4.2 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2025-06-20T08:00:00.000Z'
    },

    // Past Papers: Intermediate (READY)
    {
      id: 'paper-p-g6-inter-2024',
      grade: 6,
      medium: 'English',
      category: 'past_intermediate',
      subject: 'Islamic Studies',
      title: 'Grade 6 Provincial Intermediate Past Paper 2024',
      year: 2024,
      term: 'Mid-Year',
      durationMinutes: 90,
      totalMarks: 100,
      fileSize: '3.6 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2024-07-15T08:00:00.000Z'
    },
    {
      id: 'paper-p-g6-inter-2023',
      grade: 6,
      medium: 'English',
      category: 'past_intermediate',
      subject: 'Islamic Studies',
      title: 'Grade 6 Provincial Intermediate Past Paper 2023',
      year: 2023,
      term: 'Mid-Year',
      durationMinutes: 90,
      totalMarks: 100,
      fileSize: '3.2 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2023-07-20T08:00:00.000Z'
    },
    {
      id: 'paper-p-g7-inter-2024',
      grade: 7,
      medium: 'English',
      category: 'past_intermediate',
      subject: 'Islamic Studies',
      title: 'Grade 7 Zonal Intermediate Past Paper 2024',
      year: 2024,
      term: 'Mid-Year',
      durationMinutes: 120,
      totalMarks: 100,
      fileSize: '3.8 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2024-07-18T08:00:00.000Z'
    },
    {
      id: 'paper-p-g8-inter-2024',
      grade: 8,
      medium: 'English',
      category: 'past_intermediate',
      subject: 'Islamic Studies',
      title: 'Grade 8 Intermediate Past Examination Paper 2024',
      year: 2024,
      term: 'Mid-Year',
      durationMinutes: 120,
      totalMarks: 100,
      fileSize: '4.1 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2024-08-01T08:00:00.000Z'
    },
    {
      id: 'paper-p-g9-inter-2024',
      grade: 9,
      medium: 'English',
      category: 'past_intermediate',
      subject: 'Islamic Studies',
      title: 'Grade 9 Intermediate National Benchmark Paper 2024',
      year: 2024,
      term: 'Mid-Year',
      durationMinutes: 150,
      totalMarks: 100,
      fileSize: '4.5 MB',
      status: 'ready',
      downloadUrl: '#',
      answerKeyUrl: '#',
      createdAt: '2024-08-10T08:00:00.000Z'
    },

    // Past Papers: Final (COMING SOON)
    {
      id: 'paper-p-g6-final',
      grade: 6,
      medium: 'English',
      category: 'past_final',
      subject: 'Islamic Studies',
      title: 'Grade 6 Annual Final Assessment Series (2020-2024)',
      year: 2024,
      term: 'Annual',
      durationMinutes: 120,
      totalMarks: 100,
      fileSize: '5.2 MB',
      status: 'coming_soon',
      createdAt: '2025-01-01T08:00:00.000Z'
    },
    {
      id: 'paper-p-g7-final',
      grade: 7,
      medium: 'English',
      category: 'past_final',
      subject: 'Islamic Studies',
      title: 'Grade 7 Annual Final Assessment Series (2020-2024)',
      year: 2024,
      term: 'Annual',
      durationMinutes: 120,
      totalMarks: 100,
      fileSize: '5.8 MB',
      status: 'coming_soon',
      createdAt: '2025-01-01T08:00:00.000Z'
    },
    {
      id: 'paper-p-g8-final',
      grade: 8,
      medium: 'English',
      category: 'past_final',
      subject: 'Islamic Studies',
      title: 'Grade 8 Annual Final Examination Archives',
      year: 2024,
      term: 'Annual',
      durationMinutes: 150,
      totalMarks: 100,
      fileSize: '6.1 MB',
      status: 'coming_soon',
      createdAt: '2025-01-01T08:00:00.000Z'
    },
    {
      id: 'paper-p-g9-final',
      grade: 9,
      medium: 'English',
      category: 'past_final',
      subject: 'Islamic Studies',
      title: 'Grade 9 Final Board Examination Papers & Rubrics',
      year: 2024,
      term: 'Annual',
      durationMinutes: 180,
      totalMarks: 100,
      fileSize: '7.4 MB',
      status: 'coming_soon',
      createdAt: '2025-01-01T08:00:00.000Z'
    },

    // Past Papers: Dharmachari (COMING SOON)
    {
      id: 'paper-p-g6-dharmachari',
      grade: 6,
      medium: 'English',
      category: 'past_dharmachari',
      subject: 'Moral Studies & Dharmachari Curriculum',
      title: 'Grade 6 Dharmachari Moral Examination Archives',
      year: 2024,
      term: 'Annual',
      durationMinutes: 90,
      totalMarks: 100,
      fileSize: '3.0 MB',
      status: 'coming_soon',
      createdAt: '2025-01-01T08:00:00.000Z'
    },
    {
      id: 'paper-p-g7-dharmachari',
      grade: 7,
      medium: 'English',
      category: 'past_dharmachari',
      subject: 'Moral Studies & Dharmachari Curriculum',
      title: 'Grade 7 Dharmachari Ethics Series',
      year: 2024,
      term: 'Annual',
      durationMinutes: 90,
      totalMarks: 100,
      fileSize: '3.5 MB',
      status: 'coming_soon',
      createdAt: '2025-01-01T08:00:00.000Z'
    },
    {
      id: 'paper-p-g8-dharmachari',
      grade: 8,
      medium: 'English',
      category: 'past_dharmachari',
      subject: 'Moral Studies & Dharmachari Curriculum',
      title: 'Grade 8 Dharmachari Value Assessment Papers',
      year: 2024,
      term: 'Annual',
      durationMinutes: 120,
      totalMarks: 100,
      fileSize: '4.0 MB',
      status: 'coming_soon',
      createdAt: '2025-01-01T08:00:00.000Z'
    },
    {
      id: 'paper-p-g9-dharmachari',
      grade: 9,
      medium: 'English',
      category: 'past_dharmachari',
      subject: 'Moral Studies & Dharmachari Curriculum',
      title: 'Grade 9 Dharmachari Certificate Examination Archives',
      year: 2024,
      term: 'Annual',
      durationMinutes: 120,
      totalMarks: 100,
      fileSize: '4.6 MB',
      status: 'coming_soon',
      createdAt: '2025-01-01T08:00:00.000Z'
    }
  ],

  quizzes: [
    // --- AKHLAQ QUIZZES ---
    {
      id: 'quiz-akhlaq-g6-1',
      grade: 6,
      medium: 'English',
      subject: 'Akhlaq',
      title: 'Akhlaq Mastery: Truthfulness, Trust & Everyday Integrity',
      description: 'Test your understanding of core ethical virtues (Sidq, Amanah), honesty with parents, and keeping promises in school life.',
      timeLimitMinutes: 10,
      questions: [
        {
          id: 'q-a1',
          question: 'What is the Islamic term for absolute honesty in speech and conviction?',
          options: ['Amanah (Trustworthiness)', 'Sidq (Truthfulness)', 'Sabr (Patience)', 'Shukr (Gratitude)'],
          correctAnswerIndex: 1,
          explanation: 'Sidq denotes truthfulness in words, actions, and internal intentions, regarded as a cornerstone of prophetic character.'
        },
        {
          id: 'q-a2',
          question: 'When a classmate entrusts you with personal stationery or confidential study notes, which moral duty are you upholding?',
          options: ['Hilm (Gentleness)', 'Amanah (Custodianship of Trust)', 'Zuhd (Asceticism)', 'Tawakkul (Reliance)'],
          correctAnswerIndex: 1,
          explanation: 'Amanah means preserving whatever trusts or responsibilities have been placed in your care without betrayal or misuse.'
        },
        {
          id: 'q-a3',
          question: 'According to prophetic teachings, how should a believer respond when treated harshly or insulted by another person?',
          options: [
            'Retaliate with double the harshness',
            'Respond with patience (Sabr) and dignified calm words',
            'Boycott the entire community permanently',
            'Pretend nothing happened while holding resentment'
          ],
          correctAnswerIndex: 1,
          explanation: 'Restraint and meeting harshness with gracious composure (Ihsan and Sabr) extinguishes animosity and builds nobility.'
        },
        {
          id: 'q-a4',
          question: 'What is the primary spiritual reason for removing harmful objects (e.g., glass, stones, thorns) from a public pathway?',
          options: [
            'To gain recognition from school prefects',
            'It is recognized as a branch of Faith (Iman) and charity (Sadaqah)',
            'To satisfy municipal regulations',
            'To avoid physical exercise'
          ],
          correctAnswerIndex: 1,
          explanation: 'The Prophet (PBUH) stated that removing harm from the path is among the branches of faith and counts as an act of charity.'
        },
        {
          id: 'q-a5',
          question: 'Which of the following describes Birr al-Walidayn (Devotion to Parents)?',
          options: [
            'Obeying them only when their requests match your personal hobbies',
            'Speaking to them with honor, gentle tone, and serving their needs with empathy',
            'Ignoring them during disagreements',
            'Communicating with them only through text messages'
          ],
          correctAnswerIndex: 1,
          explanation: 'Birr al-Walidayn is a supreme duty commanding honor, humility, gentle speech, and continuous care for mother and father.'
        }
      ],
      createdAt: '2025-01-10T10:00:00.000Z'
    },
    {
      id: 'quiz-akhlaq-g7-1',
      grade: 7,
      medium: 'English',
      subject: 'Akhlaq',
      title: 'Akhlaq & Social Responsibility: Rights of Neighbors & Digital Etiquette',
      description: 'Explore ethics regarding neighbors, community rights, speech discipline, and avoiding slander on digital networks.',
      timeLimitMinutes: 12,
      questions: [
        {
          id: 'q-a6',
          question: 'What is the ruling regarding the privacy of neighbors and peers in Islamic social ethics?',
          options: [
            'Peeking into private properties is permitted if curious',
            'Tajassus (spying/snooping into private affairs) is strictly forbidden',
            'Privacy only applies during nighttime hours',
            'Neighbors have no expectation of privacy in neighborhoods'
          ],
          correctAnswerIndex: 1,
          explanation: 'The Quran explicitly commands: "Do not spy on one another" (Surah Al-Hujurat 49:12), protecting personal sanctuary.'
        },
        {
          id: 'q-a7',
          question: 'What is Ghibah (Backbiting) as defined by the Prophet (PBUH)?',
          options: [
            'Speaking ill of someone in their presence',
            'Mentioning something about your brother/sister in their absence that they would dislike',
            'Reporting a factual emergency to authorities',
            'Complimenting someone publicly'
          ],
          correctAnswerIndex: 1,
          explanation: 'Ghibah is mentioning a fellow human behind their back with attributes or statements they would be displeased with.'
        },
        {
          id: 'q-a8',
          question: 'When using social media or group messaging, what responsibility does a student bear before forwarding information?',
          options: [
            'Forward it immediately if it sounds dramatic',
            'Tabayyun - rigorously verify authenticity and purpose before sharing',
            'Share without checking as long as others shared it',
            'Add personal exaggerations to increase engagement'
          ],
          correctAnswerIndex: 1,
          explanation: 'The principle of Tabayyun (investigation/verification) is mandatory to prevent circulating falsehoods and discord.'
        }
      ],
      createdAt: '2025-02-05T10:00:00.000Z'
    },

    // --- FIQH QUIZZES ---
    {
      id: 'quiz-fiqh-g6-1',
      grade: 6,
      medium: 'English',
      subject: 'Fiqh',
      title: 'Fiqh Essentials: Taharah (Purification) & Wudu Regulations',
      description: 'Master the prerequisites of purity, valid water classifications, obligatory acts of ablution (Faraid of Wudu), and its nullifiers.',
      timeLimitMinutes: 12,
      questions: [
        {
          id: 'q-f1',
          question: 'How many obligatory actions (Faraid) of Wudu are explicitly derived from Surah Al-Ma’idah (5:6)?',
          options: ['Three', 'Four', 'Six', 'Eight'],
          correctAnswerIndex: 1,
          explanation: 'The 4 canonical Faraid of Wudu are: washing face, washing arms including elbows, wiping head, and washing feet including ankles.'
        },
        {
          id: 'q-f2',
          question: 'Which type of water is classified as "Tahur" (pure and purifying) suitable for lifting ritual impurity?',
          options: [
            'Water whose color and taste have permanently changed with cooking broth',
            'Natural rainwater, well water, river, or sea water in its original condition',
            'Water mixed with chemical dye',
            'Used water that touched ritual contaminants'
          ],
          correctAnswerIndex: 1,
          explanation: 'Al-Ma’ al-Mutlaq (natural unconditional water like rain, snow, sea, or spring water) retains both purity and purifying power.'
        },
        {
          id: 'q-f3',
          question: 'Which of the following invalidates (nullifies) Wudu?',
          options: [
            'Reciting the Holy Quran from memory',
            'Falling into deep sleep where consciousness of surroundings is lost',
            'Drinking cold fresh water',
            'Clipping fingernails during daytime'
          ],
          correctAnswerIndex: 1,
          explanation: 'Deep slumber wherein one loses consciousness is a nullifier of Wudu as one cannot be certain of maintaining purity.'
        },
        {
          id: 'q-f4',
          question: 'What is Tayammum in Islamic jurisprudence?',
          options: [
            'A substitute dry ablution using clean earth/soil when water is unavailable or medically harmful',
            'A special prayer recited after sunset',
            'Washing only the feet without the face',
            'A ritual meal eaten before dawn'
          ],
          correctAnswerIndex: 0,
          explanation: 'Tayammum provides a divine dispensation using clean earth when water cannot be procured or poses verified physical injury.'
        },
        {
          id: 'q-f5',
          question: 'What is the condition of clothes (Thawb) required for valid Salat performance?',
          options: [
            'Must be made of imported silk for men',
            'Must be clean and free from physical impurities (Najasah) and cover the Awrah',
            'Must be brand new from a boutique',
            'Must have three distinct layers'
          ],
          correctAnswerIndex: 1,
          explanation: 'Salat requires Taharat ath-Thawb (cleanliness of garments free from Najasah) and proper coverage of the prescribed Awrah.'
        }
      ],
      createdAt: '2025-01-12T11:00:00.000Z'
    },
    {
      id: 'quiz-fiqh-g7-1',
      grade: 7,
      medium: 'English',
      subject: 'Fiqh',
      title: 'Fiqh of Salat: Pillars, Conditions & Congregational Rules',
      description: 'Differentiate between Shurut (conditions) and Arkan (pillars) of daily prayers, Sujud Sahw, and traveler dispensations.',
      timeLimitMinutes: 15,
      questions: [
        {
          id: 'q-f6',
          question: 'What is the critical difference between a Shart (condition) and a Rukn (pillar) of Salat?',
          options: [
            'There is no difference; they are exact synonyms',
            'A Shart must precede and remain throughout the prayer (e.g. Qiblah), whereas a Rukn is an integral internal action (e.g. Ruku)',
            'A Shart is optional while a Rukn is forbidden',
            'A Rukn can be substituted with money but a Shart cannot'
          ],
          correctAnswerIndex: 1,
          explanation: 'Conditions (Shurut) exist outside/before the act (like Wudu and Qiblah facing), while Pillars (Arkan) constitute its internal core.'
        },
        {
          id: 'q-f7',
          question: 'If a worshipper in prayer unintentionally misses a Sunnah Mu’akkadah act or doubts the number of Rak’ahs, what rectifies the error?',
          options: [
            'Abandoning the prayer and re-performing Wudu',
            'Performing Sujud as-Sahw (Prostrations of Forgetfulness)',
            'Paying immediate charity to a fellow worshipper',
            'Repeating the entire prayer three times'
          ],
          correctAnswerIndex: 1,
          explanation: 'Sujud as-Sahw is legislated by prophetic guidance to rectify omissions, doubts, or unintended minor additions in Salat.'
        },
        {
          id: 'q-f8',
          question: 'What is the ruling for Qasr (shortening prayers) during legitimate travel?',
          options: [
            '4-Rak’ah obligatory prayers (Dhuhr, Asr, Isha) are shortened to 2 Rak’ahs',
            'All prayers including Maghrib and Fajr are reduced to 1 Rak’ah',
            'Travelers are completely exempt from praying until returning home',
            'Only Friday prayer can be shortened'
          ],
          correctAnswerIndex: 0,
          explanation: 'Under traveler concessions (Rukhsah), the 4-Rak’ah Fard prayers are shortened to 2 Rak’ahs, while Maghrib (3) and Fajr (2) remain unchanged.'
        }
      ],
      createdAt: '2025-02-18T11:00:00.000Z'
    },

    // --- SEERAH QUIZZES ---
    {
      id: 'quiz-seerah-g6-1',
      grade: 6,
      medium: 'English',
      subject: 'Seerah',
      title: 'Seerah Chronology: Life in Makkah & The First Revelation',
      description: 'Trace the lineage of the Prophet (PBUH), the year of the Elephant, the Cave of Hira, and the early callers to Islam.',
      timeLimitMinutes: 10,
      questions: [
        {
          id: 'q-s1',
          question: 'Before receiving revelation, by which honorable titles was Prophet Muhammad (PBUH) universally known in Makkah?',
          options: [
            'Al-Amin (The Trustworthy) and As-Sadiq (The Truthful)',
            'Al-Hakim and Al-Qadi',
            'Al-Fatih and Al-Mansur',
            'The King of Quraysh'
          ],
          correctAnswerIndex: 0,
          explanation: 'Even before prophethood, his unimpeachable honesty led the Quraysh citizens to address him as As-Sadiq and Al-Amin.'
        },
        {
          id: 'q-s2',
          question: 'In which cave near Makkah did the Prophet (PBUH) engage in contemplative worship (Tahannuth) when revelation first descended?',
          options: ['Cave of Thawr', 'Cave of Hira on Jabal an-Nur', 'Cave of Uhud', 'Cave of Kahf'],
          correctAnswerIndex: 1,
          explanation: 'Archangel Jibril (Gabriel) appeared to the Prophet in the Cave of Hira located on Jabal an-Nur (Mount of Light).'
        },
        {
          id: 'q-s3',
          question: 'Which were the first five verses of the Holy Quran revealed to humanity?',
          options: [
            'Surah Al-Fatihah (1:1-5)',
            'Surah Al-Alaq (96:1-5) beginning with "Iqra\' bismi Rabbika alladhi khalaq"',
            'Surah Al-Baqarah (2:1-5)',
            'Surah Al-Ikhlas (112:1-4)'
          ],
          correctAnswerIndex: 1,
          explanation: '"Read! In the Name of your Lord Who created..." from Surah Al-Alaq constituted the dawn of divine revelation.'
        },
        {
          id: 'q-s4',
          question: 'Who was the first adult female to believe in the Prophet’s message and console him after the first revelation?',
          options: ['Aisha bint Abi Bakr', 'Khadijah bint Khuwaylid (RA)', 'Fatimah az-Zahra', 'Hafsah bint Umar'],
          correctAnswerIndex: 1,
          explanation: 'His noble wife Khadijah (RA) immediately believed in his prophethood, offering unwavering emotional and material support.'
        },
        {
          id: 'q-s5',
          question: 'Where did the early persecuted Muslims seek refuge during the first emigration (Hijrah) sanctioned by the Prophet?',
          options: ['Yemen', 'Abyssinia (Al-Habasha / Ethiopia) under King Negus (An-Najashi)', 'Constantinople', 'Damascus'],
          correctAnswerIndex: 1,
          explanation: 'The Prophet sent companions to Abyssinia, praising its Christian king An-Najashi as a ruler under whom no one was wronged.'
        }
      ],
      createdAt: '2025-01-20T12:00:00.000Z'
    },
    {
      id: 'quiz-seerah-g8-1',
      grade: 8,
      medium: 'English',
      subject: 'Seerah',
      title: 'Seerah in Madinah: The Constitution & Treaty of Hudaybiyyah',
      description: 'Analyze state-building in Madinah, the fraternal bond between Muhajirun and Ansar, and diplomatic triumphs.',
      timeLimitMinutes: 15,
      questions: [
        {
          id: 'q-s6',
          question: 'What was the foundational document established by the Prophet upon arriving in Madinah guaranteeing rights to all communities?',
          options: [
            'The Charter of Medina (Sahifat al-Madinah)',
            'The Code of Hammurabi',
            'The Treaty of Rome',
            'The Edict of Yathrib'
          ],
          correctAnswerIndex: 0,
          explanation: 'Sahifat al-Madinah established civic rights, joint defense, freedom of conscience, and rule of law across diverse communities.'
        },
        {
          id: 'q-s7',
          question: 'Why did the Quran characterize the Treaty of Hudaybiyyah as a "Manifest Victory" (Fathan Mubeena)?',
          options: [
            'Because large amounts of gold were captured',
            'It ended armed hostilities, created diplomatic recognition, and allowed peaceful dialogue that multiplied the community',
            'It allowed immediate entry into Roman trade routes',
            'It resulted in instant military surrender of enemies'
          ],
          correctAnswerIndex: 1,
          explanation: 'Peace allowed uninterrupted intellectual exchange, leading more people to accept the faith in two years than in the previous twenty.'
        },
        {
          id: 'q-s8',
          question: 'During the Conquest of Makkah (Fath Makkah), how did the Prophet (PBUH) treat those who had persecuted Muslims for two decades?',
          options: [
            'He ordered general imprisonment of all leaders',
            'He issued a general amnesty declaring: "Go, for you are the free ones" (Idh-habu fa-antum at-tulaqa\')',
            'He demanded all wealth be surrendered',
            'He dismantled the civilian dwellings'
          ],
          correctAnswerIndex: 1,
          explanation: 'In a historic demonstration of mercy, the Prophet granted general amnesty without revenge, echoing Prophet Yusuf’s words.'
        }
      ],
      createdAt: '2025-03-05T12:00:00.000Z'
    }
  ]
};

// Database state management with persistence
class MindEdgeDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.books && parsed.papers && parsed.quizzes) {
          return parsed;
        }
      }
      // If file doesn't exist or is invalid, persist initial seed
      this.persist(initialSeedData);
      return initialSeedData;
    } catch (err) {
      console.error('Error loading database file, falling back to seed data:', err);
      return initialSeedData;
    }
  }

  private persist(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // --- SQL-SEMANTIC QUERIES FOR BOOKS ---

  /**
   * Represents the exact query requested in the prompt:
   * "SELECT COUNT(*) FROM books WHERE grade = X"
   */
  public queryBooksCount(grade: GradeLevel): number {
    return this.data.books.filter((b) => Number(b.grade) === Number(grade)).length;
  }

  public getAllBooks(grade?: GradeLevel, medium?: string): SyllabusBook[] {
    return this.data.books.filter((b) => {
      if (grade && Number(b.grade) !== Number(grade)) return false;
      if (medium && b.medium.toLowerCase() !== medium.toLowerCase()) return false;
      return true;
    });
  }

  public getBookById(id: string): SyllabusBook | undefined {
    return this.data.books.find((b) => b.id === id);
  }

  /**
   * Enforces the strict hard cap validation:
   * "Syllabus Books (Strictly Limited): There is a hard cap of exactly 2 Syllabus Books allowed per grade.
   * Validation Rule: When the admin attempts to upload a new syllabus book, the backend must query
   * the books table (SELECT COUNT(*) FROM books WHERE grade = X). If the count is 2 or greater,
   * the backend must block the INSERT operation and return an error to the admin interface."
   */
  public insertBook(bookInput: Omit<SyllabusBook, 'id' | 'createdAt'>): { success: boolean; book?: SyllabusBook; error?: string; currentCount: number } {
    const grade = Number(bookInput.grade) as GradeLevel;

    // Execute: SELECT COUNT(*) FROM books WHERE grade = X
    const currentCount = this.queryBooksCount(grade);

    if (currentCount >= 2) {
      return {
        success: false,
        currentCount,
        error: `Validation Error: Maximum limit reached. Exactly 2 Syllabus Books are allowed per grade (Grade ${grade} already has ${currentCount} books registered). The INSERT operation was blocked to enforce curriculum standards. Please remove an existing book before adding a new one.`
      };
    }

    const newBook: SyllabusBook = {
      ...bookInput,
      id: `book-g${grade}-${Date.now()}`,
      grade,
      part: currentCount + 1,
      createdAt: new Date().toISOString()
    };

    this.data.books.push(newBook);
    this.persist(this.data);

    return {
      success: true,
      book: newBook,
      currentCount: currentCount + 1
    };
  }

  public deleteBook(id: string): { success: boolean; message: string; remainingForGrade?: number } {
    const book = this.data.books.find((b) => b.id === id);
    if (!book) {
      return { success: false, message: 'Book not found' };
    }

    const grade = book.grade;
    this.data.books = this.data.books.filter((b) => b.id !== id);
    this.persist(this.data);

    const remainingForGrade = this.queryBooksCount(grade);
    return {
      success: true,
      message: `Book "${book.title}" was removed successfully. Grade ${grade} now has ${remainingForGrade} / 2 books.`,
      remainingForGrade
    };
  }

  // --- PAPERS (UNLIMITED) ---
  public getAllPapers(grade?: GradeLevel, category?: string, medium?: string): Paper[] {
    return this.data.papers.filter((p) => {
      if (grade && Number(p.grade) !== Number(grade)) return false;
      if (category && p.category !== category) return false;
      if (medium && p.medium.toLowerCase() !== medium.toLowerCase()) return false;
      return true;
    });
  }

  public insertPaper(paperInput: Omit<Paper, 'id' | 'createdAt'>): Paper {
    const newPaper: Paper = {
      ...paperInput,
      id: `paper-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.papers.push(newPaper);
    this.persist(this.data);
    return newPaper;
  }

  public deletePaper(id: string): boolean {
    const prevLength = this.data.papers.length;
    this.data.papers = this.data.papers.filter((p) => p.id !== id);
    if (this.data.papers.length !== prevLength) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  // --- QUIZZES (UNLIMITED) ---
  public getAllQuizzes(grade?: GradeLevel, subject?: string, medium?: string): Quiz[] {
    return this.data.quizzes.filter((q) => {
      if (grade && Number(q.grade) !== Number(grade)) return false;
      if (subject && q.subject.toLowerCase() !== subject.toLowerCase()) return false;
      if (medium && q.medium.toLowerCase() !== medium.toLowerCase()) return false;
      return true;
    });
  }

  public getQuizById(id: string): Quiz | undefined {
    return this.data.quizzes.find((q) => q.id === id);
  }

  public insertQuiz(quizInput: Omit<Quiz, 'id' | 'createdAt'>): Quiz {
    const newQuiz: Quiz = {
      ...quizInput,
      id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.quizzes.push(newQuiz);
    this.persist(this.data);
    return newQuiz;
  }

  public deleteQuiz(id: string): boolean {
    const prevLength = this.data.quizzes.length;
    this.data.quizzes = this.data.quizzes.filter((q) => q.id !== id);
    if (this.data.quizzes.length !== prevLength) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  // Stats for Admin Overview
  public getStats() {
    const booksByGrade: Record<GradeLevel, number> = {
      6: this.queryBooksCount(6),
      7: this.queryBooksCount(7),
      8: this.queryBooksCount(8),
      9: this.queryBooksCount(9)
    };

    return {
      booksByGrade,
      totalBooks: this.data.books.length,
      totalPapers: this.data.papers.length,
      totalQuizzes: this.data.quizzes.length
    };
  }

  // Reset database back to seed data if requested
  public resetToSeed() {
    this.data = JSON.parse(JSON.stringify(initialSeedData));
    this.persist(this.data);
    return this.getStats();
  }
}

export const db = new MindEdgeDatabase();
