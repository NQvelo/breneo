
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const INTERESTS = [
  { id: 1, name: 'Marketing', icon: '📣' },
  { id: 2, name: 'Tech', icon: '💻' },
  { id: 3, name: 'Design', icon: '🎨' },
  { id: 4, name: 'Business', icon: '💼' },
  { id: 5, name: 'Education', icon: '📚' },
  { id: 6, name: 'Science', icon: '🔬' },
  { id: 7, name: 'Healthcare', icon: '⚕️' },
  { id: 8, name: 'Finance', icon: '💰' },
  { id: 9, name: 'Arts', icon: '🎭' },
];

export function InterestsSelection() {
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateUserProfile } = useAuth();

  const toggleInterest = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      toast({
        title: "Please select at least one area of interest",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Convert selected IDs to interest names
      const selectedInterests = selected.map(id => 
        INTERESTS.find(interest => interest.id === id)?.name
      ).filter(Boolean);

      // Update user profile with interests and mark onboarding as complete
      await updateUserProfile({
        interests: selectedInterests,
        onboarding_completed: true
      });

      toast({
        title: "Interests saved!",
        description: "Your personalized experience is ready.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving interests:', error);
      toast({
        title: "Error saving interests",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <img src="/lovable-uploads/6bee4aa6-3a7f-4806-98bd-dc73a1955812.png" alt="Breneo Logo" className="h-12 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-breneo-navy mb-2">What are you interested in?</h1>
        <p className="text-gray-600">Select areas you'd like to explore. This helps us personalize your experience.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {INTERESTS.map((interest) => (
          <Card 
            key={interest.id}
            className={`p-4 cursor-pointer transition-all border-2 ${
              selected.includes(interest.id) 
                ? 'border-breneo-blue bg-breneo-blue/5' 
                : 'border-transparent hover:border-gray-200'
            }`}
            onClick={() => toggleInterest(interest.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{interest.icon}</div>
              <div className="font-medium">{interest.name}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={loading}
          className="bg-breneo-blue hover:bg-breneo-blue/90"
        >
          {loading ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
