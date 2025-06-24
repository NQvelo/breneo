import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  url: string;
  created_at: string;
  company_logo?: string;
  remote?: boolean;
}

const fetchJobs = async () => {
  const baseUrl = 'https://remotive.com/api/remote-jobs';
  const params = new URLSearchParams();
  params.append('limit', '5'); // Get only 5 jobs for dashboard
  
  const response = await fetch(`${baseUrl}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  const data = await response.json();
  return data.jobs || [];
};

const Dashboard = () => {
  const { user } = useAuth();
  
  // Get user name from auth context
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  // Mock user data - keeping skillTestTaken as mock for now
  const userState = {
    name: userName,
    skillTestTaken: false
  };

  // Fetch real jobs
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useQuery({
    queryKey: ['dashboard-jobs'],
    queryFn: fetchJobs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform jobs for display
  const recommendedJobs = jobs.slice(0, 2).map((job: any) => ({
    id: job.id,
    title: job.title,
    company: job.company_name,
    match: Math.floor(Math.random() * 30) + 70, // Random match percentage for demo
  }));

  // Mock course recommendations
  const recommendedCourses = [
    { id: 1, title: 'UI/UX Fundamentals', provider: 'DesignAcademy', duration: '4 weeks' },
    { id: 2, title: 'Digital Marketing Essentials', provider: 'LearnOnline', duration: '6 weeks' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-breneo-navy">Welcome, {userState.name}</h1>
          <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90 rounded-[24px]">
            <Link to="/notifications">
              Notifications
            </Link>
          </Button>
        </div>

        {!userState.skillTestTaken && (
          <Card className="mb-6 bg-gradient-to-r from-breneo-blue/10 to-breneo-blue/5 border-breneo-blue/20 rounded-[24px]">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-breneo-navy mb-2">Start Your Journey with Breneo</h3>
                  <p className="text-gray-600 max-w-lg">Take your skill test to get personalized job and course recommendations tailored just for you.</p>
                </div>
                <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90 rounded-[24px]">
                  <Link to="/skill-test">
                    Take Skill Test
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="rounded-[24px]">
            <CardHeader>
              <CardTitle>Job Matches</CardTitle>
              <CardDescription>Live job recommendations from our partners</CardDescription>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border rounded-[24px] p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                    </div>
                  ))}
                </div>
              ) : jobsError ? (
                <div className="text-center py-6">
                  <p className="text-red-500 mb-4">Failed to load job recommendations</p>
                  <Button variant="outline" onClick={() => window.location.reload()} className="rounded-[24px]">
                    Retry
                  </Button>
                </div>
              ) : recommendedJobs.length > 0 ? (
                <div className="space-y-4">
                  {recommendedJobs.map(job => (
                    <div key={job.id} className="border rounded-[24px] p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.company}</p>
                        </div>
                        <div className="bg-breneo-blue/10 text-breneo-blue px-2 py-1 rounded-[24px] text-sm font-medium">
                          {job.match}% Match
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" asChild className="rounded-[24px]">
                      <Link to="/jobs">View All Job Offers</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Take your skill test to see job recommendations</p>
                  <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90 rounded-[24px]">
                    <Link to="/skill-test">Take Skill Test</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[24px]">
            <CardHeader>
              <CardTitle>Recommended Courses</CardTitle>
              <CardDescription>Improve your skills with these learning paths</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedCourses.length > 0 ? (
                <div className="space-y-4">
                  {recommendedCourses.map(course => (
                    <div key={course.id} className="border rounded-[24px] p-4">
                      <div className="mb-2">
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.provider} · {course.duration}</p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 rounded-[24px]">View Course</Button>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" asChild className="rounded-[24px]">
                      <Link to="/courses">View All Courses</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Take your skill test to get course recommendations</p>
                  <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90 rounded-[24px]">
                    <Link to="/skill-test">Take Skill Test</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[24px]">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your journey with Breneo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-gray-500">60%</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Skill Assessment</span>
                  <span className="text-sm text-gray-500">
                    {userState.skillTestTaken ? 'Completed' : 'Not Started'}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Courses Progress</span>
                  <span className="text-sm text-gray-500">0/5</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-3">
                Complete your profile and skill assessment for better recommendations
              </p>
              <Button variant="outline" className="text-breneo-blue rounded-[24px]">Update Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
