
import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { user, signOut } = useAuth();
  
  // Mock user data - using real user data where available
  const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
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

  const handleSignOut = async () => {
    await signOut();
  };

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <div className="h-8 w-8 rounded-full bg-breneo-blue flex items-center justify-center text-white font-semibold text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">
              {userData.name}
            </p>
            <p className="w-[200px] truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <DashboardLayout>
      <div className="py-4 md:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
          <h1 className="text-xl md:text-2xl font-bold text-breneo-navy">Welcome, {userData.name}</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            <ProfileDropdown />
          </div>
        </div>

        {!userData.skillTestTaken && (
          <Card className="mb-4 md:mb-6 bg-gradient-to-r from-breneo-blue/10 to-breneo-blue/5 border-breneo-blue/20 rounded-[24px]">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-breneo-navy mb-2">Start Your Journey with Breneo</h3>
                  <p className="text-sm md:text-base text-gray-600">Take your skill test to get personalized job and course recommendations tailored just for you.</p>
                </div>
                <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90 rounded-[24px] w-full md:w-auto">
                  <Link to="/skill-test">
                    Take Skill Test
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <Card className="rounded-[24px]">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">Job Matches</CardTitle>
              <CardDescription className="text-sm md:text-base">Live job recommendations from our partners</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {jobsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border rounded-[24px] p-3 md:p-4">
                      <Skeleton className="h-4 md:h-5 w-3/4 mb-2" />
                      <Skeleton className="h-3 md:h-4 w-1/2 mb-3" />
                    </div>
                  ))}
                </div>
              ) : jobsError ? (
                <div className="text-center py-4 md:py-6">
                  <p className="text-red-500 mb-4 text-sm md:text-base">Failed to load job recommendations</p>
                  <Button variant="outline" onClick={() => window.location.reload()} className="rounded-[24px] text-sm md:text-base">
                    Retry
                  </Button>
                </div>
              ) : recommendedJobs.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {recommendedJobs.map(job => (
                    <div key={job.id} className="border rounded-[24px] p-3 md:p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base truncate">{job.title}</h3>
                          <p className="text-xs md:text-sm text-gray-500 truncate">{job.company}</p>
                        </div>
                        <div className="bg-breneo-blue/10 text-breneo-blue px-2 py-1 rounded-[24px] text-xs md:text-sm font-medium ml-2 flex-shrink-0">
                          {job.match}% Match
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" asChild className="rounded-[24px] w-full sm:w-auto text-sm md:text-base">
                      <Link to="/jobs">View All Job Offers</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 md:py-6">
                  <p className="text-gray-500 mb-4 text-sm md:text-base">Take your skill test to see job recommendations</p>
                  <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90 rounded-[24px] w-full sm:w-auto text-sm md:text-base">
                    <Link to="/skill-test">Take Skill Test</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[24px]">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">Recommended Courses</CardTitle>
              <CardDescription className="text-sm md:text-base">Improve your skills with these learning paths</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {recommendedCourses.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {recommendedCourses.map(course => (
                    <div key={course.id} className="border rounded-[24px] p-3 md:p-4">
                      <div className="mb-2">
                        <h3 className="font-medium text-sm md:text-base">{course.title}</h3>
                        <p className="text-xs md:text-sm text-gray-500">{course.provider} · {course.duration}</p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 rounded-[24px] text-xs md:text-sm">View Course</Button>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" asChild className="rounded-[24px] w-full sm:w-auto text-sm md:text-base">
                      <Link to="/courses">View All Courses</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 md:py-6">
                  <p className="text-gray-500 mb-4 text-sm md:text-base">Take your skill test to get course recommendations</p>
                  <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90 rounded-[24px] w-full sm:w-auto text-sm md:text-base">
                    <Link to="/skill-test">Take Skill Test</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[24px]">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Your Progress</CardTitle>
            <CardDescription className="text-sm md:text-base">Track your journey with Breneo</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4 md:space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm md:text-base font-medium">Profile Completion</span>
                  <span className="text-sm md:text-base text-gray-500">60%</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm md:text-base font-medium">Skill Assessment</span>
                  <span className="text-sm md:text-base text-gray-500">
                    {userData.skillTestTaken ? 'Completed' : 'Not Started'}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm md:text-base font-medium">Courses Progress</span>
                  <span className="text-sm md:text-base text-gray-500">0/5</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-6 text-center">
              <p className="text-xs md:text-sm text-gray-500 mb-3">
                Complete your profile and skill assessment for better recommendations
              </p>
              <Button variant="outline" className="text-breneo-blue rounded-[24px] text-sm md:text-base w-full sm:w-auto">Update Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
