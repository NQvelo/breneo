
import React from 'react';
import { SkillTest } from '@/components/skills/SkillTest';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const SkillTestPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-breneo-navy mb-6">Skill Assessment</h1>
        <SkillTest />
      </div>
    </DashboardLayout>
  );
};

export default SkillTestPage;
