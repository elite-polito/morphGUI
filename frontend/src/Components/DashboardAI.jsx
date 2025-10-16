import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DynamicComponent from '../DynamicComponent';
import { ErrorBoundary } from "react-error-boundary";
import NavbarComponent from './NavbarComponent';
import LoadingComponent from './LoadingComponent';

const EXPERIMENT = true

const DashboardAI = ({user, setUser, appType, onAppTypeChange, isSwitchingApp}) => {
  const [generating, setGenerating] = useState(false)

  // Sample dashboard data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 79000, 88000],
    total: 792000,
    growth: 12.5
  };

  const salesData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: [145000, 183000, 215000, 249000],
    total: 792000
  };

  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Other'],
    values: [285000, 178000, 142000, 98000, 54000, 35000],
    colors: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#6c757d']
  };

  const userMetrics = {
    totalUsers: 15234,
    activeUsers: 8945,
    newUsers: 1523,
    growthRate: 8.3
  };

  const productPerformance = [
    { id: 1, name: 'Wireless Headphones', sales: 1245, revenue: 124500, growth: 15.2 },
    { id: 2, name: 'Smart Watch', sales: 892, revenue: 178400, growth: 22.8 },
    { id: 3, name: 'Laptop Pro 15', sales: 456, revenue: 547200, growth: 8.5 },
    { id: 4, name: 'Gaming Mouse', sales: 2103, revenue: 126180, growth: -3.2 },
    { id: 5, name: 'Mechanical Keyboard', sales: 678, revenue: 101700, growth: 12.1 }
  ];

  const regionData = {
    labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
    values: [285000, 245000, 195000, 42000, 15000, 10000]
  };

  const timeSeriesData = {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 8, i + 1),
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 100) + 50
    })),
    weekly: Array.from({ length: 12 }, (_, i) => ({
      week: `Week ${i + 1}`,
      revenue: Math.floor(Math.random() * 30000) + 15000,
      orders: Math.floor(Math.random() * 500) + 300
    }))
  };

  // State management
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('monthly');
  const [chartType, setChartType] = useState('bar'); // bar, line, donut, area
  const [showDetails, setShowDetails] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [colorScheme, setColorScheme] = useState('blue'); // blue, green, purple, gradient
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Event handlers
  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  const handleTimePeriodChange = (period) => {
    setSelectedTimePeriod(period);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleWidgetClick = (widget) => {
    setSelectedWidget(widget);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedWidget(null);
  };

  const handleColorSchemeChange = (scheme) => {
    setColorScheme(scheme);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const props = {
    revenueData,
    salesData,
    categoryData,
    userMetrics,
    productPerformance,
    regionData,
    timeSeriesData,
    selectedMetric,
    setSelectedMetric: handleMetricChange,
    selectedTimePeriod,
    setSelectedTimePeriod: handleTimePeriodChange,
    chartType,
    setChartType: handleChartTypeChange,
    showDetails,
    selectedWidget,
    handleWidgetClick,
    handleCloseDetails,
    colorScheme,
    setColorScheme: handleColorSchemeChange,
    viewMode,
    setViewMode: handleViewModeChange
  };

  return (
    <>
      <ErrorBoundary fallback={<>
        <NavbarComponent user={user} generating={generating} setGenerating={setGenerating} setUser={setUser} experiment={EXPERIMENT} appType={appType} onAppTypeChange={onAppTypeChange} isSwitchingApp={isSwitchingApp}></NavbarComponent>
        <div>Oh, Something went wrong!</div>
        </>}>
       <NavbarComponent user={user} generating={generating} setGenerating={setGenerating} setUser={setUser} experiment={EXPERIMENT} appType={appType} onAppTypeChange={onAppTypeChange} isSwitchingApp={isSwitchingApp}></NavbarComponent>{
       !generating  ? <DynamicComponent user={user} props={props} appType={appType} isSwitchingApp={isSwitchingApp}></DynamicComponent> :  <LoadingComponent></LoadingComponent>}
      </ErrorBoundary>
    </>
  );
};

export default DashboardAI;

