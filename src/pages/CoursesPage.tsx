
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculateSkillScores, getTopSkills } from '@/utils/skillTestUtils';
import { useQuery } from '@tanstack/react-query';

interface Course {
  id: number;
  title: string;
  provider: string;
  category: string;
  level: string;
  duration: string;
  match: number;
  enrolled: boolean;
  popular: boolean;
  image: string;
  description: string;
  topics: string[];
  requiredSkills: string[];
}

// Real courses data with skill requirements
const REAL_COURSES: Course[] = [
  {
    id: 1,
    title: 'UI/UX Design Fundamentals',
    provider: 'DesignAcademy',
    category: 'Design',
    level: 'Beginner',
    duration: '4 weeks',
    match: 0,
    enrolled: false,
    popular: true,
    image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=60',
    description: 'Learn the core principles of UI/UX design and how to create engaging user experiences.',
    topics: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
    requiredSkills: ['Designer', 'Creative'],
  },
  {
    id: 2,
    title: 'Digital Marketing Mastery',
    provider: 'MarketingPro',
    category: 'Marketing',
    level: 'Intermediate',
    duration: '6 weeks',
    match: 0,
    enrolled: false,
    popular: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    description: 'Master digital marketing techniques and strategies across multiple platforms.',
    topics: ['Social Media Marketing', 'SEO', 'Email Campaigns', 'Analytics'],
    requiredSkills: ['Marketer', 'Analyst'],
  },
  {
    id: 3,
    title: 'React Frontend Development',
    provider: 'CodeMasters',
    category: 'Tech',
    level: 'Intermediate',
    duration: '8 weeks',
    match: 0,
    enrolled: false,
    popular: true,
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60',
    description: 'Build modern web applications with React and related frontend technologies.',
    topics: ['React Components', 'State Management', 'Hooks', 'Performance Optimization'],
    requiredSkills: ['Developer', 'Technical'],
  },
  {
    id: 4,
    title: 'Business Strategy Fundamentals',
    provider: 'BusinessSchool',
    category: 'Business',
    level: 'Beginner',
    duration: '5 weeks',
    match: 0,
    enrolled: false,
    popular: false,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=60',
    description: 'Learn the essentials of business strategy and management principles.',
    topics: ['Strategic Planning', 'Market Analysis', 'Competitive Advantage', 'Business Models'],
    requiredSkills: ['Project Manager', 'Analyst'],
  },
  {
    id: 5,
    title: 'Data Science Essentials',
    provider: 'DataLearn',
    category: 'Tech',
    level: 'Advanced',
    duration: '10 weeks',
    match: 0,
    enrolled: false,
    popular: true,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    description: 'Master the fundamentals of data science, from statistics to machine learning.',
    topics: ['Python for Data', 'Statistical Analysis', 'Machine Learning', 'Data Visualization'],
    requiredSkills: ['Developer', 'Analyst'],
  },
  {
    id: 6,
    title: 'Project Management Professional',
    provider: 'PMI Institute',
    category: 'Management',
    level: 'Intermediate',
    duration: '12 weeks',
    match: 0,
    enrolled: false,
    popular: true,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60',
    description: 'Comprehensive project management training covering methodologies and best practices.',
    topics: ['Agile/Scrum', 'Risk Management', 'Resource Planning', 'Team Leadership'],
    requiredSkills: ['Project Manager', 'Leader'],
  },
  {
    id: 7,
    title: 'Teaching and Training Skills',
    provider: 'EduMasters',
    category: 'Education',
    level: 'Beginner',
    duration: '6 weeks',
    match: 0,
    enrolled: false,
    popular: false,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=60',
    description: 'Develop effective teaching and training skills for various learning environments.',
    topics: ['Learning Psychology', 'Curriculum Design', 'Assessment Methods', 'Digital Tools'],
    requiredSkills: ['Teacher', 'Communicator'],
  },
  {
    id: 8,
    title: 'Advanced JavaScript Programming',
    provider: 'CodeMasters',
    category: 'Tech',
    level: 'Advanced',
    duration: '10 weeks',
    match: 0,
    enrolled: false,
    popular: true,
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60',
    description: 'Deep dive into advanced JavaScript concepts and modern development practices.',
    topics: ['ES6+ Features', 'Async Programming', 'Design Patterns', 'Performance Optimization'],
    requiredSkills: ['Developer', 'Technical'],
  },
];

const CoursesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [coursesWithMatches, setCoursesWithMatches] = useState<Course[]>(REAL_COURSES);

  // Fetch user's skill test results
  const { data: userSkills, isLoading: skillsLoading } = useQuery({
    queryKey: ['userSkills', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: answers, error } = await supabase
        .from('usertestanswers')
        .select('*')
        .eq('userid', user.id);

      if (error || !answers || answers.length === 0) {
        return [];
      }

      const skillScores = calculateSkillScores(answers);
      const topSkills = getTopSkills(skillScores, 10);
      
      return topSkills.map(skill => skill.skill);
    },
    enabled: !!user
  });

  // Calculate course matches based on user skills
  useEffect(() => {
    if (!userSkills || userSkills.length === 0) {
      setCoursesWithMatches(REAL_COURSES);
      return;
    }

    const coursesWithCalculatedMatches = REAL_COURSES.map(course => {
      // Calculate match percentage based on skill overlap
      const matchingSkills = course.requiredSkills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      
      const matchPercentage = course.requiredSkills.length > 0 
        ? Math.round((matchingSkills.length / course.requiredSkills.length) * 100)
        : 50; // Default match for courses without specific skill requirements

      return {
        ...course,
        match: Math.max(matchPercentage, 25) // Minimum 25% match for variety
      };
    });

    // Sort by match percentage (highest first)
    const sortedCourses = coursesWithCalculatedMatches.sort((a, b) => b.match - a.match);
    setCoursesWithMatches(sortedCourses);
  }, [userSkills]);
  
  // Filter courses based on search and tab
  const filteredCourses = coursesWithMatches.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'enrolled') return matchesSearch && course.enrolled;
    if (currentTab === 'recommended') return matchesSearch && course.match > 70;
    
    return false;
  });

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-breneo-navy">Learning Paths</h1>
          {skillsLoading && (
            <div className="text-sm text-gray-500">Loading your skill profile...</div>
          )}
          {userSkills && userSkills.length > 0 && (
            <div className="text-sm text-gray-600">
              Personalized based on your skills: {userSkills.slice(0, 3).join(', ')}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search courses by title, provider, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl"
          />
        </div>
        
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Courses ({coursesWithMatches.length})</TabsTrigger>
            <TabsTrigger value="enrolled">My Courses</TabsTrigger>
            <TabsTrigger value="recommended">
              Recommended ({coursesWithMatches.filter(c => c.match > 70).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{course.title}</h3>
                    {course.popular && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-500 text-sm">{course.provider}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">{course.level}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">{course.duration}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3">{course.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {course.topics.slice(0, 3).map((topic, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                      {course.topics.length > 3 && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          +{course.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      course.match >= 80 ? 'bg-green-100 text-green-800' :
                      course.match >= 60 ? 'bg-blue-100 text-blue-800' :
                      course.match >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.match}% Match
                    </span>
                    <Button size="sm" variant={course.enrolled ? "outline" : "default"} className={course.enrolled ? "" : "bg-breneo-blue hover:bg-breneo-blue/90"}>
                      {course.enrolled ? 'Continue' : 'Enroll'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border">
              <p className="text-gray-500 mb-4">No courses found matching your criteria</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setCurrentTab('all');
                }}
              >
                Reset Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
