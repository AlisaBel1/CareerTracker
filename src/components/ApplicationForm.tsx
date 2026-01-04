import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Application,
  ApplicationSource,
  ApplicationStatus,
  SOURCE_LABELS,
  STATUS_LABELS,
} from '@/types/application';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


const applicationSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100),
  position: z.string().min(1, 'Position is required').max(100),
  submissionDate: z.string().min(1, 'Submission date is required'),
  source: z.enum(['linkedin', 'company-website', 'referral', 'indeed', 'other']),
  status: z.enum(['applied', 'hr-call', 'technical', 'offer', 'rejected', 'no-response']),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().email().optional().or(z.literal('')),
  recruiterPhone: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof applicationSchema>;



interface ApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Application, 'id'>) => void;
  initialData?: Application;
}


export function ApplicationForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ApplicationFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: '',
      position: '',
      submissionDate: '',
      source: 'linkedin',
      status: 'applied',
      recruiterName: '',
      recruiterEmail: '',
      recruiterPhone: '',
      notes: '',
    },
  });

 
  useEffect(() => {
    if (initialData) {
      form.reset({
        company: initialData.company,
        position: initialData.position,
        submissionDate: initialData.submissionDate,
        source: initialData.source,
        status: initialData.status,
        recruiterName: initialData.recruiterName || '',
        recruiterEmail: initialData.recruiterEmail || '',
        recruiterPhone: initialData.recruiterPhone || '',
        notes: initialData.notes || '',
      });
    } else {
      form.reset({
        company: '',
        position: '',
        submissionDate: new Date().toISOString().split('T')[0],
        source: 'linkedin',
        status: 'applied',
        recruiterName: '',
        recruiterEmail: '',
        recruiterPhone: '',
        notes: '',
      });
    }
  }, [initialData, open, form]);



  const handleSubmit = (data: FormData) => {
    onSubmit({
      company: data.company,
      position: data.position,
      submissionDate: data.submissionDate,
      source: data.source,
      status: data.status,
      recruiterName: data.recruiterName || undefined,
      recruiterEmail: data.recruiterEmail || undefined,
      recruiterPhone: data.recruiterPhone || undefined,
      notes: data.notes || undefined,
      lastContactDate: data.submissionDate,
    });

    onOpenChange(false);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Application' : 'Add New Application'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            {/* Company / Position */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Frontend Intern" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date / Source */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="submissionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Submission Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.keys(SOURCE_LABELS) as ApplicationSource[]).map(
                          (source) => (
                            <SelectItem key={source} value={source}>
                              {SOURCE_LABELS[source]}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Recruiter */}
            <div className="border-t pt-4 space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                Recruiter Contact (optional)
              </p>

              <FormField
                control={form.control}
                name="recruiterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recruiterEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recruiterPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? 'Save Changes' : 'Add Application'}
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
