import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { calculateSkillScores, getTopSkills } from '@/utils/skillTestUtils';

interface QuestionOption {
  label: string;
  relatedSkills: string[];
  nextQuestionId?: string;
}

interface Question {
  id: string;
  questionid: string;
  category: string;
  questiontext: string;
  options: QuestionOption[];
  order: number | null;
  isactive: boolean;
}

interface UserAnswer {
  questionId: string;
  selectedLabel: string;
  relatedSkills: string[];
}

export function DynamicSkillTest() {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('Q1');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionHistory, setQuestionHistory] = useState<string[]>(['Q1']);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch all active questions
  const { data: questions, isLoading } = useQuery({
    queryKey: ['dynamicTestQuestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dynamictestquestions')
        .select('*')
        .eq('isactive', true)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      // Transform the data to match our interface
      return data.map(item => ({
        id: item.id,
        questionid: item.questionid,
        category: item.category,
        questiontext: item.questiontext,
        options: (item.options as unknown) as QuestionOption[],
        order: item.order,
        isactive: item.isactive
      })) as Question[];
    }
  });

  // Get current question
  const currentQuestion = questions?.find(q => q.questionid === currentQuestionId);

  const saveAnswer = async (questionId: string, selectedLabel: string, relatedSkills: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your answers.",
          variant: "destructive"
        });
        return;
      }

      console.log('Saving answer for question:', questionId, 'user:', user.id);

      const { error } = await supabase
        .from('usertestanswers')
        .upsert({
          userid: user.id,
          questionid: questionId,
          selectedlabel: selectedLabel,
          relatedskills: relatedSkills
        }, {
          onConflict: 'userid,questionid'
        });

      if (error) {
        console.error('Error saving answer:', error);
        toast({
          title: "Error saving answer",
          description: "Please try again.",
          variant: "destructive"
        });
      } else {
        console.log('Answer saved successfully');
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      toast({
        title: "Error saving answer",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    if (!selectedOption || !currentQuestion) {
      toast({
        title: "Please select an option",
        variant: "destructive"
      });
      return;
    }

    // Find the selected option details
    const selectedOptionData = currentQuestion.options.find(opt => opt.label === selectedOption);
    
    if (!selectedOptionData) {
      toast({
        title: "Invalid selection",
        variant: "destructive"
      });
      return;
    }

    // Save the answer
    const newAnswer: UserAnswer = {
      questionId: currentQuestionId,
      selectedLabel: selectedOption,
      relatedSkills: selectedOptionData.relatedSkills
    };

    setAnswers(prev => [...prev.filter(a => a.questionId !== currentQuestionId), newAnswer]);
    
    // Save to database
    await saveAnswer(currentQuestionId, selectedOption, selectedOptionData.relatedSkills);

    // Determine next question
    let nextQuestionId: string | null = null;

    if (selectedOptionData.nextQuestionId) {
      // Use branching logic
      const nextQuestion = questions?.find(q => q.questionid === selectedOptionData.nextQuestionId);
      if (nextQuestion) {
        nextQuestionId = selectedOptionData.nextQuestionId;
      }
    }

    // If no branching or next question not found, use linear progression
    if (!nextQuestionId) {
      const currentIndex = questions?.findIndex(q => q.questionid === currentQuestionId) || 0;
      const nextQuestion = questions?.[currentIndex + 1];
      nextQuestionId = nextQuestion?.questionid || null;
    }

    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
      setQuestionHistory(prev => [...prev, nextQuestionId]);
      setSelectedOption(null);
    } else {
      // No more questions, finish the test
      finishTest();
    }
  };

  const handlePrevious = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop(); // Remove current question
      const previousQuestionId = newHistory[newHistory.length - 1];
      
      setQuestionHistory(newHistory);
      setCurrentQuestionId(previousQuestionId);
      
      // Get the previous answer if it exists
      const previousAnswer = answers.find(a => a.questionId === previousQuestionId);
      setSelectedOption(previousAnswer?.selectedLabel || null);
    }
  };

  const finishTest = async () => {
    // Calculate skill scores using the utility function
    const skillScores = calculateSkillScores(answers);
    const topSkills = getTopSkills(skillScores, 3);

    console.log('Test completed! Top skills:', topSkills);
    console.log('All answers:', answers);

    toast({
      title: "Test completed!",
      description: `Your top skills: ${topSkills.map(s => s.skill).join(', ')}`,
    });

    navigate('/profile');
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6 text-center">
          <h3 className="text-xl font-medium mb-4">No Questions Available</h3>
          <p className="text-gray-600 mb-4">There are currently no active test questions.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6 text-center">
          <h3 className="text-xl font-medium mb-4">Question Not Found</h3>
          <p className="text-gray-600 mb-4">The requested question could not be found.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const progress = (questionHistory.length / Math.max(questions.length, 10)) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Dynamic Skill Assessment</h2>
          <span className="text-sm text-gray-500">
            Question {questionHistory.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-gray-400 mt-1">
          Category: {currentQuestion.category}
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-6">{currentQuestion.questiontext}</h3>
        
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedOption === option.label;
            
            return (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-cyan-100 border-cyan-200' 
                    : 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100'
                }`}
                onClick={() => setSelectedOption(option.label)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-cyan-200 text-cyan-600 font-medium">
                  {letter}
                </div>
                <div className="flex-1">
                  <div className="text-base cursor-pointer block">
                    {option.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between">
          <Button 
            onClick={handlePrevious}
            variant="outline"
            disabled={questionHistory.length <= 1}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-breneo-blue hover:bg-breneo-blue/90"
          >
            Next Question
          </Button>
        </div>
      </Card>

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>This dynamic test adapts based on your answers to provide personalized career recommendations.</p>
      </div>
    </div>
  );
}
