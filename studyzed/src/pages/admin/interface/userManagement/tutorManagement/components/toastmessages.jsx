export const ToastMessage = () =>{
    return (
        <div>
            <p>Are you sure you want to {isActive ? "unblock" : "block"} {tutor}?</p>
                <button
                    className="rounded bg-green-500 text-white px-4 py-2 mt-2"
                    onClick={() => {
                        handleBlockUser(e, tutorId);
                        closeToast();
                    }}
                >
                    Yes
                </button>
        </div>
    );
}