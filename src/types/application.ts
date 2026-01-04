export type ApplicationStatus = 
  | 'applied' 
  | 'hr-call' 
  | 'technical' 
  | 'offer' 
  | 'rejected' 
  | 'no-response';

export type ApplicationSource = 
  | 'linkedin' 
  | 'company-website' 
  | 'referral' 
  | 'indeed' 
  | 'other';

export interface Application {
  id: string;
  company: string;
  position: string;
  submissionDate: string;
  source: ApplicationSource;
  status: ApplicationStatus;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  notes?: string;
  lastContactDate?: string;
  nextFollowUp?: string;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  'applied': 'Applied',
  'hr-call': 'HR Call',
  'technical': 'Technical Interview',
  'offer': 'Offer',
  'rejected': 'Rejected',
  'no-response': 'No Response',
};

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  'linkedin': 'LinkedIn',
  'company-website': 'Company Website',
  'referral': 'Referral',
  'indeed': 'Indeed',
  'other': 'Other',
};
