export const ADD_EMPLOYEE_MESSAGES = {
    SUCCESS: {
        ADD_EMPLOYEE: 'Successfully Saved',
        UPDATE_EMPLOYEE: 'Successfully Updated',
        UPDATE_ATTACHMENT_DELETION: 'Successfully Deleted',
    },
    ERROR: {
        ADD_EMPLOYEE_ALREADY_EXISTS: 'Employee Id already exists',
        ADD_EMPLOYEE_REQUIRED: 'Required',
        ADD_EMPLOYEE_SHOULD_BE_AT_LEAST_5_CHARACTERS: 'Should be at least 5 characters',
        ADD_EMPLOYEE_PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
        UPDATE_EMPLOYEE_TELEPHONE_RESTRICTED_CHARACTERS: 'Allows numbers and only + - / ( )',
        UPDATE_EMPLOYEE_INVALID_EMAIL_FORMAT: 'Expected format: admin@example.com',
        UPDATE_EMPLOYEE_SAME_EMAIL: 'Work Email and Other Email cannot be the same',
        UPDATE_EMPLOYEE_ALREADY_EXISTS_EMAIL: 'Already exists',
        UPDATE_ATTACHMENT_TOO_LARGE: 'Attachment Size Exceeded',
        UPDATE_ATTACHMENT_ALLOWED_FILE_TYPES: 'File type not allowed',
        UPDATE_ATTACHMENT_REQUIRED: 'Required',
    },
    EMPLOYEE_LIST: {
        NO_RECORDS_FOUND: 'No Records Found',
    }
} as const;

export type AddEmployeeMessages = typeof ADD_EMPLOYEE_MESSAGES;
