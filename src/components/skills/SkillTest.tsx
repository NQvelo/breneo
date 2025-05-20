
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

// Mock questions for the skill test
const QUESTIONS = [
  {
    id: 1,
    question: 'Which of the following best describes your experience with data analysis?',
    options: [
      { id: 'a', text: 'No experience' },
      { id: 'b', text: 'Basic understanding of concepts' },
      { id: 'c', text: 'Worked on a few projects' },
      { id: 'd', text: 'Advanced skills with multiple tools' }
    ]
  },
  {
    id: 2,
    question: 'How comfortable are you with public speaking?',
    options: [
      { id: 'a', text: 'Very uncomfortable' },
      { id: 'b', text: 'Somewhat uncomfortable' },
      { id: 'c', text: 'Comfortable' },
      { id: 'd', text: 'Very comfortable' }
    ]
  },
  {
    id: 3,
    question: 'How do you prefer to solve problems?',
    options: [
      { id: 'a', text: 'Independently research and analyze' },
      { id: 'b', text: 'Collaborate with a team' },
      { id: 'c', text: 'Follow established procedures' },
      { id: 'd', text: 'Innovative, out-of-the-box thinking' }
    ]
  }
];

export function SkillTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (selectedOption) {
      // Save the answer
      setAnswers({ ...answers, [QUESTIONS[currentQuestion].id]: selectedOption });
      
      // Move to next question or finish test
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Finish the test
        finishTest();
      }
    } else {
      toast({
        title: "Please select an option",
        variant: "destructive"
      });
    }
  };

  const finishTest = () => {
    toast({
      title: "Test completed!",
      description: "Your personalized results are ready.",
    });
    navigate('/dashboard');
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Skill Assessment Test</h2>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} of {QUESTIONS.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-medium mb-6">{QUESTIONS[currentQuestion].question}</h3>
        
        <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
          <div className="space-y-4">
            {QUESTIONS[currentQuestion].options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <label htmlFor={option.id} className="ml-2 text-base">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleNext}
            className="bg-breneo-blue hover:bg-breneo-blue/90"
          >
            {currentQuestion < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Test'}
          </Button>
        </div>
      </Card>

      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>This test adapts based on your responses to better assess your skills.</p>
      </div>
    </div>
  );
}
