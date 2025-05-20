
import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    skillTestTaken: false
  };

  // Mock job recommendations
  const recommendedJobs = [
    { id: 1, title: 'UX Designer', company: 'CreativeTech', match: 92 },
    { id: 2, title: 'Marketing Specialist', company: 'GrowthLabs', match: 87 },
  ];

  // Mock course recommendations
  const recommendedCourses = [
    { id: 1, title: 'UI/UX Fundamentals', provider: 'DesignAcademy', duration: '4 weeks' },
    { id: 2, title: 'Digital Marketing Essentials', provider: 'LearnOnline', duration: '6 weeks' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-breneo-navy">Welcome, {user.name}</h1>
          <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90">
            <Link to="/notifications">
              Notifications
            </Link>
          </Button>
        </div>

        {!user.skillTestTaken && (
          <Card className="mb-6 bg-gradient-to-r from-breneo-blue/10 to-breneo-blue/5 border-breneo-blue/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-breneo-navy mb-2">Start Your Journey with Breneo</h3>
                  <p className="text-gray-600 max-w-lg">Take your skill test to get personalized job and course recommendations tailored just for you.</p>
                </div>
                <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90">
                  <Link to="/skill-test">
                    Take Skill Test
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Matches</CardTitle>
              <CardDescription>Personalized job recommendations based on your skills</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedJobs.length > 0 ? (
                <div className="space-y-4">
                  {recommendedJobs.map(job => (
                    <div key={job.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-500">{job.company}</p>
                        </div>
                        <div className="bg-breneo-blue/10 text-breneo-blue px-2 py-1 rounded text-sm font-medium">
                          {job.match}% Match
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={job.match} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/jobs">View All Job Offers</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Take your skill test to see job recommendations</p>
                  <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90">
                    <Link to="/skill-test">Take Skill Test</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Courses</CardTitle>
              <CardDescription>Improve your skills with these learning paths</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedCourses.length > 0 ? (
                <div className="space-y-4">
                  {recommendedCourses.map(course => (
                    <div key={course.id} className="border rounded-md p-4">
                      <div className="mb-2">
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.provider} · {course.duration}</p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">View Course</Button>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/courses">View All Courses</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Take your skill test to get course recommendations</p>
                  <Button asChild className="bg-breneo-blue hover:bg-breneo-blue/90">
                    <Link to="/skill-test">Take Skill Test</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
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
                <Progress value={60} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Skill Assessment</span>
                  <span className="text-sm text-gray-500">
                    {user.skillTestTaken ? 'Completed' : 'Not Started'}
                  </span>
                </div>
                <Progress value={user.skillTestTaken ? 100 : 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Courses Progress</span>
                  <span className="text-sm text-gray-500">0/5</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-3">
                Complete your profile and skill assessment for better recommendations
              </p>
              <Button variant="outline" className="text-breneo-blue">Update Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
