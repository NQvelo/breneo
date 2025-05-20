
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Mock courses data
const COURSES = [
  {
    id: 1,
    title: 'UI/UX Design Fundamentals',
    provider: 'DesignAcademy',
    category: 'Design',
    level: 'Beginner',
    duration: '4 weeks',
    match: 95,
    enrolled: false,
    popular: true,
    image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=60',
    description: 'Learn the core principles of UI/UX design and how to create engaging user experiences.',
    topics: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
  },
  {
    id: 2,
    title: 'Digital Marketing Mastery',
    provider: 'MarketingPro',
    category: 'Marketing',
    level: 'Intermediate',
    duration: '6 weeks',
    match: 88,
    enrolled: false,
    popular: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    description: 'Master digital marketing techniques and strategies across multiple platforms.',
    topics: ['Social Media Marketing', 'SEO', 'Email Campaigns', 'Analytics'],
  },
  {
    id: 3,
    title: 'React Frontend Development',
    provider: 'CodeMasters',
    category: 'Tech',
    level: 'Intermediate',
    duration: '8 weeks',
    match: 92,
    enrolled: true,
    popular: true,
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60',
    description: 'Build modern web applications with React and related frontend technologies.',
    topics: ['React Components', 'State Management', 'Hooks', 'Performance Optimization'],
  },
  {
    id: 4,
    title: 'Business Strategy Fundamentals',
    provider: 'BusinessSchool',
    category: 'Business',
    level: 'Beginner',
    duration: '5 weeks',
    match: 75,
    enrolled: false,
    popular: false,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=60',
    description: 'Learn the essentials of business strategy and management principles.',
    topics: ['Strategic Planning', 'Market Analysis', 'Competitive Advantage', 'Business Models'],
  },
  {
    id: 5,
    title: 'Data Science Essentials',
    provider: 'DataLearn',
    category: 'Tech',
    level: 'Advanced',
    duration: '10 weeks',
    match: 80,
    enrolled: false,
    popular: true,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    description: 'Master the fundamentals of data science, from statistics to machine learning.',
    topics: ['Python for Data', 'Statistical Analysis', 'Machine Learning', 'Data Visualization'],
  },
];

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  
  // Filter courses based on search and tab
  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'enrolled') return matchesSearch && course.enrolled;
    if (currentTab === 'recommended') return matchesSearch && course.match > 85;
    
    return false;
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-breneo-navy mb-6">Learning Paths</h1>
        
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
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Courses</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
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
                    <span className="bg-breneo-blue/10 text-breneo-blue text-sm px-3 py-1 rounded-full">
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
