export const userCommonEndPoints = {
    'SignupEmail'        : 'auth-app/user-email/',
    'SignupOtp'          : 'auth-app/verify-otp/',
    'SignupResendOtp'    : 'auth-app/resend-otp/',
    'SignupUserDetails'  : 'auth-app/user-details/',
    'Login'              : 'auth-app/login/',
    'ResetPassword'      : 'auth-app/forgot-password/',
    'AccessToken'        : 'auth-app/token/',
    'RefereshToken'      : 'auth-app/refresh/', 

    "AllPaymentData": "price-setter/get-all-subscriptions-amount/",
};


export const studentEndPoints = {
    'StudentProfilePic'     : 'user-app/upload-profile-pic/',
    'StudentCoverPic'       : 'user-app/upload-cover-pic/',
    'StudentDetails'        : 'user-app/user-profile/',
    
    'GetWalletDetails': 'wallet/student-wallet/',
    'AddToWallet': 'wallet/create-wallet-transaction/',

    // 'ChooseSession'      : '/tutor-app/student/session/',
    'AllSessions'           : '/session-student/view-session/',
    'ChooseSession'         : 'session-student/enter-session/',
    'TutorSessionDetails'   : 'class-app/tutor-session-details/',

    'GetStudentAssessments' :'assessment-student/get-assessment-for-students/',
    'AttendAssessment'      : 'assessment-student/attend-assessment/',
    'GetAttendedAssessments'      : 'assessment-student/all-attended-assessments/',

    "GetTasksForStudent" : 'task-student/get-tasks-for-students/',
    "SubmitTask"        : 'task-student/task-submit-answer/',
}

export const TutorEndPoints = {
    'TutorProfilePic' : 'user-app/upload-profile-pic/',
    'TutorCoverPic': 'user-app/upload-cover-pic/',
    'TutorDetails' : 'user-app/user-profile/',
    'CreateNewSession'   : `session-tutor/create-session/`,  
    'CreateSessionPayment'   : `session-buy/create-checkout-session/`,

    
    'CreateSessionUsingWallet' : 'session-buy/pay-using-wallet/',
    
    'DeleteSubscription' :'session-buy/subscription-delete/',
    'DeleteSession' :'session-tutor/delete/',

    'GetWalletDetails': 'wallet/tutor-wallet/',
    'AddToWallet': 'wallet/create-wallet-transaction/',

    'StudentsDetailsList' : "class-app/session-student-details/",

    'AllowedStudentsInSession'  : 'session-tutor/students-in-session/',

    'TutorSessions'          : 'session-tutor/tutor-sessions/',
    'StudentsInSession'      : 'session-tutor/all-session-students/',
    'ApproveStudentInSession': 'session-tutor/approve-student-to-session/',
  
    'CreateNewAssessment'    :'assessment-tutor/create-assessment/',
    'GetAllAssessments'      :'assessment-tutor/get-assessments/',
    'GetStudentsAttendedAssessment': 'assessment-tutor/attended-students/',
    'GetAttendedAssessment'  : 'assessment-tutor/attended-students/assessment/',
    'UpdateAssessmentMark'   :'assessment-tutor/attended-students/assessment/update-mark/',

    'CreateNewTask'          : 'task-tutor/create-new-task/',
    'GetAllTasks'            : 'task-tutor/get-all-tasks/',
    'EditTask'            : 'task-tutor/edit-task/',
    
}

