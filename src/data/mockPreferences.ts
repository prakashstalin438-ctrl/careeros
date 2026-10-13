import { JobPreferences } from '../types';

export const mockPreferences: JobPreferences = {
  targetRoles: [
    'Lead Gen AI Engineer',
    'Staff LLM Systems Engineer',
    'Senior AI / Machine Learning Engineer',
    'AI Solutions Architect',
  ],
  preferredLocations: [
    'Bengaluru, India',
    'Hyderabad, India',
    'Pune, India',
    'Remote (Global / India)',
  ],
  workModes: ['Remote', 'Hybrid'],
  minimumSalary: 30, // ₹30 LPA
  experienceLevel: 'Senior (3–7 years)',
  matchThreshold: 80, // Minimum 80% match to trigger application prep
  applicationMode: 'approval', // Default mode: Approval
  autoApplyDailyLimit: 5,
  requireSkillVerification: true,
  notifyOnApplicationPrep: true,
};
