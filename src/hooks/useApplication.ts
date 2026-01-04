import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Application } from '@/types/application';


const GUEST_STORAGE_KEY = 'guest_applications';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);


  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
        setIsGuestMode(false);
      } else {
        setUserId(null);
      
        const hasGuestData = localStorage.getItem(GUEST_STORAGE_KEY);
        if (hasGuestData) {
          setIsGuestMode(true);
          loadGuestApplications();
        } else {
          setApplications([]);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loadGuestApplications = () => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        const apps = JSON.parse(stored);
        setApplications(apps);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading guest applications:', error);
      setIsLoading(false);
    }
  };


  const saveGuestApplications = (apps: Application[]) => {
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(apps));
    } catch (error) {
      console.error('Error saving guest applications:', error);
    }
  };


  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const q = query(
      collection(db, 'applications'),
      where('userId', '==', userId),
      orderBy('submissionDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const apps: Application[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as Application;
        });
        setApplications(apps);
        setIsLoading(false);
      },
      error => {
        console.error('Firestore snapshot error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Add new application
  const addApplication = async (data: Omit<Application, 'id'>) => {
    // Guest mode
    if (isGuestMode || !userId) {
      const newApp: Application = {
        ...data,
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recruiterEmail: data.recruiterEmail || null,
        lastContactDate: data.lastContactDate || null,
        notes: data.notes || null,
        submissionDate: data.submissionDate || new Date().toISOString(),
        status: data.status || 'applied',
      };
      
      const updatedApps = [...applications, newApp];
      setApplications(updatedApps);
      saveGuestApplications(updatedApps);
      
 
      if (!isGuestMode) {
        setIsGuestMode(true);
      }
      
      return newApp;
    }

   
    const newApp = {
      ...data,
      recruiterEmail: data.recruiterEmail || null,
      lastContactDate: data.lastContactDate || null,
      notes: data.notes || null,
      userId,
      submissionDate: data.submissionDate || new Date().toISOString(),
      status: data.status || 'applied',
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'applications'), newApp);
      return { id: docRef.id, ...newApp } as Application;
    } catch (error) {
      console.error('Error adding application:', error);
      throw error;
    }
  };

 
  const updateApplication = async (id: string, updates: Partial<Application>) => {
   
    if (isGuestMode || id.startsWith('guest_')) {
      const updatedApps = applications.map(app =>
        app.id === id ? { ...app, ...updates } : app
      );
      setApplications(updatedApps);
      saveGuestApplications(updatedApps);
      return;
    }
    const docRef = doc(db, 'applications', id);

    const cleanUpdates: Record<string, unknown> = { ...updates };
    
    if (cleanUpdates.recruiterEmail === undefined) cleanUpdates.recruiterEmail = null;
    if (cleanUpdates.lastContactDate === undefined) cleanUpdates.lastContactDate = null;
    if (cleanUpdates.notes === undefined) cleanUpdates.notes = null;
    
    delete cleanUpdates.id;
    delete cleanUpdates.userId;
    delete cleanUpdates.createdAt;

    try {
      await updateDoc(docRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  };

  const deleteApplication = async (id: string) => {
    
    if (isGuestMode || id.startsWith('guest_')) {
      const updatedApps = applications.filter(app => app.id !== id);
      setApplications(updatedApps);
      saveGuestApplications(updatedApps);
      return;
    }
    const docRef = doc(db, 'applications', id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  };

  const getApplicationsNeedingFollowUp = (): Application[] => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return applications.filter(app => {
      if (app.status === 'rejected' || app.status === 'offer') return false;

      const lastContact = app.lastContactDate
        ? new Date(app.lastContactDate)
        : new Date(app.submissionDate);

      return lastContact < sevenDaysAgo;
    });
  };

  return {
    applications,
    isLoading,
    addApplication,
    updateApplication,
    deleteApplication,
    getApplicationsNeedingFollowUp,
  };
}