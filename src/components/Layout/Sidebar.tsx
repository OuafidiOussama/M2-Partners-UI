import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ROUTES } from '../../constants/routes';
import { useAppSelector } from '../../app/hooks';
import { selectIsAdmin } from '../../features/auth/authSlice';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const EMPLOYEE_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { label: 'My Leaves', path: ROUTES.LEAVES, icon: <EventNoteIcon /> },
  { label: 'Profile', path: ROUTES.PROFILE, icon: <PersonIcon /> },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: 'Manage Leaves', path: '/admin/leaves', icon: <AssignmentIcon /> },
];

function NavButton({ item }: { item: NavItem }): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === item.path;

  return (
    <ListItemButton
      selected={isActive}
      onClick={() => navigate(item.path)}
      sx={{
        mx: 1,
        borderRadius: 1,
        mb: 0.5,
        color: 'rgba(255,255,255,0.85)',
        '&.Mui-selected': {
          bgcolor: 'rgba(255,255,255,0.2)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
        },
        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
      }}
    >
      <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        slotProps={{
          primary: { fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 },
        }}
      />
    </ListItemButton>
  );
}

export default function Sidebar(): React.ReactElement {
  const isAdmin = useAppSelector(selectIsAdmin);

  return (
    <Box sx={{ py: 1 }}>
      <List dense>
        {EMPLOYEE_ITEMS.map((item) => (
          <NavButton key={item.path} item={item} />
        ))}
      </List>

      {isAdmin && (
        <>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mx: 2, my: 1 }} />
          <Typography
            variant="caption"
            sx={{
              px: 3,
              py: 0.5,
              display: 'block',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            Administration
          </Typography>
          <List dense>
            {ADMIN_ITEMS.map((item) => (
              <NavButton key={item.path} item={item} />
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
