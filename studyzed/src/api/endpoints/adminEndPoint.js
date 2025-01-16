const Payment_Service = "http://127.0.0.1:8008"
const Session_Task_Service = "http://127.0.0.1:8009"
const User_Service = "http://127.0.0.1:8005"


export const adminEndPoints = {
    'AdminLogin'                      : 'admin-app/login-strict/',
    'TutorManagement'                 : 'admin-app/tutor-management/',
    'StudentManamgement'              : 'admin-app/student-management/',

    'BlockTutor'                      : 'admin-app/block-user/',

    'SeeSessionsToApprove'            : `session-admin/see-session-to-approve/`,
    'GiveApprovelForSession'          : `session-admin/approve-session/`,
    'ActiveSessions'                  : `session-admin/see-session-active/`,
    'InactiveSessions'                : 'session-admin/block-user/',
    'BlockedSessions'                 : 'session-admin/block-user/',

    
    "SeeSessionPayment"               : `payment-admin/session-payment-details/`,


};