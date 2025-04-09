import { AppSidebar } from './components/app-sidebar.jsx';
import { DynamicBreadcrumb } from './brudcrumbsManager.jsx';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export default function AdminHome() {
  const routes = [
    { path: '/', breadcrumb: 'Home' },
    { path: '/admin', breadcrumb: 'Admin' },
    { path: '/admin/tutor-management', breadcrumb: 'Tutor Management' },
    { path: '/admin/student-management', breadcrumb: 'Student Management' },
    { path: '/admin/tutor-session', breadcrumb: 'Tutor Session' },
    { path: '/admin/session-approval/', breadcrumb: 'Session Approval' },
    { path: '/admin/active-session/', breadcrumb: 'Active Session' },
    { path: '/admin/price-setter/', breadcrumb: 'Price' },
    { path: '/admin/assessment-task-growth-data/', breadcrumb: 'Assessment Task Growth' },
    { path: '/admin/video-meet-data/', breadcrumb: 'Video Status' },
    { path: '/admin/company-revenue/', breadcrumb: 'Revenue' },
  ];

  console.log('DASHBOIARD');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <DynamicBreadcrumb routes={routes} />
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
