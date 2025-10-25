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
  timeline: string;
  impact: string;
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
        timeline: '3-6 months to implement',
        impact: 'Could prevent 40-60 foreclosures annually',
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
        timeline: '4-8 months to implement',
        impact: 'Success rate of 30-45% in preventing foreclosure',
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
        timeline: '6-12 months for policy implementation',
        impact: '50-100 new affordable units over 5 years',
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
        timeline: '12-24 months',
        impact: 'Reduce car trips by 15%, add 200+ housing units',
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
        timeline: '6 months to staff and train',
        impact: 'Target 20-30% reduction in property crime',
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
        timeline: '4-6 months for ordinance and system',
        impact: 'Convert 30-50 units back to long-term housing',
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
        timeline: '6-12 months',
        impact: 'Train and place 150-250 residents annually',
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
        timeline: '8-12 months',
        impact: 'Launch 20-30 businesses, create 50-100 jobs',
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
        timeline: '6 months initial rollout',
        impact: 'Target 25% crime reduction over 3 years',
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
        timeline: '12-18 months for approval, 5-10 years construction',
        impact: 'Modernize infrastructure for next 50 years',
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
        timeline: 'Ongoing program with 6-month initial setup',
        impact: 'Reduce fire risk by 40%, improve evacuation time by 50%',
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
