import React from 'react';

export default function Restricted() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-red-500">401</h1>
                <p className="text-2xl text-slate-200 mt-4">You are not suppose to be here, please go back.</p>
            </div>
        </div>
    );
}
