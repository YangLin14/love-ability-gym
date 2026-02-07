import React from 'react';
import PermissionSlip from './pages/PermissionSlip';
import ReframingTool from './pages/ReframingTool';

export const module4Routes = [
  { path: '/module4/permission-slip', element: <PermissionSlip />, name: 'Permission Slip' },
  { path: '/module4/reframing-tool', element: <ReframingTool />, name: 'Reframing Tool' }
];
