# Appointment Reminder Notifications Feature

## Overview

The Appointment Reminder Notifications feature automatically sends notifications to both patients and doctors about upcoming appointments. Reminders are sent:

- **24 hours before** the scheduled appointment
- **1 hour before** the scheduled appointment

## Architecture

### Backend Components

#### 1. **Notification Model** (`src/models/Notification.model.js`)

Stores all notification records with the following fields:

- `appointmentId`: Reference to the appointment
- `recipientId`: User who receives the notification
- `recipientRole`: "patient" or "doctor"
- `type`: "appointment-reminder-24h" or "appointment-reminder-1h"
- `title`: Notification title
- `message`: Notification message body
- `status`: "sent", "read", or "failed"
- `deliveryTime`: When the notification was sent
- `readAt`: When the user read the notification
- `timestamps`: Created and updated dates

**Indexes:**

- `recipientId + status` for quick queries
- `appointmentId` for finding notifications for a specific appointment
- `createdAt` for sorting by time

#### 2. **Notification Controller** (`src/controllers/notification.controller.js`)

Handles user-facing notification operations:

- `getNotifications()` - Fetch user's notifications with optional status filter
- `getUnreadCount()` - Get count of unread notifications
- `markAsRead()` - Mark a single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `deleteNotification()` - Delete a specific notification
- `clearAllNotifications()` - Delete all notifications for the user

#### 3. **Reminder Scheduler** (`src/utils/reminderScheduler.js`)

Automated service that:

- Runs every 10 minutes
- Queries for appointments scheduled in the next 24 hours and 1 hour
- Creates notifications for both patient and doctor
- Uses time windows (0.5 hour buffer) to prevent duplicate notifications
- Checks if notification already exists before creating

**Key Functions:**

- `sendAppointmentReminders()` - Main scheduler function
- `createReminderNotification()` - Helper to create paired notifications

#### 4. **Routes** (`src/routes/notification.routes.js`)

All routes require authentication (`protect` middleware):

- `GET /api/notifications` - Get notifications (with optional status filter)
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Clear all notifications

#### 5. **Server Integration** (`src/server.js`)

- Imports reminder scheduler
- Starts scheduler interval on server startup
- Runs every 10 minutes

#### 6. **App Routes** (`src/app.js`)

- Registers notification routes at `/api/notifications`

### Frontend Components

#### 1. **Notifications Component** (`src/components/Notifications.jsx`)

React component that displays a notification bell icon with:

- **Bell Icon with Badge**: Shows unread count
- **Notification Panel**: Dropdown panel with all notifications
- **Features**:
  - Auto-refresh every 30 seconds
  - Mark single notification as read
  - Mark all as read
  - Delete individual notifications
  - Clear all notifications
  - Responsive design (full-screen on mobile)

**State Management:**

- `notifications`: Array of user's notifications
- `unreadCount`: Number of unread notifications
- `isOpen`: Panel visibility state
- `loading`: Loading state for async operations

#### 2. **Notification Service** (`src/services/api.js`)

API client wrapper with methods:

- `getNotifications(status)` - Fetch notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(id)` - Mark notification as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification(id)` - Delete notification
- `clearAllNotifications()` - Clear all notifications

#### 3. **Styling** (`src/components/Notifications.css`)

Professional UI with:

- Smooth animations and transitions
- Dark mode support
- Responsive design
- Accessible buttons and interactions
- Notification badge styling
- Scrollable list with custom scrollbar

### Integration Points

#### Admin Dashboard (`src/pages/admin/Dashboard.jsx`)

- Imports Notifications component
- Displays notification bell in header

#### Doctor Dashboard (`src/pages/doctor/Dashboard.jsx`)

- Imports Notifications component
- Displays notification bell in header
- Doctors receive appointment reminders

#### Patient Dashboard (`src/pages/patient/Dashboard.jsx`)

- Imports Notifications component
- Displays notification bell in header
- Patients receive appointment reminders

## How It Works

### Step 1: Appointment Creation

When a patient books an appointment, it's saved with:

- `appointmentDate`: Date and time of the appointment
- `status`: "scheduled"
- `patientId`: Patient reference
- `doctorId`: Doctor reference

### Step 2: Scheduler Execution

Every 10 minutes, the reminder scheduler:

1. Checks for appointments in the next 24-25 hours
2. Checks for appointments in the next 0.5-1.5 hours
3. For each appointment found:
   - Creates a notification for the patient
   - Creates a notification for the doctor
   - Sets `status: "sent"`
   - Stores appointment reference

### Step 3: User Notification Display

The Notifications component:

1. Loads all notifications on component mount
2. Auto-refreshes every 30 seconds
3. Shows unread count badge
4. Displays notifications in a dropdown panel
5. Allows users to mark as read and delete

### Step 4: Notification Lifecycle

- **Created**: When reminder scheduler detects upcoming appointment
- **Sent**: Initial status after creation
- **Read**: When user clicks mark as read
- **Deleted**: When user deletes the notification

## Database Schema

```javascript
Notification {
  appointmentId: ObjectId (ref: Appointment),
  recipientId: ObjectId (ref: User),
  recipientRole: String ("patient" | "doctor"),
  type: String ("appointment-reminder-24h" | "appointment-reminder-1h"),
  title: String,
  message: String,
  status: String ("sent" | "read" | "failed"),
  deliveryTime: Date,
  readAt: Date (nullable),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## API Endpoints

### Get Notifications

```bash
GET /api/notifications?status=sent
Authorization: Bearer {token}

Response:
{
  success: true,
  count: 5,
  data: {
    notifications: [
      {
        _id: "...",
        appointmentId: {...},
        recipientId: "...",
        type: "appointment-reminder-24h",
        title: "Appointment Reminder - 24 hours",
        message: "Your appointment with Dr. John is scheduled in 24 hours...",
        status: "sent",
        createdAt: "2026-03-09T10:30:00Z"
      }
    ]
  }
}
```

### Get Unread Count

```bash
GET /api/notifications/unread-count
Authorization: Bearer {token}

Response:
{
  success: true,
  data: { unreadCount: 3 }
}
```

### Mark as Read

```bash
PUT /api/notifications/{id}/read
Authorization: Bearer {token}

Response:
{
  success: true,
  message: "Notification marked as read",
  data: { notification: {...} }
}
```

### Mark All as Read

```bash
PUT /api/notifications/mark-all-read
Authorization: Bearer {token}

Response:
{
  success: true,
  message: "All notifications marked as read"
}
```

### Delete Notification

```bash
DELETE /api/notifications/{id}
Authorization: Bearer {token}

Response:
{
  success: true,
  message: "Notification deleted"
}
```

### Clear All Notifications

```bash
DELETE /api/notifications
Authorization: Bearer {token}

Response:
{
  success: true,
  message: "All notifications cleared"
}
```

## Configuration

### Reminder Timing

Located in `src/server.js`:

```javascript
setInterval(sendAppointmentReminders, 10 * 60 * 1000); // Every 10 minutes
```

Time windows in `src/utils/reminderScheduler.js`:

- 24-hour reminder: 23.5 - 24 hours before appointment
- 1-hour reminder: 0.5 - 1 hour before appointment

To modify timing, edit the time calculations in `reminderScheduler.js`

### Notification Messages

Customizable in `reminderScheduler.js`:

```javascript
const timeFrame = type === "appointment-reminder-24h" ? "24 hours" : "1 hour";
const message = `Your appointment with Dr. ${doctorName} is scheduled in ${timeFrame}...`;
```

## Testing

### Manual Testing Steps

1. **Create an Appointment**
   - Book an appointment through the patient dashboard
   - Note the appointment date and time

2. **Wait for Scheduler**
   - The scheduler runs every 10 minutes
   - Within 10 minutes, notifications should appear
   - (Optional: Modify timing for faster testing)

3. **Check Notifications**
   - Click the bell icon in the header
   - Should see notifications for both patient and doctor
   - Unread count badge should display

4. **Interact with Notifications**
   - Click "Mark as read" on a notification
   - Click "Mark all as read" to mark all
   - Click trash icon to delete
   - Click "Clear All" to remove all notifications

### API Testing with cURL

```bash
# Get notifications
curl -H "Authorization: Bearer {token}" http://localhost:5000/api/notifications

# Get unread count
curl -H "Authorization: Bearer {token}" http://localhost:5000/api/notifications/unread-count

# Mark as read
curl -X PUT -H "Authorization: Bearer {token}" http://localhost:5000/api/notifications/{id}/read

# Delete notification
curl -X DELETE -H "Authorization: Bearer {token}" http://localhost:5000/api/notifications/{id}
```

## Troubleshooting

### Notifications Not Appearing

1. Check that appointments are created with status "scheduled"
2. Verify appointment date is set correctly
3. Wait for scheduler to run (10-minute interval)
4. Check browser console for errors
5. Verify both users (patient and doctor) are logged in

### Unread Count Not Updating

1. Check that notifications have status "sent"
2. Verify recipient IDs are correct in database
3. Try refreshing the page
4. Check network tab in browser dev tools

### Performance Issues

If many appointments cause slow queries:

1. Ensure indexes are created on Notification model
2. Implement pagination for notification list
3. Consider archiving old notifications
4. Optimize the 24-hour time window query

## Future Enhancements

1. **Email Notifications**: Send email reminders via nodemailer
2. **SMS Reminders**: Integrate Twilio for SMS notifications
3. **Custom Reminders**: Allow users to set custom reminder times
4. **Notification Preferences**: Users can choose which reminders to receive
5. **Real-time Updates**: Use Socket.io for instant notification updates
6. **Escalation**: Send follow-up reminders if appointment date passes
7. **Cancellation Notifications**: Notify users if appointment is cancelled
8. **Reschedule Suggestions**: Suggest new times if appointment is cancelled

## Files Modified/Created

### New Files

- `backend/src/models/Notification.model.js`
- `backend/src/controllers/notification.controller.js`
- `backend/src/routes/notification.routes.js`
- `backend/src/utils/reminderScheduler.js`
- `frontend/src/components/Notifications.jsx`
- `frontend/src/components/Notifications.css`

### Modified Files

- `backend/src/server.js` - Added scheduler import and initialization
- `backend/src/app.js` - Added notification routes
- `frontend/src/services/api.js` - Added notification service
- `frontend/src/pages/admin/Dashboard.jsx` - Added Notifications component
- `frontend/src/pages/doctor/Dashboard.jsx` - Added Notifications component
- `frontend/src/pages/patient/Dashboard.jsx` - Added Notifications component
- `frontend/src/styles/Dashboard.css` - Added main-header styling

## Deployment Notes

1. **Database Migration**: Run `prisma migrate dev` or ensure Notification collection exists
2. **Environment**: Verify `MONGO_URI` and `JWT_SECRET` are set
3. **Scheduler**: Ensure server can run background intervals (not possible on serverless)
4. **Time Zone**: Scheduler uses server time, ensure server time is correct
5. **Backup**: Recommended to backup notifications regularly

## Security Considerations

1. **Authorization**: All endpoints require authentication via JWT
2. **User Isolation**: Users can only see their own notifications
3. **Data Validation**: Input is validated on both frontend and backend
4. **Rate Limiting**: Consider implementing rate limits on notification endpoints
5. **Injection Prevention**: All database queries use Mongoose with parameterized queries
