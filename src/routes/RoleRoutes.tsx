import { ReactElement } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import React from 'react';

// Import components
import AdminDashboard from "../components/AdminDashboard";
import Home from "../pages/Dashboard/Home";
import EventInvitation from "../pages/EventInvitation";
import UserManagement from "../pages/UserManagement";
import ProfileView from "../pages/ProfileView";
import Calendar from "../pages/CalendarPage";
import Marketing from "../pages/Dashboard/Marketing";
import MarketingOverview from "../pages/MarketingOverview";
import CreateNotification from "../pages/CreateNotification";
import CustomerDemographics from "../pages/Dashboard/CustomerDemographics";
import Changelog from "../pages/Changelog/index";
import NewUserWelcome from '../pages/NewUserWelcome';
import ScheduledEventsPage from "../pages/ScheduledEventsPage";
import SettingsAdmin from "../pages/SettingsAdmin";
import AdminSettings from "../pages/AdminSettings";
import SendEmailPage from "../pages/SendEmailPage";

// Define route interface for better type safety
interface RouteConfig {
  path: string;
  element: ReactElement;
}

// Define role-based routes with proper typing
export const roleRoutes: Record<string, RouteConfig[]> = {
  admin: [
    { path: 'admin-dashboard', element: <AdminDashboard /> },
    { path: 'dashboard', element: <Home /> },
    { path: 'invite', element: <EventInvitation /> },
    { path: 'userman', element: <UserManagement /> },
    { path: 'profile', element: <ProfileView /> },
    { path: 'calendar', element: <Calendar /> },
    { path: 'marketing', element: <Marketing /> },
    { path: 'marketing-overview', element: <MarketingOverview /> },
    { path: 'notif', element: <CreateNotification /> },
    { path: 'customer-demographics', element: <CustomerDemographics /> },
    { path: 'changelog', element: <Changelog /> },
    { path: 'welcome', element: <NewUserWelcome /> },
    { path: 'sch-events', element: <ScheduledEventsPage /> },
    { path: 'send-email', element: <SendEmailPage /> },
    { path: 'settings-admin', element: <SettingsAdmin /> },
    { path: 'admin-settings', element: <AdminSettings /> },
  ],
  team: [
    { path: 'admin-dashboard', element: <AdminDashboard /> },
    { path: 'dashboard', element: <Home /> },
    { path: 'userman', element: <UserManagement /> },
    { path: 'calendar', element: <Calendar /> },
    { path: 'profile', element: <ProfileView /> },
    { path: 'send-email', element: <SendEmailPage /> },
  ],
  agent: [
    { path: 'profile', element: <ProfileView /> },
    { path: 'calendar', element: <Calendar /> },
  ],
  attendee: [
    { path: 'dashboard', element: <NewUserWelcome /> },
    { path: 'profile', element: <ProfileView /> },
  ]
};
