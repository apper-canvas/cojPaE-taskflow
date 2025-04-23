/**
 * Table schema definitions extracted from the provided tables and fields
 * This provides a single source of truth for table names and field definitions
 */

export const TABLES = {
  USER: 'User',
  TASK: 'task5',
  PROJECT: 'project1',
  PEOPLE: 'People',
  ATTACHMENT: 'Attachment',
  COMMENT: 'Comment',
  DISCUSSION: 'Discussion',
  ACTIVITY: 'Activity',
  NOTIFICATION: 'Notification',
  CUSTOMER: 'Customer',
};

export const FIELDS = {
  USER: {
    ID: 'Id',
    NAME: 'Name',
    FIRST_NAME: 'FirstName',
    LAST_NAME: 'LastName',
    EMAIL: 'Email',
    AVATAR_URL: 'AvatarUrl',
    PHONE: 'Phone',
  },
  TASK: {
    ID: 'Id',
    NAME: 'Name',
    TITLE: 'title',
    DESCRIPTION: 'description',
    STATUS: 'status',
    PRIORITY: 'priority',
    DUE_DATE: 'due_date',
    ASSIGNEE: 'assignee',
    TAGS: 'tags',
  },
  PROJECT: {
    ID: 'Id',
    NAME: 'Name',
    DESCRIPTION: 'description',
    STATUS: 'status',
    START_DATE: 'start_date',
    END_DATE: 'end_date',
  }
};

export const STATUS_OPTIONS = {
  TASK: {
    TODO: 'Todo',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
  },
  PROJECT: {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    ON_HOLD: 'On Hold',
  },
};

export const PRIORITY_OPTIONS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const TAG_OPTIONS = [
  'Frontend',
  'Backend',
  'Design',
  'Bug',
  'Feature',
  'Documentation'
];

// Full tables and fields schema for reference
export const tablesAndFields = {
  "tables": [
    {
      "Id": 1974,
      "Name": "User",
      "Label": "User",
      "Plural": "Users",
      "Icon": "person",
      "fields": [
        { "Name": "Id", "Label": "Id", "Type": "Number", "Id": 35084 },
        { "Name": "Name", "Label": "Full Name", "Type": "Text", "Id": 35085 },
        { "Name": "Tags", "Label": "Tags", "Type": "Tag", "Id": 35086 },
        { "Name": "Owner", "Label": "Owner", "Type": "Lookup", "Id": 35087, "DisplayFieldsOfToTable": "Name" },
        { "Name": "CreatedOn", "Label": "Created On", "Type": "DateTime", "Id": 35088 },
        { "Name": "CreatedBy", "Label": "Created By", "Type": "Lookup", "Id": 35089, "DisplayFieldsOfToTable": "Name" },
        { "Name": "ModifiedOn", "Label": "Modified On", "Type": "DateTime", "Id": 35090 },
        { "Name": "ModifiedBy", "Label": "Modified By", "Type": "Lookup", "Id": 35091, "DisplayFieldsOfToTable": "Name" },
        { "Name": "DeletedOn", "Label": "Deleted On", "Type": "DateTime", "Id": 35092 },
        { "Name": "DeletedBy", "Label": "Deleted By", "Type": "Lookup", "Id": 35093, "DisplayFieldsOfToTable": "Name" },
        { "Name": "IsDeleted", "Label": "Is Deleted", "Type": "Boolean", "Id": 35094 },
        { "Name": "InSandbox", "Label": "In Sandbox", "Type": "Boolean", "Id": 35095 },
        { "Name": "FirstName", "Label": "First Name", "Type": "Text", "Id": 35096 },
        { "Name": "LastName", "Label": "Last Name", "Type": "Text", "Id": 35097 },
        { "Name": "Email", "Label": "Email Address", "Type": "Email", "Id": 35098 },
        { "Name": "AvatarUrl", "Label": "Avatar Url", "Type": "Text", "Id": 35099 },
        { "Name": "MetaUserId", "Label": "MetaUserId", "Type": "Number", "Id": 35100 },
        { "Name": "UserType", "Label": "User Type", "Type": "Number", "Id": 35101 },
        { "Name": "CustomerId", "Label": "CustomerId", "Type": "Number", "Id": 35102 },
        { "Name": "IsEmailVerified", "Label": "Is Email Verified", "Type": "Boolean", "Id": 35103 },
        { "Name": "Phone", "Label": "Phone", "Type": "Phone", "Id": 35104 },
        { "Name": "IsPhoneVerified", "Label": "Is Phone Verified", "Type": "Boolean", "Id": 35105 },
        { "Name": "IsTwoFactorEnabled", "Label": "Is Two Factor Enabled", "Type": "Boolean", "Id": 35106 },
        { "Name": "MfaMethod", "Label": "MfaMethod", "Type": "Text", "Id": 35107 },
        { "Name": "MfaSharedKey", "Label": "MfaSharedKey", "Type": "Text", "Id": 35108 },
        { "Name": "MfaBackupCodes", "Label": "MfaBackupCodes", "Type": "Text", "Id": 35109 },
        { "Name": "Culture", "Label": "Culture", "Type": "Text", "Id": 35110 },
        { "Name": "Languauge", "Label": "Languauge", "Type": "Text", "Id": 35111 },
        { "Name": "Timezone", "Label": "Timezone", "Type": "Text", "Id": 35112 },
        { "Name": "Salt", "Label": "Salt", "Type": "Text", "Id": 35113 },
        { "Name": "PasswordHash", "Label": "PasswordHash", "Type": "Text", "Id": 35114 },
        { "Name": "IsAccountLocked", "Label": "IsAccountLocked", "Type": "Boolean", "Id": 35115 },
        { "Name": "LockoutEndDate", "Label": "LockoutEndDate", "Type": "DateTime", "Id": 35116 },
        { "Name": "LastLockoutDate", "Label": "LastLockoutDate", "Type": "DateTime", "Id": 35117 },
        { "Name": "PasswordResetAttempts", "Label": "Password Reset Attempts", "Type": "Number", "Id": 35118 },
        { "Name": "LoginFailedCount", "Label": "Login Failed Count", "Type": "Number", "Id": 35119 },
        { "Name": "LastLoginDate", "Label": "Last Login Date", "Type": "DateTime", "Id": 35120 },
        { "Name": "LastPasswordChangeDate", "Label": "Last Password ChangeDate", "Type": "DateTime", "Id": 35121 },
        { "Name": "ProfileId", "Label": "ProfileId", "Type": "Number", "Id": 35122 },
        { "Name": "CanvasAppId", "Label": "CanvasAppId", "Type": "Number", "Id": 35123 }
      ]
    },
    {
      "Id": 1984,
      "Name": "task5",
      "Label": "task5",
      "Plural": "Tasks",
      "Icon": "check-square",
      "fields": [
        { "Name": "Id", "Label": "Id", "Type": "Number", "Id": 35265 },
        { "Name": "Name", "Label": "Name", "Type": "Text", "Id": 35266 },
        { "Name": "Tags", "Label": "Tags", "Type": "Tag", "Id": 35267 },
        { "Name": "Owner", "Label": "Owner", "Type": "Lookup", "Id": 35268, "DisplayFieldsOfToTable": "Name" },
        { "Name": "CreatedOn", "Label": "Created On", "Type": "DateTime", "Id": 35269 },
        { "Name": "CreatedBy", "Label": "Created By", "Type": "Lookup", "Id": 35270, "DisplayFieldsOfToTable": "Name" },
        { "Name": "ModifiedOn", "Label": "Modified On", "Type": "DateTime", "Id": 35271 },
        { "Name": "ModifiedBy", "Label": "Modified By", "Type": "Lookup", "Id": 35272, "DisplayFieldsOfToTable": "Name" },
        { "Name": "DeletedOn", "Label": "Deleted On", "Type": "DateTime", "Id": 35273 },
        { "Name": "DeletedBy", "Label": "Deleted By", "Type": "Lookup", "Id": 35274, "DisplayFieldsOfToTable": "Name" },
        { "Name": "IsDeleted", "Label": "Is Deleted", "Type": "Boolean", "Id": 35275 },
        { "Name": "InSandbox", "Label": "In Sandbox", "Type": "Boolean", "Id": 35276 },
        { "Name": "id", "Label": "id", "Type": "Text", "Id": 35277 },
        { "Name": "title", "Label": "title", "Type": "Text", "Id": 35278 },
        { "Name": "description", "Label": "description", "Type": "MultilineText", "Id": 35279 },
        { "Name": "status", "Label": "status", "Type": "Picklist", "Id": 35280, "PicklistValues": "Todo,In Progress,Completed" },
        { "Name": "priority", "Label": "priority", "Type": "Picklist", "Id": 35281, "PicklistValues": "Low,Medium,High" },
        { "Name": "due_date", "Label": "due_date", "Type": "Date", "Id": 35282 },
        { "Name": "assignee", "Label": "assignee", "Type": "People", "Id": 35283 },
        { "Name": "tags", "Label": "tags", "Type": "MultiPicklist", "Id": 35284, "PicklistValues": "Frontend,Backend,Design,Bug,Feature,Documentation" }
      ]
    },
    {
      "Id": 1985,
      "Name": "project1",
      "Label": "project1",
      "Plural": "Projects",
      "Icon": "folder",
      "fields": [
        { "Name": "Id", "Label": "Id", "Type": "Number", "Id": 35285 },
        { "Name": "Name", "Label": "name", "Type": "Text", "Id": 35286 },
        { "Name": "Tags", "Label": "Tags", "Type": "Tag", "Id": 35287 },
        { "Name": "Owner", "Label": "Owner", "Type": "Lookup", "Id": 35288, "DisplayFieldsOfToTable": "Name" },
        { "Name": "CreatedOn", "Label": "Created On", "Type": "DateTime", "Id": 35289 },
        { "Name": "CreatedBy", "Label": "Created By", "Type": "Lookup", "Id": 35290, "DisplayFieldsOfToTable": "Name" },
        { "Name": "ModifiedOn", "Label": "Modified On", "Type": "DateTime", "Id": 35291 },
        { "Name": "ModifiedBy", "Label": "Modified By", "Type": "Lookup", "Id": 35292, "DisplayFieldsOfToTable": "Name" },
        { "Name": "DeletedOn", "Label": "Deleted On", "Type": "DateTime", "Id": 35293 },
        { "Name": "DeletedBy", "Label": "Deleted By", "Type": "Lookup", "Id": 35294, "DisplayFieldsOfToTable": "Name" },
        { "Name": "IsDeleted", "Label": "Is Deleted", "Type": "Boolean", "Id": 35295 },
        { "Name": "InSandbox", "Label": "In Sandbox", "Type": "Boolean", "Id": 35296 },
        { "Name": "id", "Label": "id", "Type": "Text", "Id": 35297 },
        { "Name": "description", "Label": "description", "Type": "MultilineText", "Id": 35298 },
        { "Name": "status", "Label": "status", "Type": "Picklist", "Id": 35299, "PicklistValues": "Active,Completed,On Hold" },
        { "Name": "start_date", "Label": "start_date", "Type": "Date", "Id": 35300 },
        { "Name": "end_date", "Label": "end_date", "Type": "Date", "Id": 35301 }
      ]
    }
  ]
};