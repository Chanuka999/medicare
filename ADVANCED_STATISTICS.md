# Advanced Hospital Performance Statistics

## Overview

The Advanced Statistics feature provides comprehensive analytics and insights into hospital performance through multiple visualization types including line charts, bar charts, and data tables. This feature enables administrators to monitor key metrics and make data-driven decisions.

## Features

### 1. Daily Appointments Chart

- **Type**: Line Chart
- **Time Period**: Last 30 days
- **Shows**: Number of appointments scheduled each day
- **Use Case**: Track daily appointment trends and patient activity patterns
- **Endpoint**: `GET /api/admin/statistics/daily-appointments`

### 2. Monthly Revenue Chart

- **Type**: Bar Chart
- **Time Period**: Last 12 months
- **Shows**: Monthly revenue from paid and partially-paid bills
- **Currency**: Rupees (Rs.)
- **Use Case**: Monitor hospital revenue trends and financial performance
- **Endpoint**: `GET /api/admin/statistics/monthly-revenue`

### 3. Most Visited Doctors

- **Type**: Data Table
- **Shows Top**: 10 doctors by appointment count
- **Metrics**:
  - Doctor Name
  - Specialization
  - Total Appointments
  - Completed Appointments
  - Completion Rate (%)
- **Use Case**: Identify popular doctors and monitor performance metrics
- **Endpoint**: `GET /api/admin/statistics/most-visited-doctors`

### 4. Patient Growth Chart

- **Type**: Multi-line Chart
- **Time Period**: Last 12 months
- **Shows**:
  - New patients per month (orange line)
  - Total cumulative patients (purple line)
- **Use Case**: Track patient base growth and user acquisition
- **Endpoint**: `GET /api/admin/statistics/patient-growth`

## Architecture

### Backend Components

#### 1. New Admin Controller Functions

**getDailyAppointments()**

```javascript
// Aggregates appointments by date for the last 30 days
// Fills missing dates with 0 appointments
// Returns: Array of daily appointment data
```

**getMonthlyRevenue()**

```javascript
// Aggregates bills by month for the last 12 months
// Filters for paid and partially-paid bills only
// Returns: Array of monthly revenue data with bill counts
```

**getMostVisitedDoctors()**

```javascript
// Aggregates appointments by doctor
// Performs multi-level lookups to get doctor and user information
// Calculates completion rates
// Supports limit parameter (default: 10)
// Returns: Top doctors by appointment count with statistics
```

**getPatientGrowth()**

```javascript
// Aggregates user creation by month
// Calculates cumulative total patients over time
// Returns: Array with new patients and cumulative totals per month
```

#### 2. Database Aggregation Pipeline

Uses MongoDB aggregation framework with:

- `$match` - Filter documents by date and status
- `$group` - Group by date/month and calculate sums
- `$lookup` - Join related collections (Doctor, User)
- `$sort` - Order results
- `$limit` - Restrict results
- `$project` - Format output fields

#### 3. API Routes

All routes protected with admin-only middleware:

```
GET /api/admin/statistics/daily-appointments
GET /api/admin/statistics/monthly-revenue
GET /api/admin/statistics/most-visited-doctors?limit=10
GET /api/admin/statistics/patient-growth
```

### Frontend Components

#### 1. DailyAppointmentsChart.jsx

- React component using Recharts
- Line chart visualization
- Auto-loads data on mount
- Responsive design
- Dark mode support

#### 2. MonthlyRevenueChart.jsx

- Bar chart showing monthly revenue
- Custom tooltip formatting (Rs.)
- Color: Green (#10b981)
- Responsive container

#### 3. MostVisitedDoctorsChart.jsx

- Table-based component (no external charting library)
- Displays doctor metrics
- Completion rate progress bar
- Sortable data with badges
- Alternating row colors for readability

#### 4. PatientGrowthChart.jsx

- Dual line chart
- Shows both new and cumulative patients
- Color-coded: Purple (total) and Orange (new)
- Legend with clear labels

#### 5. Charts.css

- Unified styling for all chart components
- Light and dark mode support
- Responsive grid layout
- Table styling with hover effects
- Progress bar components

### Integration

Charts integrated into `/admin` dashboard:

- Tab path: `GET /admin` (HomeStats component)
- Section: "Advanced Analytics"
- Grid layout with two charts per row on desktop
- Full-width on mobile

## API Response Formats

### Daily Appointments

```json
{
  "success": true,
  "data": {
    "dailyAppointments": [
      {
        "date": "2026-03-01",
        "day": "Sun",
        "appointments": 5
      }
    ]
  }
}
```

### Monthly Revenue

```json
{
  "success": true,
  "data": {
    "monthlyRevenue": [
      {
        "month": "Jan",
        "year": 2026,
        "revenue": 150000,
        "billCount": 50
      }
    ]
  }
}
```

### Most Visited Doctors

```json
{
  "success": true,
  "count": 10,
  "data": {
    "doctors": [
      {
        "_id": "doctor_id",
        "doctorName": "Dr. John Smith",
        "specialization": "Cardiology",
        "appointmentCount": 150,
        "completedCount": 145,
        "completionRate": 96.67,
        "email": "john@example.com"
      }
    ]
  }
}
```

### Patient Growth

```json
{
  "success": true,
  "data": {
    "patientGrowth": [
      {
        "month": "Jan",
        "year": 2026,
        "newPatients": 25,
        "totalPatients": 500
      }
    ]
  }
}
```

## Data Aggregation Details

### Time Windows

**Daily Appointments**: Last 30 days

- Queries appointments with `appointmentDate` from 30 days ago to now
- Groups by calendar date
- Fills missing dates with 0

**Monthly Revenue**: Last 12 months

- Queries bills with `createdAt` from 12 months ago to now
- Filters: `paymentStatus` = "paid" or "partially-paid"
- Groups by year and month

**Most Visited Doctors**: All-time

- No date filter
- Orders by appointment count descending
- Limits to 10 by default (customizable)

**Patient Growth**: Last 12 months

- Queries users with role "patient"
- Groups by creation month
- Calculates running cumulative total

### Performance Considerations

1. **Indexes**: Ensure indexes on:
   - `Appointment.appointmentDate`
   - `Bill.createdAt`, `Bill.paymentStatus`
   - `User.createdAt`, `User.role`
   - `Doctor._id`

2. **Query Optimization**:
   - Aggregation pipelines execute on database server
   - Results limited before returning
   - Lookup operations optimized with indexed foreign keys

3. **Caching**: Consider implementing:
   - Browser-side caching (Redux/Context)
   - Server-side caching for stable metrics
   - Batch updates if real-time not required

## UI/UX Features

### Charts

- **Responsive**: Adapts to container width
- **Interactive**: Hover tooltips show detailed data
- **Accessible**: Color schemes support light/dark modes
- **Animated**: Smooth transitions when data updates
- **Labeled**: Clear axis labels and legends

### Tables

- **Sortable**: Click headers to sort (future enhancement)
- **Hover Effects**: Highlight rows on hover
- **Progress Indicators**: Visual bars for completion rates
- **Badges**: Color-coded status indicators
- **Mobile**: Horizontal scroll on small screens

## Configuration

### Adjustable Parameters

**Most Visited Doctors Limit**:

```javascript
// In API call:
adminService.getMostVisitedDoctors(limit = 20)

// In route:
?limit=20
```

**Chart Heights**:

```javascript
// In component:
<ResponsiveContainer width="100%" height={300}>
```

**Time Periods**:
Modify in controller functions:

- 30 days: `new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)`
- 12 months: `new Date(now.getFullYear() - 1, now.getMonth(), 1)`

## Installation & Setup

### 1. Update Dependencies

```bash
cd frontend
npm install recharts
```

### 2. Verify Backend

- Ensure Bill model is imported in admin.controller.js
- Verify mongoose module available

### 3. Test Endpoints

```bash
# Test daily appointments
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/admin/statistics/daily-appointments

# Test with limit parameter
curl -H "Authorization: Bearer {token}" \
  "http://localhost:5000/api/admin/statistics/most-visited-doctors?limit=20"
```

### 4. Check Frontend

- Verify chart components import adminService correctly
- Confirm Charts.css is imported in Dashboard.jsx
- Check browser console for any import errors

## Usage Examples

### Access Statistics

1. Login as Admin
2. Navigate to Admin Dashboard
3. Scroll to "Advanced Analytics" section
4. View charts and tables

### Interpret Data

**Daily Appointments Chart**:

- Peak days show high patient activity
- Identify slow periods for maintenance

**Monthly Revenue**:

- Trend analysis helps financial planning
- Correlate with appointment trends

**Most Visited Doctors**:

- Identify popular specialists
- Monitor doctor performance and workload
- Plan staffing accordingly

**Patient Growth**:

- Track acquisition rate
- Plan facility expansion
- Forecast resource needs

## Customization

### Adding New Chart Type

1. Create new component in `src/components/charts/`
2. Use Recharts library or custom SVG
3. Import adminService for data
4. Add styling to Charts.css
5. Import in admin/Dashboard.jsx
6. Add to charts-grid or custom layout

### Modifying Chart Colors

In component files, modify color strings:

```javascript
stroke = "#3b82f6"; // Line color
fill = "#10b981"; // Bar color
```

Or in CSS:

```css
.chart-fill {
  background: linear-gradient(90deg, #10b981, #6ee7b7);
}
```

### Changing Time Periods

In admin.controller.js, modify date calculations:

```javascript
// Change from 30 days to 60 days
const thirtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
```

## Troubleshooting

### Charts Not Loading

1. **Check API Response**:
   - Open Network tab in browser DevTools
   - Verify requests to `/api/admin/statistics/*`
   - Check response status and data structure

2. **Check Console Errors**:
   - Look for JavaScript errors
   - Verify adminService methods exist
   - Check import paths

3. **Verify Data**:
   - Ensure database has sufficient records
   - Check if date filters are too restrictive
   - Verify user roles and permissions

### Empty Charts

1. **No Data**: Filtering too strict
   - Adjust time periods in controller
   - Lower date filters or remove status filters

2. **Wrong Data Type**:
   - Verify aggregation pipeline grouping
   - Check field names in projection

3. **Missing Records**:
   - Seed test data if needed
   - Verify records exist for time period

### Performance Issues

1. **Slow Loading**:
   - Add database indexes
   - Implement pagination
   - Use caching strategies

2. **High Database Load**:
   - Reduce time period scope
   - Cache results periodically
   - Implement lazy loading for off-screen charts

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live metrics
2. **Custom Date Ranges**: Allow admin to select time periods
3. **Export Data**: CSV, PDF exports for reports
4. **Drill-down**: Click chart data to see details
5. **Comparisons**: Year-over-year or month-over-month comparisons
6. **Alerts**: Notifications for performance thresholds
7. **Predictions**: Forecast trends using historical data
8. **Department Breakdown**: Statistics by department/specialization
9. **Patient Segmentation**: Analytics by patient demographics
10. **Mobile Dashboard**: Simplified mobile version of analytics

## Database Model Dependencies

### Collections Used

1. **Appointment**
   - Fields: `appointmentDate`, `status`, `doctorId`
   - Indexes: `appointmentDate`, `status`

2. **Bill**
   - Fields: `createdAt`, `paymentStatus`, `totalAmount`
   - Indexes: `createdAt`, `paymentStatus`

3. **Doctor**
   - Fields: `_id`, `userId`, `specialization`
   - Reference: User via userId

4. **User**
   - Fields: `_id`, `name`, `email`, `role`, `createdAt`
   - Indexes: `role`, `createdAt`

## Security

### Authorization

- All endpoints require `protect` middleware (JWT)
- All endpoints require `restrictTo("admin")` middleware
- Users can only see aggregated data, not individual records

### Data Protection

- No sensitive user data exposed (e.g., passwords, phone numbers)
- Revenue data only for admin view
- Doctor metrics visible only to admin

### Query Safety

- Mongoose aggregation prevents SQL injection
- Input validation on query parameters
- Type coercion for numeric limits

## Files Modified/Created

### Backend

- **Modified**: `src/controllers/admin.controller.js` (added 4 functions)
- **Modified**: `src/routes/admin.routes.js` (added 4 routes)

### Frontend

- **Created**: `src/components/charts/DailyAppointmentsChart.jsx`
- **Created**: `src/components/charts/MonthlyRevenueChart.jsx`
- **Created**: `src/components/charts/MostVisitedDoctorsChart.jsx`
- **Created**: `src/components/charts/PatientGrowthChart.jsx`
- **Created**: `src/components/charts/Charts.css`
- **Modified**: `src/pages/admin/Dashboard.jsx` (added imports and chart components)
- **Modified**: `src/services/api.js` (added 4 admin service methods)
- **Modified**: `package.json` (added recharts dependency)

## Testing Checklist

- [ ] Backend endpoints return correct data format
- [ ] Charts render without errors
- [ ] Dark mode styling applies correctly
- [ ] Responsive layout works on mobile
- [ ] Tooltips show on hover
- [ ] Legend toggles work (if applicable)
- [ ] No console errors
- [ ] API calls include auth token
- [ ] Empty states handled gracefully
- [ ] Loading states display while fetching data
