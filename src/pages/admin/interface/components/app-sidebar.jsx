'use client';

import React from 'react';
import Round_Logo from '../../../../assets/round_logo.png';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  ChartLine,
  SquareTerminal,
  DollarSign,
} from 'lucide-react';

import { NavMain } from './nav-main.jsx';
import { NavProjects } from './nav-projects.jsx';
import { NavUser } from './nav-user.jsx';
import { TeamSwitcher } from './team-switcher.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

let admin = '';
if (localStorage.getItem('adminAuthState')) {
  admin = JSON.parse(localStorage.getItem('adminAuthState')).admin;
}

const data = {
  user: {
    name: admin?.username || 'mrlionbyte',
    email: admin?.email || 'admin.studyzed@gmail.com',
    avatar: 'https://avatars.githubusercontent.com/MrLionByte',
  },
  teams: [
    {
      name: 'StudyZed',
      logo: GalleryVerticalEnd,
      plan: 'edu-tool',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: PieChart,
      isActive: true,
      items: [
        {
          title: 'Default',
          url: '/admin/',
        },
      ],
    },
    {
      title: 'User Management',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Tutor',
          url: '/admin/tutor-management/',
        },
        {
          title: 'Student',
          url: '/admin/student-management/',
        },
      ],
    },
    {
      title: 'Session',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Approval',
          url: '/admin/session-approval/',
        },
        {
          title: 'Active',
          url: '/admin/active-session/',
        },
        // {
        //   title: 'Blocked',
        //   url: '#',
        // },
      ],
    },
    {
      title: 'Session Price',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Set or Change Price',
          url: '/admin/price-setter/',
        },
      ],
    },
    {
      title: 'Growth Data',
      url: '#',
      icon: ChartLine,
      items: [
        {
          title: 'Assessments & Tasks',
          url: '/admin/assessment-task-growth-data/',
        },
        {
          title: 'Video Meets',
          url: '/admin/video-meet-data/',
        },
      ],
    },
    {
      title: 'Revenue',
      url: '/admin/company-revenue/',
      icon: DollarSign,
      items: [
        {
          title: 'total',
          url: '/admin/company-revenue/',
        },
      ],
    },
  ],
  projects: [
    {
      name: "Future integrations",
      url: "#",
      icon: Frame,
    },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
};

export function AppSidebar(props) {
  document.documentElement.classList.add('dark');

  return (
    <Sidebar
      className="bg-white dark:bg-gray-900"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
