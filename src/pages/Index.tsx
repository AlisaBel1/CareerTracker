import { useState, useEffect, useMemo } from 'react';
import { Plus, Briefcase, Clock, CheckCircle, XCircle, Bell, LogOut, User, Sparkles } from 'lucide-react';
import { useApplications } from '@/hooks/useApplication';
import { Application, ApplicationStatus } from '@/types/application';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/StatsCard';
import { ApplicationCard } from '@/components/ApplicationCard';
import { ApplicationForm } from '@/components/ApplicationForm';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { AuthForm } from '@/components/AuthForm';
import { User as FirebaseUser } from 'firebase/auth';
import { cn } from '@/lib/utils';

const Index = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [useGuestMode, setUseGuestMode] = useState(false);
  const { applications, isLoading, addApplication, updateApplication, deleteApplication, getApplicationsNeedingFollowUp } = useApplications();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | undefined>();
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'all'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        setUseGuestMode(false);
        setShowAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUseGuestMode(false);
      toast({ title: 'Signed out', description: 'Come back soon!' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to sign out.',
        variant: 'destructive' 
      });
    }
  };

  const handleContinueAsGuest = () => {
    setUseGuestMode(true);
    setShowAuth(false);
    toast({ 
      title: '🎉 Welcome!', 
      description: 'You\'re in guest mode. Sign up anytime to sync your data.',
      duration: 5000
    });
  };

  const followUpsNeeded = getApplicationsNeedingFollowUp();

  const stats = useMemo(() => ({
    total: applications.length,
    inProgress: applications.filter(a => ['applied', 'hr-call', 'technical'].includes(a.status)).length,
    offers: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    needsFollowUp: followUpsNeeded.length,
  }), [applications, followUpsNeeded]);

  const filteredApplications = useMemo(() => {
    if (activeFilter === 'all') return applications;
    return applications.filter(app => app.status === activeFilter);
  }, [applications, activeFilter]);

  const handleSubmit = async (data: Omit<Application, 'id'>) => {
    try {
      if (editingApplication) {
        await updateApplication(editingApplication.id, data);
        toast({ 
          title: ' Updated', 
          description: `${data.company} - ${data.position} updated.` 
        });
      } else {
        await addApplication(data);
        toast({ 
          title: 'Added', 
          description: `${data.company} - ${data.position} added.` 
        });
      }
      setEditingApplication(undefined);
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (app: Application) => {
    setEditingApplication(app);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const app = applications.find(a => a.id === id);
    try {
      await deleteApplication(id);
      toast({
        title: ' Deleted',
        description: app ? `${app.company} removed.` : 'Application removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete.',
        variant: 'destructive',
      });
    }
  };


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user && !useGuestMode && !showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl">
                <Briefcase className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Application Tracker
            </h1>
            <p className="text-gray-600 text-lg">Your career journey starts here</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => {
                setUseGuestMode(false);
                setShowAuth(true);
              }}

              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
            >
              <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Sign In / Sign Up
            </Button>

            <Button 
              onClick={handleContinueAsGuest}
              variant="outline"
              className="w-full py-6 text-lg rounded-xl border-2 hover:bg-gray-50 transition-all duration-300"
            >
              <User className="h-5 w-5 mr-2" />
              Continue as Guest
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="p-1.5 bg-yellow-400 rounded-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 mb-1">Choose your experience:</p>
                <p className="text-yellow-800">
                  <strong>Guest:</strong> Try instantly, data stays local<br/>
                  <strong>Account:</strong> Sync everywhere, never lose data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auth form
  if (showAuth && !user && !useGuestMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="relative">
          <button
            onClick={() => setShowAuth(false)}
            className="absolute -top-4 -left-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 z-10 transition-all duration-300 hover:scale-110"
          >
            ← Back
          </button>
          <AuthForm />
        </div>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern header with glassmorphism */}
      <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative container py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Application Tracker</h1>
              </div>
              <p className="text-white/90 text-lg">Your journey well-organized and structured</p>
              {user && (
                <p className="text-white/70 text-sm mt-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {user.email}
                </p>
              )}
              {useGuestMode && (
                <p className="text-white/70 text-sm mt-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Guest Mode
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsFormOpen(true)} 
                className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Application
              </Button>
              {user ? (
                <Button 
                  onClick={handleSignOut} 
                  variant="outline"
                  className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : useGuestMode ? (
                <Button 
                  onClick={() => {
                    setUseGuestMode(false);
                    setShowAuth(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Guest mode banner */}
        {useGuestMode && (
          <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10" />
            <div className="relative p-6 flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-xl shadow-md">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 text-lg mb-1">Guest Mode active</h3>
                <p className="text-yellow-800 mb-3">
                  Your data is stored locally. Create an account to sync everywhere and never lose your progress!
                </p>
                <Button 
                  onClick={() => {
                    setUseGuestMode(false);
                    setShowAuth(true);
                  }}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create free account
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stats with animations */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatsCard title="Total" value={stats.total} icon={Briefcase} color="bg-blue-500" />
          <StatsCard title="In Progress" value={stats.inProgress} icon={Clock} color="bg-yellow-500" />
          <StatsCard title="Offers" value={stats.offers} icon={CheckCircle} color="bg-green-500" />
          <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} color="bg-red-500" />
          <StatsCard title="Follow-up" value={stats.needsFollowUp} icon={Bell} color="bg-orange-500" />
        </div>

        {/* Follow-up Alert */}
        {followUpsNeeded.length > 0 && (
          <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10" />
            <div className="relative p-6 flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-orange-500 rounded-xl shadow-md animate-pulse">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900 text-lg mb-1">
                  {followUpsNeeded.length} Application{followUpsNeeded.length > 1 ? 's' : ''} Need attention
                </h3>
                <p className="text-orange-800">
                  These applications haven't received a response in over 7 days. Time to follow up!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Applications Grid */}
        {applications.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                needsFollowUp={followUpsNeeded.some(f => f.id === app.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState onAddClick={() => setIsFormOpen(true)} />
        )}
      </main>

      <footer className="mt-16 py-8 text-center text-sm text-gray-500">
      <a href="https://github.com/AlisaBel1" target="_blank"
      className="underline hover:text-blue-500"
    >
    My GitHub Alisa Biliavska
    </a>
      <p className="mt-1 text-xs text-gray-400">
      Application Tracker © {new Date().getFullYear()}
      </p>
</footer>


      {/* Modal Form */}
      <ApplicationForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingApplication(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={editingApplication}
      />
    </div>
  );
};

export default Index;