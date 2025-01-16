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
    // 'ChooseSession'      : '/tutor-app/student/session/',
    'AllSessions'           : '/session-student/view-session/',
    'ChooseSession'         : 'session-student/enter-session/',
    
}

export const TutorEndPoints = {
    'TutorProfilePic' : 'user-app/upload-profile-pic/',
    'TutorCoverPic': 'user-app/upload-cover-pic/',
    'TutorDetails' : 'user-app/user-profile/',
    'CreateNewSession'   : `${Session_Task_Service}/session-tutor/create-session/`,  
    'CreateSessionPayment'   : `${Payment_Service}/session-buy/create-checkout-session/`,
    
}

