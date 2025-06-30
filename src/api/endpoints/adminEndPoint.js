export const adminEndPoints = {
    'AdminLogin'                      : 'admin-app/login-strict/',
    'TutorManagement'                 : 'admin-app/tutor-management/',
    'StudentManamgement'              : 'admin-app/student-management/',

    'BlockTutor'                      : 'admin-app/block-user/',

    'SeeSessionsToApprove'            : `session-admin/see-session-to-approve/`,
    'GiveApprovelForSession'          : `session-admin/approve-session/`,
    'GiveRejectForSession'            : 'session-admin/reject-session/',
    'ActiveSessions'                  : `session-admin/see-session-active/`,
    'BlockedSessions'                : 'session-admin/block-session/',
    'InactiveSessions'               : 'session-admin/see-session-inactive/',
    'SeeBlockedSessions'                : 'session-admin/see-blocked-session/',
    
    
    "SeeSessionPayment"               : `payment-admin/session-payment-details/`,

    "GetSubscriptionPrice" : "price-setter/get-all-subscriptions-amount/",
    "UpdateSubscriptionPrice": "price-setter/update-amount/",
};