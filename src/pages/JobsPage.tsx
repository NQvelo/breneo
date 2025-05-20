
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Mock jobs data
const JOBS = [
  {
    id: 1,
    title: 'Product Designer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    match: 95,
    remote: true,
    postedAt: '2 days ago',
    description: 'We are looking for a talented product designer to join our team and help us create exceptional user experiences.',
    requirements: ['3+ years of experience', 'UI/UX expertise', 'Figma proficiency'],
  },
  {
    id: 2,
    title: 'Digital Marketing Specialist',
    company: 'GrowthLabs',
    location: 'New York, NY',
    type: 'Full-time',
    match: 88,
    remote: true,
    postedAt: '1 week ago',
    description: 'Join our marketing team to develop and execute digital campaigns across multiple platforms.',
    requirements: ['2+ years in digital marketing', 'Analytics experience', 'Social media expertise'],
  },
  {
    id: 3,
    title: 'Frontend Developer Intern',
    company: 'WebWizards',
    location: 'Remote',
    type: 'Internship',
    match: 82,
    remote: true,
    postedAt: '3 days ago',
    description: 'Great opportunity for a promising developer to gain hands-on experience with modern web technologies.',
    requirements: ['JavaScript knowledge', 'Basic React understanding', 'Eagerness to learn'],
  },
  {
    id: 4,
    title: 'Content Marketing Strategist',
    company: 'ContentKings',
    location: 'Chicago, IL',
    type: 'Full-time',
    match: 79,
    remote: false,
    postedAt: '1 day ago',
    description: 'Help us create compelling content strategies that drive engagement and conversions.',
    requirements: ['Content creation experience', 'SEO knowledge', 'Strategic thinking'],
  },
];

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Filter jobs based on search and filters
  const filteredJobs = JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
    const matchesLocation = !selectedLocation || job.location.includes(selectedLocation);
    const matchesRemote = !remoteOnly || job.remote;
    
    return matchesSearch && matchesType && matchesLocation && matchesRemote;
  });

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-breneo-navy mb-6">Job Offers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <Input
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All Locations</SelectItem>
                <SelectItem value="san-francisco">San Francisco</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-medium mb-3">Job Type</h3>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`job-type-${type}`} 
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => handleTypeToggle(type)}
                      />
                      <label htmlFor={`job-type-${type}`} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-medium mb-3">Remote Options</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remote-only" 
                    checked={remoteOnly}
                    onCheckedChange={(checked) => setRemoteOnly(checked as boolean)}
                  />
                  <label htmlFor="remote-only" className="text-sm">
                    Remote only
                  </label>
                </div>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTypes([]);
                    setSelectedLocation('');
                    setRemoteOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Job listings */}
          <div className="md:col-span-3">
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <p className="text-gray-500">{job.company} • {job.location}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {job.type}
                              </span>
                              {job.remote && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  Remote
                                </span>
                              )}
                              <span className="text-gray-500 text-xs">
                                Posted {job.postedAt}
                              </span>
                            </div>
                          </div>
                          <div className="text-right md:text-center">
                            <div className="bg-breneo-blue/10 text-breneo-blue inline-flex px-3 py-1 rounded-full text-sm font-medium">
                              {job.match}% Match
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Progress value={job.match} className="h-1.5" />
                        </div>
                        
                        <p className="mt-4 text-gray-700">{job.description}</p>
                        
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Requirements:</h4>
                          <ul className="text-sm text-gray-700 list-disc pl-5">
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-5 flex justify-end">
                          <Button className="bg-breneo-blue hover:bg-breneo-blue/90">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <p className="text-gray-500 mb-4">No jobs found matching your criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTypes([]);
                    setSelectedLocation('');
                    setRemoteOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobsPage;
