// Mock data for California cities with problems and solutions

export interface Problem {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  metric: string;
  value: number;
  threshold: number;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  steps: string[];
  estimatedCost: string;
  costBreakdown?: {
    item: string;
    amount: string;
  }[];
  timeline: string;
  implementationPhases?: {
    phase: string;
    duration: string;
    milestones: string[];
  }[];
  impact: string;
  successMetrics?: string[];
  requiredDepartments?: string[];
  stakeholders?: string[];
  fundingSources?: string[];
  similarCities?: {
    city: string;
    outcome: string;
  }[];
  risks?: string[];
  category?: 'housing' | 'economic' | 'safety' | 'environment' | 'infrastructure' | 'social';
}

export interface CityMetrics {
  population: number;
  medianIncome: number;
  crimeRate: number;
  vacancyRate: number;
  foreclosureRate: number;
  taxDelinquency: number;
  unemploymentRate: number;
  povertyRate: number;
}

export interface CityData {
  id: string;
  name: string;
  county: string;
  latitude: number;
  longitude: number;
  riskLevel: 'high' | 'medium' | 'low';
  metrics: CityMetrics;
  problems: Problem[];
  solutions: Solution[];
}

export const mockCities: CityData[] = [
  {
    id: 'windsor',
    name: 'Windsor',
    county: 'Sonoma',
    latitude: 38.5471,
    longitude: -122.8164,
    riskLevel: 'high',
    metrics: {
      population: 26344,
      medianIncome: 63000,
      crimeRate: 0.012,
      vacancyRate: 0.08,
      foreclosureRate: 0.021,
      taxDelinquency: 0.04,
      unemploymentRate: 0.065,
      povertyRate: 0.11,
    },
    problems: [
      {
        id: 'windsor-foreclosure',
        title: 'High Foreclosure Risk',
        description: 'Foreclosure rate exceeds state average by 40%, linked to property tax delinquency',
        severity: 'high',
        metric: 'Foreclosure Rate',
        value: 2.1,
        threshold: 1.5,
      },
      {
        id: 'windsor-vacancy',
        title: 'Increasing Housing Vacancy',
        description: 'Vacancy rate has risen 25% in the past year, particularly in low-income areas',
        severity: 'medium',
        metric: 'Vacancy Rate',
        value: 8.0,
        threshold: 6.0,
      },
    ],
    solutions: [
      {
        id: 'windsor-sol-1',
        title: 'Property Tax Deferment Program',
        description: 'Implement targeted property tax relief for low-income and elderly homeowners to prevent foreclosures',
        steps: [
          'Establish eligibility criteria (income < $50k, age 65+, or documented hardship)',
          'Partner with County Treasurer to create deferment mechanism',
          'Launch outreach campaign through community centers and churches',
          'Set up application portal and assistance hotline',
        ],
        estimatedCost: '$150K - $300K annually',
        costBreakdown: [
          { item: 'Program administration staff (2 FTE)', amount: '$120,000' },
          { item: 'Application portal development', amount: '$35,000' },
          { item: 'Outreach and marketing materials', amount: '$25,000' },
          { item: 'Legal consultation and compliance', amount: '$40,000' },
          { item: 'Hotline and support services', amount: '$30,000' },
          { item: 'Translation services', amount: '$15,000' },
          { item: 'County partnership coordination', amount: '$35,000' },
        ],
        timeline: '3-6 months to implement',
        implementationPhases: [
          {
            phase: 'Phase 1: Planning & Partnership',
            duration: '6-8 weeks',
            milestones: [
              'Secure County Treasurer partnership agreement',
              'Draft eligibility criteria and program guidelines',
              'Hire program administrator',
              'Complete legal review of deferment mechanism',
            ],
          },
          {
            phase: 'Phase 2: Infrastructure Build',
            duration: '8-10 weeks',
            milestones: [
              'Develop online application portal',
              'Set up hotline with multilingual support',
              'Create outreach materials in English and Spanish',
              'Train staff on program guidelines',
            ],
          },
          {
            phase: 'Phase 3: Launch & Outreach',
            duration: '4-6 weeks',
            milestones: [
              'Soft launch with pilot group of 25 applicants',
              'Community meetings at churches and senior centers',
              'Direct mail to at-risk homeowners',
              'Full program launch',
            ],
          },
        ],
        impact: 'Could prevent 40-60 foreclosures annually',
        successMetrics: [
          'Number of applications received (target: 150+ in year 1)',
          'Approval rate (target: 70%+)',
          'Foreclosure prevention rate (target: 50-60 cases/year)',
          'Average processing time (target: < 30 days)',
          'Customer satisfaction score (target: 4.5/5)',
          'Reduction in tax delinquency rate (target: 15% decrease)',
        ],
        requiredDepartments: [
          'City Manager\'s Office',
          'Finance Department',
          'Community Development',
          'IT Department',
          'City Attorney\'s Office',
        ],
        stakeholders: [
          'Sonoma County Treasurer-Tax Collector',
          'Local senior centers and councils on aging',
          'Community churches and faith organizations',
          'Legal Aid of Sonoma County',
          'Local homeowner associations',
          'Social services agencies',
        ],
        fundingSources: [
          'California Community Development Block Grant (CDBG)',
          'HOME Investment Partnerships Program',
          'Sonoma County Housing Trust Fund',
          'City General Fund allocation',
          'California Department of Housing & Community Development (HCD) grants',
        ],
        similarCities: [
          {
            city: 'San Jose, CA',
            outcome: 'Prevented 180 foreclosures in first 2 years with 73% approval rate',
          },
          {
            city: 'Sacramento, CA',
            outcome: 'Reduced senior foreclosures by 42% within 18 months of launch',
          },
          {
            city: 'Portland, OR',
            outcome: '$2.8M in deferred taxes helped 320 families remain in homes',
          },
        ],
        risks: [
          'County partnership delays could extend implementation timeline',
          'Lower-than-expected uptake if outreach is insufficient',
          'Budget overruns if application volume exceeds projections',
          'Legal challenges from tax collection advocacy groups',
          'Administrative burden on understaffed city departments',
        ],
        category: 'housing',
      },
      {
        id: 'windsor-sol-2',
        title: 'Foreclosure Mediation Requirement',
        description: 'Require lenders to participate in city-facilitated mediation before finalizing foreclosures',
        steps: [
          'Draft city ordinance requiring pre-foreclosure mediation',
          'Train or hire mediators familiar with housing law',
          'Establish partnerships with legal aid organizations',
          'Create tracking system for mediation outcomes',
        ],
        estimatedCost: '$75K - $125K annually',
        costBreakdown: [
          { item: 'Mediator services (contract or part-time)', amount: '$60,000' },
          { item: 'Legal aid partnership stipend', amount: '$25,000' },
          { item: 'Mediation tracking software', amount: '$15,000' },
          { item: 'Mediator training and certification', amount: '$12,000' },
          { item: 'Program coordination (0.5 FTE)', amount: '$35,000' },
          { item: 'Meeting space and materials', amount: '$8,000' },
        ],
        timeline: '4-8 months to implement',
        implementationPhases: [
          {
            phase: 'Phase 1: Legal Framework',
            duration: '8-12 weeks',
            milestones: [
              'Draft pre-foreclosure mediation ordinance',
              'Public comment period and City Council hearings',
              'Ordinance adoption',
              'Legal review and compliance check',
            ],
          },
          {
            phase: 'Phase 2: Program Infrastructure',
            duration: '6-8 weeks',
            milestones: [
              'Hire or contract certified housing mediators',
              'Partner with Legal Aid and housing counseling agencies',
              'Develop mediation protocols and procedures',
              'Set up case tracking system',
            ],
          },
          {
            phase: 'Phase 3: Launch & Education',
            duration: '4-6 weeks',
            milestones: [
              'Train mediators on local foreclosure trends',
              'Notify lenders and servicers of new requirement',
              'Launch homeowner education campaign',
              'Begin accepting mediation requests',
            ],
          },
        ],
        impact: 'Success rate of 30-45% in preventing foreclosure',
        successMetrics: [
          'Mediation participation rate (target: 85%+ of eligible cases)',
          'Agreement reached rate (target: 40%+)',
          'Foreclosure prevention success (target: 30-45 cases/year)',
          'Average days to mediation (target: < 45 days)',
          'Homeowner satisfaction (target: 80%+ satisfied)',
          'Lender compliance rate (target: 95%+)',
        ],
        requiredDepartments: [
          'City Attorney\'s Office',
          'City Clerk (ordinance management)',
          'Community Development',
          'City Manager\'s Office',
        ],
        stakeholders: [
          'Major mortgage servicers (Wells Fargo, Bank of America, etc.)',
          'Legal Aid of Sonoma County',
          'Housing counseling agencies (HUD-certified)',
          'Sonoma County Bar Association',
          'Homeowner advocacy groups',
          'Real estate and banking industry associations',
        ],
        fundingSources: [
          'National Foreclosure Mitigation Counseling Program',
          'California Mortgage Relief Program',
          'HUD Housing Counseling Grant',
          'City General Fund',
          'Mediation program fees (lender-paid)',
        ],
        similarCities: [
          {
            city: 'Philadelphia, PA',
            outcome: '45% success rate in preventing foreclosure through mandatory mediation',
          },
          {
            city: 'Las Vegas, NV',
            outcome: 'Saved 12,000+ homes through foreclosure mediation program since 2009',
          },
          {
            city: 'Seattle, WA',
            outcome: '38% of mediations resulted in loan modifications or alternatives to foreclosure',
          },
        ],
        risks: [
          'Lender legal challenges to ordinance authority',
          'Delays in mediation scheduling if case volume exceeds capacity',
          'Insufficient mediator expertise in complex foreclosure cases',
          'Low homeowner participation if outreach is inadequate',
          'State preemption of local foreclosure regulations',
        ],
        category: 'housing',
      },
    ],
  },
  {
    id: 'larkspur',
    name: 'Larkspur',
    county: 'Marin',
    latitude: 37.9341,
    longitude: -122.5350,
    riskLevel: 'medium',
    metrics: {
      population: 13064,
      medianIncome: 98000,
      crimeRate: 0.008,
      vacancyRate: 0.045,
      foreclosureRate: 0.009,
      taxDelinquency: 0.015,
      unemploymentRate: 0.042,
      povertyRate: 0.06,
    },
    problems: [
      {
        id: 'larkspur-affordability',
        title: 'Housing Affordability Crisis',
        description: 'Median home price to income ratio exceeds 12:1, forcing out working families',
        severity: 'high',
        metric: 'Price-to-Income Ratio',
        value: 12.3,
        threshold: 8.0,
      },
      {
        id: 'larkspur-traffic',
        title: 'Traffic Congestion',
        description: 'Highway 101 congestion causing economic losses and environmental impact',
        severity: 'medium',
        metric: 'Average Commute Time',
        value: 42,
        threshold: 30,
      },
    ],
    solutions: [
      {
        id: 'larkspur-sol-1',
        title: 'Inclusionary Zoning Expansion',
        description: 'Expand affordable housing requirements for new developments',
        steps: [
          'Amend zoning code to require 15-20% affordable units in new projects',
          'Offer density bonuses to developers who exceed requirements',
          'Create affordable housing trust fund from developer fees',
          'Partner with non-profit housing developers',
        ],
        estimatedCost: '$200K planning + ongoing monitoring',
        costBreakdown: [
          { item: 'Zoning code analysis and update', amount: '$85,000' },
          { item: 'Economic feasibility study', amount: '$45,000' },
          { item: 'Public outreach and stakeholder engagement', amount: '$30,000' },
          { item: 'Legal review and environmental analysis', amount: '$55,000' },
          { item: 'Ongoing compliance monitoring (annual)', amount: '$40,000' },
          { item: 'Trust fund administration setup', amount: '$25,000' },
        ],
        timeline: '6-12 months for policy implementation',
        implementationPhases: [
          {
            phase: 'Phase 1: Research & Analysis',
            duration: '8-10 weeks',
            milestones: [
              'Commission economic feasibility study',
              'Analyze comparable jurisdictions (SF, Oakland, Berkeley)',
              'Model financial impact on development projects',
              'Identify optimal inclusionary percentage (15-20%)',
            ],
          },
          {
            phase: 'Phase 2: Policy Development',
            duration: '12-14 weeks',
            milestones: [
              'Draft zoning ordinance amendments',
              'Design density bonus incentive structure',
              'Create affordable housing trust fund mechanism',
              'Develop compliance and monitoring procedures',
            ],
          },
          {
            phase: 'Phase 3: Public Process',
            duration: '10-12 weeks',
            milestones: [
              'Host community workshops and developer roundtables',
              'Planning Commission review and recommendations',
              'Public hearings and comment period',
              'City Council adoption of ordinance',
            ],
          },
          {
            phase: 'Phase 4: Implementation',
            duration: '6-8 weeks',
            milestones: [
              'Update planning department procedures',
              'Train staff on new requirements',
              'Launch developer education program',
              'Begin accepting applications under new rules',
            ],
          },
        ],
        impact: '50-100 new affordable units over 5 years',
        successMetrics: [
          'Number of affordable units created (target: 50-100 in 5 years)',
          'Developer participation rate (target: 90%+ compliance)',
          'Affordability levels achieved (target: 80% AMI or below)',
          'Trust fund revenue collected (target: $500K+ over 5 years)',
          'Average time from proposal to approval (target: < 120 days)',
          'Density bonus utilization rate (target: 60%+ of projects)',
        ],
        requiredDepartments: [
          'Planning Department',
          'City Attorney\'s Office',
          'City Manager\'s Office',
          'Finance Department',
          'Community Development',
        ],
        stakeholders: [
          'Local developers and builders (Marin Builders Association)',
          'Affordable housing non-profits (Eden Housing, MidPen)',
          'Marin Housing Authority',
          'Neighborhood associations and community groups',
          'Business community and Chamber of Commerce',
          'Fair housing advocates',
        ],
        fundingSources: [
          'California SB 2 Planning Grants',
          'Local Housing Trust Fund (developer in-lieu fees)',
          'City General Fund allocation',
          'Marin County affordable housing funds',
          'Regional planning grants (ABAG/MTC)',
        ],
        similarCities: [
          {
            city: 'San Francisco, CA',
            outcome: '20% inclusionary requirement created 1,500+ affordable units since 2016',
          },
          {
            city: 'Berkeley, CA',
            outcome: '15% requirement with density bonuses yielded 800+ units over 10 years',
          },
          {
            city: 'Mountain View, CA',
            outcome: 'Inclusionary policy generated $15M in housing trust fund revenue',
          },
        ],
        risks: [
          'Developer pushback and reduced project feasibility',
          'Legal challenges under California housing law',
          'Market downturn reducing new construction',
          'Insufficient density bonus incentive to offset costs',
          'Weak enforcement leading to non-compliance',
          'Gentrification pressure in areas rezoned for higher density',
        ],
        category: 'housing',
      },
      {
        id: 'larkspur-sol-2',
        title: 'Transit-Oriented Development Incentives',
        description: 'Leverage proximity to ferry terminal and train station for mixed-use development',
        steps: [
          'Rezone areas within 1/2 mile of transit for higher density',
          'Fast-track permits for projects with 25%+ affordable housing',
          'Improve pedestrian/bike infrastructure to transit hubs',
          'Negotiate with regional transit agencies for improved service',
        ],
        estimatedCost: '$500K - $1M for infrastructure',
        costBreakdown: [
          { item: 'Transit area rezoning study and implementation', amount: '$120,000' },
          { item: 'Pedestrian infrastructure (sidewalks, crosswalks)', amount: '$250,000' },
          { item: 'Bike lane improvements and bike share stations', amount: '$180,000' },
          { item: 'Wayfinding signage and lighting', amount: '$80,000' },
          { item: 'Public plaza and gathering space improvements', amount: '$200,000' },
          { item: 'Transit coordination and planning', amount: '$70,000' },
          { item: 'Permitting streamlining system development', amount: '$50,000' },
        ],
        timeline: '12-24 months',
        implementationPhases: [
          {
            phase: 'Phase 1: Planning & Zoning',
            duration: '4-6 months',
            milestones: [
              'Conduct transit-oriented development (TOD) study',
              'Map 1/2-mile radius around ferry and train station',
              'Draft TOD overlay zone ordinance',
              'Adopt expedited permitting procedures',
            ],
          },
          {
            phase: 'Phase 2: Infrastructure Investment',
            duration: '8-12 months',
            milestones: [
              'Design pedestrian and bike infrastructure improvements',
              'Secure Caltrans and MTC grant funding',
              'Construct improved crosswalks and bike lanes',
              'Install wayfinding signage and lighting',
            ],
          },
          {
            phase: 'Phase 3: Transit Partnership',
            duration: '6-8 months',
            milestones: [
              'Negotiate service improvements with Golden Gate Transit',
              'Coordinate with ferry terminal on parking and access',
              'Launch marketing campaign for transit usage',
              'Implement real-time arrival information systems',
            ],
          },
        ],
        impact: 'Reduce car trips by 15%, add 200+ housing units',
        successMetrics: [
          'Housing units added near transit (target: 200+ in 5 years)',
          'Reduction in vehicle miles traveled (target: 15%)',
          'Transit ridership increase (target: 25%)',
          'Bike/pedestrian mode share (target: 20% of local trips)',
          'Fast-tracked projects approved (target: 80% within 90 days)',
          'Developer interest (target: 5+ TOD projects in pipeline)',
        ],
        requiredDepartments: [
          'Planning Department',
          'Public Works',
          'City Manager\'s Office',
          'Economic Development',
          'City Attorney\'s Office',
        ],
        stakeholders: [
          'Golden Gate Transit and Ferry',
          'Metropolitan Transportation Commission (MTC)',
          'Marin County Transportation Authority',
          'Local developers and property owners',
          'Neighborhood associations near transit stations',
          'Environmental advocacy groups',
          'Bike/pedestrian advocacy organizations',
        ],
        fundingSources: [
          'MTC One Bay Area Grant (OBAG)',
          'Caltrans Active Transportation Program',
          'California Transit-Oriented Development Housing Program',
          'Local developer impact fees',
          'Federal Transportation Alternatives Program',
        ],
        similarCities: [
          {
            city: 'Walnut Creek, CA',
            outcome: 'TOD zoning near BART added 1,200 units and increased transit ridership 30%',
          },
          {
            city: 'Redwood City, CA',
            outcome: 'Transit village strategy created 2,500 housing units within walking distance of Caltrain',
          },
          {
            city: 'El Cerrito, CA',
            outcome: 'BART-adjacent TOD reduced parking demand 40% and added 600 affordable units',
          },
        ],
        risks: [
          'Community opposition to increased density and height',
          'Insufficient transit service improvements to support demand',
          'Parking spillover into adjacent neighborhoods',
          'Gentrification and displacement of existing residents',
          'Infrastructure costs exceeding grant funding',
          'Coordination challenges with regional transit agencies',
        ],
        category: 'infrastructure',
      },
    ],
  },
  {
    id: 'healdsburg',
    name: 'Healdsburg',
    county: 'Sonoma',
    latitude: 38.6191,
    longitude: -122.8697,
    riskLevel: 'medium',
    metrics: {
      population: 11340,
      medianIncome: 71000,
      crimeRate: 0.015,
      vacancyRate: 0.12,
      foreclosureRate: 0.013,
      taxDelinquency: 0.028,
      unemploymentRate: 0.055,
      povertyRate: 0.095,
    },
    problems: [
      {
        id: 'healdsburg-crime',
        title: 'Elevated Property Crime',
        description: 'Property crime rate 25% above county average, concentrated in downtown area',
        severity: 'high',
        metric: 'Property Crime Rate',
        value: 1.5,
        threshold: 1.0,
      },
      {
        id: 'healdsburg-vacancy',
        title: 'High Vacancy from Tourism',
        description: 'Short-term vacation rentals creating 12% vacancy rate, reducing long-term housing supply',
        severity: 'medium',
        metric: 'Vacancy Rate',
        value: 12.0,
        threshold: 7.0,
      },
    ],
    solutions: [
      {
        id: 'healdsburg-sol-1',
        title: 'Enhanced Community Policing',
        description: 'Expand foot patrols and community engagement in high-crime areas',
        steps: [
          'Hire 3-5 additional community police officers',
          'Establish downtown business watch program',
          'Install smart surveillance cameras in key areas',
          'Create youth engagement and diversion programs',
        ],
        estimatedCost: '$400K - $600K annually',
        costBreakdown: [
          { item: 'Community police officer salaries (4 FTE)', amount: '$420,000' },
          { item: 'Training and equipment for new officers', amount: '$60,000' },
          { item: 'Smart surveillance camera system', amount: '$150,000' },
          { item: 'Business watch program coordination', amount: '$35,000' },
          { item: 'Youth diversion programs and activities', amount: '$80,000' },
          { item: 'Community engagement events', amount: '$25,000' },
        ],
        timeline: '6 months to staff and train',
        implementationPhases: [
          {
            phase: 'Phase 1: Recruitment & Hiring',
            duration: '8-12 weeks',
            milestones: [
              'Secure City Council approval for new positions',
              'Post positions and conduct recruitment',
              'Complete background checks and hiring process',
              'Onboard new community police officers',
            ],
          },
          {
            phase: 'Phase 2: Training & Infrastructure',
            duration: '10-14 weeks',
            milestones: [
              'Complete community policing training academy',
              'Install smart surveillance cameras in downtown',
              'Set up business watch communication system',
              'Develop youth engagement program curriculum',
            ],
          },
          {
            phase: 'Phase 3: Deployment & Engagement',
            duration: '6-8 weeks',
            milestones: [
              'Launch foot patrol schedules in high-crime areas',
              'Host business watch kickoff meeting',
              'Begin youth diversion programming',
              'Implement community feedback mechanisms',
            ],
          },
        ],
        impact: 'Target 20-30% reduction in property crime',
        successMetrics: [
          'Property crime reduction (target: 20-30% within 2 years)',
          'Response time improvement (target: < 5 minutes downtown)',
          'Business watch participation (target: 80% of downtown businesses)',
          'Youth program enrollment (target: 100+ youth annually)',
          'Community trust score (target: 75%+ positive perception)',
          'Repeat offender diversion rate (target: 40% reduction)',
        ],
        requiredDepartments: [
          'Police Department',
          'City Manager\'s Office',
          'Human Resources',
          'Parks and Recreation (youth programs)',
          'IT Department (camera systems)',
        ],
        stakeholders: [
          'Healdsburg Police Department',
          'Downtown business owners and merchants',
          'Chamber of Commerce',
          'Youth services organizations',
          'Neighborhood watch groups',
          'School district administrators',
        ],
        fundingSources: [
          'California Board of State and Community Corrections grants',
          'Department of Justice COPS Hiring Program',
          'City General Fund allocation',
          'Business improvement district assessments',
          'Private foundation grants for youth programs',
        ],
        similarCities: [
          {
            city: 'Petaluma, CA',
            outcome: 'Community policing reduced property crime 28% over 3 years',
          },
          {
            city: 'San Luis Obispo, CA',
            outcome: 'Downtown foot patrols cut theft by 35% and improved business confidence',
          },
          {
            city: 'Napa, CA',
            outcome: 'Youth diversion programs reduced juvenile crime 42% in 2 years',
          },
        ],
        risks: [
          'Difficulty recruiting qualified community policing officers',
          'Privacy concerns over surveillance camera expansion',
          'Insufficient community buy-in for business watch',
          'Youth program participation lower than expected',
          'Budget constraints limiting sustained funding',
        ],
        category: 'safety',
      },
      {
        id: 'healdsburg-sol-2',
        title: 'Short-Term Rental Regulation',
        description: 'Implement permit system to balance tourism with long-term housing needs',
        steps: [
          'Create STR permit cap system (e.g., max 250 permits)',
          'Require primary residence for hosted rentals',
          'Charge annual permit fees ($500-1000) to fund enforcement',
          'Establish complaint hotline and inspection process',
        ],
        estimatedCost: '$100K setup + self-funded via fees',
        costBreakdown: [
          { item: 'STR permit tracking software/platform', amount: '$45,000' },
          { item: 'Ordinance development and legal review', amount: '$30,000' },
          { item: 'Enforcement officer (1 FTE, fee-funded)', amount: '$85,000' },
          { item: 'Complaint hotline and reporting system', amount: '$15,000' },
          { item: 'Initial property inspections', amount: '$20,000' },
          { item: 'Public education and outreach', amount: '$15,000' },
        ],
        timeline: '4-6 months for ordinance and system',
        implementationPhases: [
          {
            phase: 'Phase 1: Policy Development',
            duration: '8-10 weeks',
            milestones: [
              'Research STR impacts and best practices',
              'Draft short-term rental ordinance with permit cap',
              'Conduct public hearings and stakeholder input',
              'City Council adoption of ordinance',
            ],
          },
          {
            phase: 'Phase 2: System Setup',
            duration: '6-8 weeks',
            milestones: [
              'Procure and configure permit tracking software',
              'Hire STR enforcement officer',
              'Set up online permit application portal',
              'Establish complaint hotline and procedures',
            ],
          },
          {
            phase: 'Phase 3: Launch & Enforcement',
            duration: '4-6 weeks',
            milestones: [
              'Open permit application period',
              'Allocate initial permits (lottery if oversubscribed)',
              'Begin compliance inspections and monitoring',
              'Launch public education campaign',
            ],
          },
        ],
        impact: 'Convert 30-50 units back to long-term housing',
        successMetrics: [
          'Units converted to long-term housing (target: 30-50)',
          'Permit compliance rate (target: 95%+)',
          'Rental vacancy rate reduction (target: from 12% to 8%)',
          'Permit fee revenue collected (target: $150K+ annually)',
          'Complaint resolution time (target: < 10 days average)',
          'Tourism business revenue maintained (target: < 5% decline)',
        ],
        requiredDepartments: [
          'Planning Department',
          'City Attorney\'s Office',
          'Finance Department',
          'Building & Code Enforcement',
          'IT Department',
        ],
        stakeholders: [
          'Short-term rental operators and property owners',
          'Long-term rental tenants and housing advocates',
          'Tourism industry (hotels, wineries, restaurants)',
          'Neighborhood associations',
          'Healdsburg Chamber of Commerce',
          'Vacation rental platforms (Airbnb, VRBO)',
        ],
        fundingSources: [
          'Annual STR permit fees ($500-1000 per permit)',
          'Penalty fees for violations',
          'Transient occupancy tax (TOT) enforcement revenue',
          'City General Fund (startup costs)',
        ],
        similarCities: [
          {
            city: 'Santa Monica, CA',
            outcome: 'STR cap converted 1,400+ units to long-term housing in 3 years',
          },
          {
            city: 'Tahoe City, CA',
            outcome: 'Permit system reduced vacancy rate from 15% to 9% while maintaining tourism',
          },
          {
            city: 'Sonoma, CA',
            outcome: 'Primary residence requirement returned 60 units to housing market',
          },
        ],
        risks: [
          'Legal challenges from STR platforms or property owners',
          'Difficulty enforcing compliance without sufficient staff',
          'Negative impact on tourism-dependent businesses',
          'Black market unlicensed STR operations',
          'Administrative burden exceeding fee revenue',
          'Gentrification if former STRs become high-end long-term rentals',
        ],
        category: 'housing',
      },
    ],
  },
  {
    id: 'lawndale',
    name: 'Lawndale',
    county: 'Los Angeles',
    latitude: 33.8872,
    longitude: -118.3526,
    riskLevel: 'high',
    metrics: {
      population: 31807,
      medianIncome: 48000,
      crimeRate: 0.024,
      vacancyRate: 0.055,
      foreclosureRate: 0.027,
      taxDelinquency: 0.052,
      unemploymentRate: 0.085,
      povertyRate: 0.18,
    },
    problems: [
      {
        id: 'lawndale-unemployment',
        title: 'High Unemployment Rate',
        description: 'Unemployment at 8.5%, well above county average of 5.2%',
        severity: 'high',
        metric: 'Unemployment Rate',
        value: 8.5,
        threshold: 5.5,
      },
      {
        id: 'lawndale-poverty',
        title: 'Concentrated Poverty',
        description: 'Nearly 1 in 5 residents below poverty line, with limited access to services',
        severity: 'high',
        metric: 'Poverty Rate',
        value: 18.0,
        threshold: 12.0,
      },
      {
        id: 'lawndale-crime',
        title: 'High Crime Rate',
        description: 'Crime rate double the state average, impacting business investment',
        severity: 'high',
        metric: 'Crime Rate',
        value: 2.4,
        threshold: 1.2,
      },
    ],
    solutions: [
      {
        id: 'lawndale-sol-1',
        title: 'Workforce Development Partnership',
        description: 'Partner with LA County to create job training and placement programs',
        steps: [
          'Establish partnership with LA County Workforce Development Board',
          'Create job training center focused on healthcare, logistics, and green jobs',
          'Negotiate with local employers for guaranteed interviews',
          'Provide childcare assistance and transportation vouchers',
        ],
        estimatedCost: '$300K - $500K (mostly covered by grants)',
        costBreakdown: [
          { item: 'Job training center lease and setup', amount: '$120,000' },
          { item: 'Training program instructors (3 FTE)', amount: '$180,000' },
          { item: 'Childcare assistance vouchers', amount: '$60,000' },
          { item: 'Transportation support (bus passes, rideshare)', amount: '$40,000' },
          { item: 'Equipment and training materials', amount: '$55,000' },
          { item: 'Employer partnership coordinator', amount: '$75,000' },
          { item: 'Placement support and case management', amount: '$50,000' },
        ],
        timeline: '6-12 months',
        implementationPhases: [
          {
            phase: 'Phase 1: Partnership Formation',
            duration: '8-10 weeks',
            milestones: [
              'Formalize MOU with LA County Workforce Development Board',
              'Identify employer partners in healthcare, logistics, green energy',
              'Secure WIOA and other workforce grant funding',
              'Identify and lease training center location',
            ],
          },
          {
            phase: 'Phase 2: Program Development',
            duration: '12-14 weeks',
            milestones: [
              'Develop curriculum for high-demand occupations',
              'Hire training instructors and support staff',
              'Set up childcare and transportation support systems',
              'Create placement agreements with employer partners',
            ],
          },
          {
            phase: 'Phase 3: Launch & Recruitment',
            duration: '6-8 weeks',
            milestones: [
              'Community outreach and participant recruitment',
              'Enroll first cohort of 50 trainees',
              'Launch training programs',
              'Begin employer engagement activities',
            ],
          },
        ],
        impact: 'Train and place 150-250 residents annually',
        successMetrics: [
          'Annual training participants (target: 150-250)',
          'Job placement rate (target: 70%+)',
          'Wage gain post-training (target: 30%+ increase)',
          'Retention rate at 6 months (target: 75%+)',
          'Employer satisfaction score (target: 85%+)',
          'Unemployment rate reduction (target: 2 percentage points over 3 years)',
        ],
        requiredDepartments: [
          'Economic Development',
          'City Manager\'s Office',
          'Community Services',
          'Finance Department (grant administration)',
        ],
        stakeholders: [
          'LA County Workforce Development Board',
          'South Bay Workforce Investment Board',
          'Local healthcare employers (Torrance Memorial, Providence)',
          'Logistics companies (Amazon, UPS, FedEx facilities)',
          'Green energy firms and solar installers',
          'El Camino College (training partner)',
          'Community-based organizations',
        ],
        fundingSources: [
          'Workforce Innovation and Opportunity Act (WIOA) grants',
          'California Employment Training Panel',
          'LA County workforce development funds',
          'Department of Labor employment grants',
          'City General Fund (match requirement)',
        ],
        similarCities: [
          {
            city: 'Compton, CA',
            outcome: 'Workforce center placed 800+ residents in jobs, reducing unemployment 3.5%',
          },
          {
            city: 'Inglewood, CA',
            outcome: 'Healthcare training program achieved 78% placement rate with 35% wage gains',
          },
          {
            city: 'Hawthorne, CA',
            outcome: 'Manufacturing skills training led to 200 job placements at local employers',
          },
        ],
        risks: [
          'Employer hiring slowdown during economic downturns',
          'Insufficient participant recruitment due to barriers',
          'Grant funding delays or reductions',
          'Childcare capacity constraints limiting participation',
          'Mismatch between training and actual job openings',
        ],
        category: 'economic',
      },
      {
        id: 'lawndale-sol-2',
        title: 'Small Business Incubator',
        description: 'Create support system for local entrepreneurs to build community wealth',
        steps: [
          'Secure storefront or commercial space for incubator',
          'Partner with SBA and SCORE for mentorship',
          'Offer micro-loans ($5K-$25K) for qualifying businesses',
          'Provide free business planning and accounting support',
        ],
        estimatedCost: '$250K initial + $100K/year operating',
        costBreakdown: [
          { item: 'Commercial space lease (3-year initial)', amount: '$90,000' },
          { item: 'Incubator manager and staff (2 FTE)', amount: '$140,000' },
          { item: 'Micro-loan revolving fund (initial capitalization)', amount: '$150,000' },
          { item: 'Business support software and tools', amount: '$25,000' },
          { item: 'Mentorship program coordination', amount: '$30,000' },
          { item: 'Marketing and outreach', amount: '$20,000' },
          { item: 'Legal and accounting consultants', amount: '$35,000' },
        ],
        timeline: '8-12 months',
        implementationPhases: [
          {
            phase: 'Phase 1: Planning & Partnerships',
            duration: '10-12 weeks',
            milestones: [
              'Develop incubator business model and services',
              'Partner with SBA, SCORE, and local financial institutions',
              'Secure location in commercial corridor',
              'Establish micro-loan fund governance and criteria',
            ],
          },
          {
            phase: 'Phase 2: Infrastructure Build',
            duration: '12-14 weeks',
            milestones: [
              'Build out incubator space (co-working, meeting rooms)',
              'Hire incubator manager and business advisors',
              'Procure software and support tools',
              'Recruit mentor network from local business community',
            ],
          },
          {
            phase: 'Phase 3: Launch & Operations',
            duration: '6-8 weeks',
            milestones: [
              'Launch application process for first cohort',
              'Select 10-15 initial businesses',
              'Begin business planning workshops',
              'Issue first micro-loans to qualifying entrepreneurs',
            ],
          },
        ],
        impact: 'Launch 20-30 businesses, create 50-100 jobs',
        successMetrics: [
          'Businesses launched (target: 20-30 in first 3 years)',
          'Jobs created (target: 50-100)',
          'Business survival rate at 3 years (target: 60%+)',
          'Micro-loan repayment rate (target: 85%+)',
          'Revenue generated by incubator graduates (target: $2M+ annually)',
          'Minority and women-owned business participation (target: 70%+)',
        ],
        requiredDepartments: [
          'Economic Development',
          'Finance Department (loan fund management)',
          'City Manager\'s Office',
          'Community Development',
        ],
        stakeholders: [
          'Small Business Administration (SBA)',
          'SCORE mentors and business advisors',
          'Local banks and credit unions',
          'Chamber of Commerce',
          'Community development financial institutions (CDFIs)',
          'Local entrepreneurs and business owners',
        ],
        fundingSources: [
          'SBA Community Advantage loans',
          'California Small Business Loan Guarantee Program',
          'Community Development Block Grant (CDBG)',
          'Local bank partnerships for micro-loan fund',
          'Private foundation grants for entrepreneurship',
          'City Economic Development Fund',
        ],
        similarCities: [
          {
            city: 'Long Beach, CA',
            outcome: 'Small business incubator launched 45 businesses, creating 120 jobs over 4 years',
          },
          {
            city: 'Pomona, CA',
            outcome: 'Entrepreneurship center helped 30 businesses generate $3M in annual revenue',
          },
          {
            city: 'Carson, CA',
            outcome: 'Micro-loan program achieved 88% repayment rate and 65% business survival',
          },
        ],
        risks: [
          'Low entrepreneur participation or application quality',
          'High business failure rate reducing impact',
          'Micro-loan defaults creating fund sustainability issues',
          'Insufficient mentor capacity to support demand',
          'Competition from surrounding cities for businesses',
        ],
        category: 'economic',
      },
      {
        id: 'lawndale-sol-3',
        title: 'Community Safety Initiative',
        description: 'Multi-pronged approach combining enforcement, prevention, and rehabilitation',
        steps: [
          'Expand gang intervention and youth mentorship programs',
          'Install improved street lighting in high-crime areas',
          'Create community crime watch networks with police liaison',
          'Establish re-entry services for formerly incarcerated residents',
        ],
        estimatedCost: '$400K - $700K annually',
        costBreakdown: [
          { item: 'Gang intervention specialists (3 FTE)', amount: '$240,000' },
          { item: 'Youth mentorship programs and activities', amount: '$100,000' },
          { item: 'LED street lighting upgrades', amount: '$180,000' },
          { item: 'Crime watch coordination and support', amount: '$40,000' },
          { item: 'Re-entry case managers (2 FTE)', amount: '$140,000' },
          { item: 'Job placement and support services for re-entry', amount: '$60,000' },
          { item: 'Community engagement and outreach', amount: '$35,000' },
        ],
        timeline: '6 months initial rollout',
        implementationPhases: [
          {
            phase: 'Phase 1: Assessment & Planning',
            duration: '6-8 weeks',
            milestones: [
              'Crime data analysis to identify hotspots',
              'Community safety needs assessment',
              'Hire gang intervention and re-entry staff',
              'Design street lighting improvement plan',
            ],
          },
          {
            phase: 'Phase 2: Infrastructure & Programs',
            duration: '10-12 weeks',
            milestones: [
              'Install LED lighting in 5 high-crime neighborhoods',
              'Launch gang intervention outreach teams',
              'Establish youth mentorship program partnerships',
              'Create re-entry resource center',
            ],
          },
          {
            phase: 'Phase 3: Community Engagement',
            duration: '6-8 weeks',
            milestones: [
              'Form neighborhood crime watch groups',
              'Host community safety town halls',
              'Assign police liaisons to each watch network',
              'Launch youth summer programming',
            ],
          },
        ],
        impact: 'Target 25% crime reduction over 3 years',
        successMetrics: [
          'Overall crime reduction (target: 25% over 3 years)',
          'Gang-related incidents (target: 40% reduction)',
          'Youth program enrollment (target: 200+ annually)',
          'Re-entry participants employed (target: 60%+)',
          'Crime watch neighborhoods established (target: 12+)',
          'Community safety perception (target: 50% improvement in surveys)',
        ],
        requiredDepartments: [
          'Police Department',
          'Public Works (lighting)',
          'Parks and Recreation (youth programs)',
          'City Manager\'s Office',
          'Community Services',
        ],
        stakeholders: [
          'Los Angeles County Sheriff (contract law enforcement)',
          'Gang intervention organizations (Homeboy Industries, etc.)',
          'Youth services non-profits',
          'LA County Probation Department',
          'Re-entry service providers',
          'Neighborhood associations',
          'Local schools and school district',
        ],
        fundingSources: [
          'California Board of State and Community Corrections grants',
          'Office of Gang and Youth Violence Policy funds',
          'Department of Justice Second Chance Act grants',
          'LA County anti-recidivism initiative',
          'City General Fund public safety allocation',
          'Private foundation support for youth programs',
        ],
        similarCities: [
          {
            city: 'Richmond, CA',
            outcome: 'Office of Neighborhood Safety reduced gun homicides 71% through intervention',
          },
          {
            city: 'Oakland, CA',
            outcome: 'Comprehensive safety plan cut violent crime 30% over 5 years',
          },
          {
            city: 'Stockton, CA',
            outcome: 'Re-entry programs reduced recidivism 45% among participants',
          },
        ],
        risks: [
          'Gang resistance or retaliation against intervention efforts',
          'Insufficient police buy-in for community policing approach',
          'Youth program participation lower than needed for impact',
          'Re-entry funding instability affecting service continuity',
          'Community distrust of law enforcement limiting cooperation',
        ],
        category: 'safety',
      },
    ],
  },
  {
    id: 'yorba-linda',
    name: 'Yorba Linda',
    county: 'Orange',
    latitude: 33.8886,
    longitude: -117.8131,
    riskLevel: 'low',
    metrics: {
      population: 68336,
      medianIncome: 115000,
      crimeRate: 0.006,
      vacancyRate: 0.032,
      foreclosureRate: 0.008,
      taxDelinquency: 0.012,
      unemploymentRate: 0.038,
      povertyRate: 0.055,
    },
    problems: [
      {
        id: 'yorba-infrastructure',
        title: 'Aging Infrastructure',
        description: 'Water and sewer systems from 1970s approaching end of lifespan',
        severity: 'medium',
        metric: 'Infrastructure Age',
        value: 50,
        threshold: 40,
      },
      {
        id: 'yorba-wildfire',
        title: 'Wildfire Risk',
        description: 'Proximity to open space and canyons creates elevated fire danger',
        severity: 'medium',
        metric: 'Fire Risk Index',
        value: 7.2,
        threshold: 5.0,
      },
    ],
    solutions: [
      {
        id: 'yorba-sol-1',
        title: 'Infrastructure Bond Measure',
        description: 'Fund comprehensive upgrade of water, sewer, and stormwater systems',
        steps: [
          'Commission infrastructure assessment and prioritization study',
          'Develop 10-year capital improvement plan',
          'Place bond measure on ballot ($50-100M)',
          'Phase construction to minimize disruption',
        ],
        estimatedCost: '$75M - $150M (voter-approved bonds)',
        costBreakdown: [
          { item: 'Water main replacements and upgrades', amount: '$45,000,000' },
          { item: 'Sewer system modernization', amount: '$38,000,000' },
          { item: 'Stormwater infrastructure improvements', amount: '$25,000,000' },
          { item: 'Engineering and design services', amount: '$12,000,000' },
          { item: 'Construction management and inspection', amount: '$8,000,000' },
          { item: 'Environmental compliance and permits', amount: '$5,000,000' },
          { item: 'Contingency (10%)', amount: '$15,000,000' },
        ],
        timeline: '12-18 months for approval, 5-10 years construction',
        implementationPhases: [
          {
            phase: 'Phase 1: Assessment & Planning',
            duration: '6-9 months',
            milestones: [
              'Commission comprehensive infrastructure assessment',
              'Conduct condition surveys of water and sewer lines',
              'Develop prioritized 10-year capital improvement plan',
              'Determine bond amount and repayment structure',
            ],
          },
          {
            phase: 'Phase 2: Bond Campaign',
            duration: '6-9 months',
            milestones: [
              'Form citizens oversight committee',
              'Develop bond measure language and ballot materials',
              'Launch public education campaign',
              'Place measure on ballot and secure voter approval',
            ],
          },
          {
            phase: 'Phase 3: Construction Phase 1',
            duration: '2-3 years',
            milestones: [
              'Design and engineer priority Zone 1 improvements',
              'Replace critical water mains (15+ miles)',
              'Upgrade main sewer trunk lines',
              'Construct stormwater retention basins',
            ],
          },
          {
            phase: 'Phase 4: Construction Phase 2-3',
            duration: '4-6 years',
            milestones: [
              'Continue phased infrastructure replacement',
              'Upgrade pump stations and treatment capacity',
              'Implement smart water metering system',
              'Complete final inspection and system commissioning',
            ],
          },
        ],
        impact: 'Modernize infrastructure for next 50 years',
        successMetrics: [
          'Water main breaks reduction (target: 80% fewer incidents)',
          'Sewer overflow elimination (target: zero SSOs)',
          'Infrastructure condition score (target: 85+ out of 100)',
          'Water conservation (target: 15% reduction through smart meters)',
          'Voter approval rate (target: 60%+ yes votes)',
          'On-time, on-budget completion (target: 95%+ of projects)',
        ],
        requiredDepartments: [
          'Public Works Department',
          'Finance Department',
          'City Manager\'s Office',
          'City Attorney\'s Office',
          'City Clerk (elections)',
          'Community Relations',
        ],
        stakeholders: [
          'Yorba Linda Water District',
          'Orange County Sanitation District',
          'Citizens oversight committee',
          'Neighborhood associations',
          'Business community',
          'Environmental groups',
          'Bond rating agencies',
        ],
        fundingSources: [
          'General Obligation Bonds (voter-approved)',
          'State Revolving Fund (SRF) low-interest loans',
          'Prop 68 water infrastructure grants',
          'Orange County water quality grants',
          'Developer impact fees for new connections',
        ],
        similarCities: [
          {
            city: 'Brea, CA',
            outcome: '$80M infrastructure bond passed with 68% approval, replaced 25 miles of pipes',
          },
          {
            city: 'La Habra, CA',
            outcome: 'Water system upgrade reduced main breaks 75% and saved $2M annually',
          },
          {
            city: 'Placentia, CA',
            outcome: '$50M sewer improvement program eliminated overflows and increased capacity 40%',
          },
        ],
        risks: [
          'Bond measure fails to achieve required voter approval',
          'Construction costs exceed estimates due to inflation',
          'Unexpected contamination or geotechnical issues',
          'Community opposition to street closures and disruption',
          'Interest rate increases raising debt service costs',
          'Delays in environmental permitting',
        ],
        category: 'infrastructure',
      },
      {
        id: 'yorba-sol-2',
        title: 'Comprehensive Wildfire Mitigation',
        description: 'Multi-layered approach to reduce fire risk and improve emergency response',
        steps: [
          'Expand fuel reduction programs in open space areas',
          'Require defensible space inspections for hillside homes',
          'Upgrade emergency alert and evacuation systems',
          'Create community wildfire preparedness education program',
        ],
        estimatedCost: '$500K - $1M annually',
        costBreakdown: [
          { item: 'Fuel reduction crews and equipment', amount: '$280,000' },
          { item: 'Defensible space inspection program (2 FTE)', amount: '$160,000' },
          { item: 'Emergency alert system upgrade', amount: '$120,000' },
          { item: 'Evacuation route improvements (signage, widening)', amount: '$200,000' },
          { item: 'Community education and outreach programs', amount: '$80,000' },
          { item: 'Chipper program and green waste disposal', amount: '$60,000' },
          { item: 'Fire weather monitoring stations', amount: '$40,000' },
        ],
        timeline: 'Ongoing program with 6-month initial setup',
        implementationPhases: [
          {
            phase: 'Phase 1: Assessment & Planning',
            duration: '3-4 months',
            milestones: [
              'Conduct comprehensive wildfire risk assessment',
              'Map evacuation zones and routes',
              'Identify priority fuel reduction areas',
              'Hire fire prevention staff',
            ],
          },
          {
            phase: 'Phase 2: Infrastructure & Systems',
            duration: '6-8 months',
            milestones: [
              'Install upgraded emergency alert system',
              'Improve evacuation route signage and clearances',
              'Deploy fire weather monitoring stations',
              'Create online wildfire preparedness portal',
            ],
          },
          {
            phase: 'Phase 3: Ongoing Operations',
            duration: 'Year-round',
            milestones: [
              'Conduct seasonal fuel reduction (500+ acres annually)',
              'Perform defensible space inspections (1,000+ properties/year)',
              'Host quarterly community preparedness workshops',
              'Run annual evacuation drills and exercises',
            ],
          },
        ],
        impact: 'Reduce fire risk by 40%, improve evacuation time by 50%',
        successMetrics: [
          'Acres treated for fuel reduction (target: 500+ annually)',
          'Defensible space compliance rate (target: 85%+)',
          'Emergency alert system enrollment (target: 75% of households)',
          'Firewise USA community certification achieved',
          'Evacuation drill participation (target: 2,000+ residents annually)',
          'Fire ignition incidents (target: 30% reduction)',
        ],
        requiredDepartments: [
          'Fire Department',
          'Public Works',
          'Building & Safety',
          'Community Services',
          'IT Department (alert systems)',
          'City Manager\'s Office',
        ],
        stakeholders: [
          'Orange County Fire Authority',
          'Cal Fire',
          'Homeowners associations in hillside areas',
          'Environmental conservation groups',
          'Orange County Emergency Management',
          'Regional Park and Open Space District',
          'Utility companies (power line clearance)',
        ],
        fundingSources: [
          'California Fire Safe Council grants',
          'FEMA Pre-Disaster Mitigation grants',
          'CAL FIRE Fire Prevention grants',
          'Prop 68 wildfire resilience funding',
          'Orange County Fire Authority cost-sharing',
          'City General Fund allocation',
        ],
        similarCities: [
          {
            city: 'Rancho Santa Margarita, CA',
            outcome: 'Fuel reduction program protected community during 2020 fire season with zero losses',
          },
          {
            city: 'San Clemente, CA',
            outcome: 'Defensible space program achieved 90% compliance and reduced ignition risk 45%',
          },
          {
            city: 'Laguna Beach, CA',
            outcome: 'Emergency alert system enabled successful evacuation of 10,000+ during 2017 fire',
          },
        ],
        risks: [
          'Extreme fire weather overwhelming mitigation efforts',
          'Homeowner resistance to defensible space requirements',
          'Insufficient county/state resources during major incidents',
          'Budget constraints limiting fuel reduction scope',
          'Climate change increasing fire frequency and intensity',
          'Liability concerns limiting volunteer participation',
        ],
        category: 'environment',
      },
    ],
  },
];

// Helper function to get city by name
export const getCityByName = (name: string): CityData | undefined => {
  return mockCities.find(city => city.name.toLowerCase() === name.toLowerCase());
};

// Helper function to get cities by risk level
export const getCitiesByRisk = (riskLevel: 'high' | 'medium' | 'low'): CityData[] => {
  return mockCities.filter(city => city.riskLevel === riskLevel);
};

// Helper function to format metrics
export const formatMetric = (value: number, type: 'percentage' | 'currency' | 'number'): string => {
  switch (type) {
    case 'percentage':
      return `${(value * 100).toFixed(1)}%`;
    case 'currency':
      return `$${value.toLocaleString()}`;
    case 'number':
      return value.toLocaleString();
    default:
      return value.toString();
  }
};
