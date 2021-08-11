/** @format */
enum EMessages {
	USER_REGISTERED = 'User Registered',
	USER_REGISTRATION_FAILED = 'User registration failed',
	RESOURCE_FOUND = 'Resource Found',
	EVENT_UPDATED = 'Event updated successfully.',
	USER_LOGGED_ID = 'User Logged In',
	INVALID_CREDENTIALS = 'Invalid Credentials',
	UNAUTHORIZED_ACCESS = 'Unauthorized access',
	PERMISSION_DENIED = 'Permission denied',
	RESOURCE_NOT_FOUND = 'Resource not found',
	INVALID_AUTHENTICATION_TOKEN = 'Invalid authentication token',
	INACTIVE_USER_ACCOUNT = 'Inactive user account',
	EMAIL_OR_USERNAME_ALREADY_EXISTS = 'Email or username already exists',
	INTERNAL_SERVER_ERROR = 'Internal Server Error',
	EVENT_CREATED = 'Event created successfully.',
	INVALID_DATE = 'Invalid Date',
	EVENT_DATE_TIME_SHOULD_BE_GREATER_THAN_CURRENT_TIME = 'Event date/time should be greater than current time',
	INVALID_USER_ID = 'Invalid User Id',
	EVENT_OWNER_INVITE_CONFLICT = 'Event owner and invited user cannot be same',
	INVALID_EVENT_ID = 'Invalid Event Id',
	USER_ALREADY_INVITED = 'User is already invited',
}

export default EMessages;
