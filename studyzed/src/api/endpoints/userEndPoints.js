const Payment_Service = "http://127.0.0.1:8008"
const Session_Task_Service = "http://127.0.0.1:8009"
const User_Service = "http://127.0.0.1:8005"


export const userCommonEndPoints = {
    'SignupEmail'        : 'auth-app/user-email/',
    'SignupOtp'          : 'auth-app/verify-otp/',
    'SignupResendOtp'    : 'auth-app/resend-otp/',
    'SignupUserDetails'  : 'auth-app/user-details/',
    'Login'              : 'auth-app/login/',
    'ResetPassword'      : 'auth-app/forgot-password/',
    'AccessToken'        : 'auth-app/token/',
    'RefereshToken'      : 'auth-app/refresh/', 
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

    'GetStudentAssessments' :'assessment-student/get-session-for-students/',
    
}

export const TutorEndPoints = {
    'TutorProfilePic' : 'user-app/upload-profile-pic/',
    'TutorCoverPic': 'user-app/upload-cover-pic/',
    'TutorDetails' : 'user-app/user-profile/',
    'CreateNewSession'   : `session-tutor/create-session/`,  
    'CreateSessionPayment'   : `session-buy/create-checkout-session/`,

    'CreateSessionUsingWallet' : 'session-buy/pay-using-wallet/',

    'GetWalletDetails': 'wallet/tutor-wallet/',
    'AddToWallet': 'wallet/create-wallet-transaction/',

    'TutorSessions'          : 'session-tutor/tutor-sessions/',
    'StudentsInSession'      : 'session-tutor/all-session-students/',
    'ApproveStudentInSession': 'session-tutor/approve-student-to-session/',
    
    'CreateNewAssessment'    :'assessment-tutor/create-assessment/',
    'GetAllAssessments'      :'assessment-tutor/get-assessments/',
}

