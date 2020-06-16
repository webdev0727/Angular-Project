import { findBestMatch } from './string-similarity.utils';

export const findOccupations = (industry) => {
    if (!industry) return [];

    const occupationMatches = [
        {
          industryName: 'Homemaker/House person',
          occupationName: 'Homemaker/House person',
        },
        {
          industryName: 'Retired',
          occupationName: 'Retired',
        },
        {
          industryName: 'Disabled',
          occupationName: 'Disabled',
        },
        {
          industryName: 'Unemployed',
          occupationName: 'Unemployed',
        },
        {
          industryName: 'Student',
          occupationName: 'Graduate Student',
        },
        {
          industryName: 'Student',
          occupationName: 'High school',
        },
        {
          industryName: 'Student',
          occupationName: 'Other',
        },
        {
          industryName: 'Student',
          occupationName: 'Undergraduate',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Agriculture Inspector/Grader',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Arborist',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Equipment Operator',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Farm/Ranch Owner',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Farm/Ranch Worker',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Fisherman',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Florist',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Laborer/Worker',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Landscaper/Nursery Worker',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Landscaper',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Logger',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Mill worker',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Other',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Ranger',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Supervisor',
        },
        {
          industryName: 'Agriculture/Forestry/Fishing',
          occupationName: 'Timber Grader/Scale',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Actor',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Announcer/Broadcaster',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Artist/Animator',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Author/Writer',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Choreography/Dancer',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Composer/Director',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Curator',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Designer',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Editor',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Journalist/Reporter',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Musician/Singer',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Other',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Printer',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Producer',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Production Crew',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Projectionist',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Art/Design/Media',
          occupationName: 'Ticket Sales/Usher',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Accountant/Auditor',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Analyst/Broker',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Bookkeeper',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Branch Manager',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Collections',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Consultant',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Controller',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'CSR/Teller',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Director/Administrator',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Executive',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Financial Advisor',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Investment Banker',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Investor',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Loan/Escrow Processor',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Manager-Credit/Loan',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Manager-Portfolio/Production',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Manager-Property',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Other',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Realtor',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Sales Agent/Representative',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Trader, Financial Instruments',
        },
        {
          industryName: 'Banking/Finance/Real Estate',
          occupationName: 'Underwriter',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Account Executive',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Buyer',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Clerk-Office',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Consultant',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Customer Service Representative',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Director/Administrator',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Executive',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'H.R. Representative',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Marketing Researcher',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Messenger/Courier',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Manager - District',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Manager - Finance',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Manager - Department/Store',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Manager - General Operations',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Manager - H.R./Public Relations',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Manager - Marketing/Sales',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Manager/Supervisor - Office',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Other',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Sales-Counter/Rental',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Sales-Home Based',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Sales-Manufacture Rep',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Sales-Retail/Wholesale',
        },
        {
          industryName: 'Business/Sales/Office',
          occupationName: 'Sales-Route/Vendor',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Boiler Operator/Maker',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Bricklayer/Mason',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Carpenter',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Carpet Installer',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Concrete Worker',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Construction - Project Manager',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Contractor',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Crane Operator',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Electrician/Linesman',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Elevator Technician/Installer',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Equipment Operator',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Floor Layer/Finisher',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Foreman/Supervisor',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Handyman',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Heat/Air Technician',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Inspector',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Laborer/Worker',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Metalworker',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Miner',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Oil/Gas Driller/Rig Operator',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Other',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Painter',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Plaster/Drywall/Stucco',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Plumber',
        },
        {
          industryName: 'Construction/Energy Trades',
          occupationName: 'Roofer',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Audio-Visual Tech.',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Child/Daycare Worker',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Counselor',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Graduate Teaching Assistant',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Instructor-Vocation',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Librarian/Curator',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Other',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Professor, College',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Superintendent',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Teacher, College',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Teacher, K-12',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Teaching Assistant/Aide',
        },
        {
          industryName: 'Education/Library',
          occupationName: 'Tutor',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Actuary',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Analyst',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Architect',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Clinical Data Coordinator',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Drafter',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Engineer',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Manager-Project',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Manager-R&D',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Mathematician',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Other',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Research Program Director',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Researcher',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Scientist',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Sociologist',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Surveyor/Mapmaker',
        },
        {
          industryName: 'Engineer/Architect/Science/Math',
          occupationName: 'Technician',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Accountant/Auditor',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Analyst',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Attorney',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Chief Executive',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Commissioner',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Council member',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Director/Administrator',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Enlisted Military Personnel (E1-4)',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Legislator',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Mayor/City Manager',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Meter Reader',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'NCO (E5-9)',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Officer-Commissioned',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Officer-Warrant',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Other',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Park Ranger',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Planner',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Postmaster',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'Regulator',
        },
        {
          industryName: 'Government/Military',
          occupationName: 'US Postal Worker',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Analyst',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Director/Administrator',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Engineer-Hardware',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Engineer-Software',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Engineer-Systems',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Executive',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Manager-Systems',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Network Administrator',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Other',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Programmer',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Project Coordinator',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Support Technician',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Systems Security',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Technical Writer',
        },
        {
          industryName: 'Information Technology',
          occupationName: 'Web Developer',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Accountant/Auditor',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Actuarial Clerk',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Actuary',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Agent/Broker',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Analyst',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Attorney',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Claims Adjuster',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Commissioner',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Customer Service Representative',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Director/Administrator',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Executive',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Other',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Product Manager',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Sales Representative',
        },
        {
          industryName: 'Insurance',
          occupationName: 'Underwriter',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Airport Security Officer',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Animal Control Officer',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Attorney',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Bailiff',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Corrections Officer',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Court Clerk/Reporter',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Deputy Sheriff',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Dispatcher',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Examiner',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Federal Agent/Marshall',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Fire Chief',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Fire Fighter/Supervisor',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Gaming Officer/Investigator',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Highway Patrol Officer',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Judge/Hearing Officer',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Legal Assistant/Secretary',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Other',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Paralegal/Law Clerk',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Police Chief',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Police Detective/Investigator',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Police Officer/Supervisor',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Process Server',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Private Investigator/Detective',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Security Guard',
        },
        {
          industryName: 'Legal/Law Enforcement/Security',
          occupationName: 'Sheriff',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Building Maintenance Engineer',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Custodian/Janitor',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Electrician',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Field Service Technician',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Handyman',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Heat/Air Conditioner Repairman',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Housekeeper/Maid',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Landscape/Grounds Maintenance',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Maintenance Mechanic',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Mechanic',
        },
        {
          industryName: 'Maintenance/Repair/Housekeeping',
          occupationName: 'Other',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Factory Worker',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Foreman/Supervisor',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Furniture Finisher',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Inspector',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Jeweler',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Machine Operator',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Other',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Packer',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Plant Manager',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Printer/Bookbinder',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Quality Control',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Refining Operator',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Shoemaker',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Tailor/Custom Sewer',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Textile Worker',
        },
        {
          industryName: 'Manufacturing/Production',
          occupationName: 'Upholsterer',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Assistant - Medic/Dent/Vet',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Clergy',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Client Care Worker',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Dental Hygienist',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Dentist',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Doctor',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Hospice Volunteer',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Mortician',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Nurse - C.N.A.',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Nurse - LPN',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Nurse - RN',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Nurse Practitioner',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Optometrist',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Other',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Paramedic/E.M. Technician',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Pharmacist',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Social Worker',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Support Services',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Technician',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Therapist',
        },
        {
          industryName: 'Medical/Social Services/Religion',
          occupationName: 'Veterinarian',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Caregiver',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Dry Cleaner/Laundry',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Hair Stylist/Barber',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Housekeeper',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Manicurist',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Masseuse',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Nanny',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Other',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Pet Services',
        },
        {
          industryName: 'Personal Care/Service',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Baker',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Bartender',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Bellhop',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Bus Person',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Caterer',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Chef',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Concessionaire',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Concierge',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Cook - Restaurant/Cafeteria',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Cook/Worker-Fast Food',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Delivery Person',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Desk Clerk',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Dishwasher',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Food Production/Packing',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Host/Maitre d',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Housekeeper/Maid',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Manager',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Other',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Valet',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Waiter/Waitress',
        },
        {
          industryName: 'Restaurant/Hotel Services',
          occupationName: 'Wine Steward',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Activity/Recreational Assistant',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Agent',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Athlete',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Camp Counselor/Lead',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Coach',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Concessionaire',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Director, Program',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Event Manager/Promoter',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Life Guard',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Manager - Fitness Club',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Other',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Park Ranger',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Sales-Ticket/Membership',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Sports Broadcaster/Journalist',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Trainer/Instructor',
        },
        {
          industryName: 'Sports/Recreation',
          occupationName: 'Umpire/Referee',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Administrative Assistant',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Air Traffic Control',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Airport Operations Crew',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Bellhop/Porter',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Clerk',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Crane Loader/Operator',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Dispatcher',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Driver - Bus/Streetcar',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Driver-Taxi/Limo',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Driver-Truck/Delivery',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Flight Attendant',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Forklift Operator',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Laborer',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Longshoreman',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Mate/Sailor',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Manager - Warehouse/District',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Other',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Parking Lot Attendant',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Pilot/Captain/Engineer',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Railroad Worker',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Receptionist/Secretary',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Shipping/Receiving Clerk',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Subway/Light Rail Operator',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Ticket Agent',
        },
        {
          industryName: 'Travel/Transportation/Warehousing',
          occupationName: 'Transportation Specialist',
        },
        {
          industryName: 'Other',
          occupationName: 'Other',
        },
    ];

    const industries = ['Homemaker/House person','Retired','Disabled','Unemployed','Student','Agriculture/Forestry/Fishing','Art/Design/Media','Banking/Finance/Real Estate','Business/Sales/Office','Construction/Energy Trades','Education/Library','Engineer/Architect/Science/Math','Government/Military','Information Technology','Insurance','Legal/Law Enforcement/Security','Maintenance/Repair/Housekeeping','Manufacturing/Production','Medical/Social Services/Religion','Personal Care/Service','Restaurant/Hotel Services','Sports/Recreation','Travel/Transportation/Warehousing','Other'];

    const industryBestMatch = findBestMatch(industry, industries);

    if (industryBestMatch && industryBestMatch.bestMatch && industryBestMatch.bestMatch.target) {
        const occupations = occupationMatches.filter(obj => obj.industryName === industryBestMatch.bestMatch.target);
        return occupations.map(obj => obj.occupationName);
    } else {
        return [];
    }

}