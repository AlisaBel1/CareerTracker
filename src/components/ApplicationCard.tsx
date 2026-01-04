import { Building2, Calendar, Mail, Edit, Trash2, Bell, ExternalLink } from 'lucide-react';
import { Application } from '@/types/application';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: Application;
  needsFollowUp?: boolean;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  applied: { 
    label: 'Applied', 
    color: 'bg-blue-500', 
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-600'
  },
  'hr-call': { 
    label: 'HR Interview', 
    color: 'bg-purple-500', 
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    gradient: 'from-purple-500 to-purple-600'
  },
  technical: { 
    label: 'Technical', 
    color: 'bg-indigo-500', 
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  offer: { 
    label: 'Offer', 
    color: 'bg-green-500', 
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    gradient: 'from-green-500 to-green-600'
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-500', 
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    gradient: 'from-red-500 to-red-600'
  },
  'no-response': { 
    label: 'No Response', 
    color: 'bg-gray-500', 
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    gradient: 'from-gray-500 to-gray-600'
  },
};

export const ApplicationCard = ({ application, needsFollowUp, onEdit, onDelete }: ApplicationCardProps) => {
  const config = statusConfig[application.status];

  return (
    <div 
      className={cn(
        "group relative bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1 hover:border-opacity-50",
        config.borderColor
      )}
    >
      {/* Animated gradient bar at top */}
      <div className={cn("h-1.5 bg-gradient-to-r", config.gradient)} />
      
      {/* Follow-up badge */}
      {needsFollowUp && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pulse shadow-lg">
            <Bell className="h-3 w-3" />
            Follow-up
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Company & Position */}
        <div className="mb-4">
          <div className="flex items-start gap-3 mb-2">
            <div className={cn(
              "p-2 rounded-xl transition-transform duration-300 group-hover:scale-110",
              config.bgColor
            )}>
              <Building2 className={cn("h-5 w-5", config.color.replace('bg-', 'text-'))} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {application.company}
              </h3>
              <p className="text-sm text-gray-600 truncate">{application.position}</p>
            </div>
          </div>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 mt-2">
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm",
              "transition-all duration-300 group-hover:shadow-md",
              config.color
            )}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Applied: {new Date(application.submissionDate).toLocaleDateString()}</span>
          </div>
          
          {application.recruiterEmail && (
            <div className="flex items-center gap-2 text-sm text-gray-600 group/email">
              <Mail className="h-4 w-4 text-gray-400" />
              <a 
                href={`mailto:${application.recruiterEmail}`}
                className="hover:text-blue-600 transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {application.recruiterEmail}
              </a>
            </div>
          )}

          {application.notes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-600 line-clamp-2">{application.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button
            onClick={() => onEdit(application)}
            variant="outline"
            size="sm"
            className="flex-1 group/btn hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            Edit
          </Button>
          <Button
            onClick={() => onDelete(application.id)}
            variant="outline"
            size="sm"
            className="flex-1 group/btn hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            Delete
          </Button>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" 
             style={{ width: '50%', opacity: 0.1 }} />
      </div>
    </div>
  );
};


interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

export const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => {
  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-opacity-50">
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300",
        color
      )} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className={cn(
            "p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12",
            color, "bg-opacity-10"
          )}>
            <Icon className={cn("h-5 w-5", color.replace('bg-', 'text-'))} />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-110">
          {value}
        </p>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-current rounded-2xl transition-colors duration-300"
           style={{ borderColor: 'currentColor', opacity: 0.2 }} />
    </div>
  );
};


interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState = ({ onAddClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-8">
        {/* Animated circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-ping" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-purple-500 rounded-full opacity-10 animate-pulse" />
        </div>
        
        {/* Icon */}
        <div className="relative p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-2 border-blue-100">
          <Building2 className="h-16 w-16 text-blue-500" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Start tracking your job applications and stay organized throughout your job search journey.
      </p>
      
      <button
        onClick={onAddClick}
        className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Add Your First Application
        </span>
        
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
};