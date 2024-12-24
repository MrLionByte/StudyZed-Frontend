import React from 'react';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-red-500">404</h1>
                <p className="text-2xl text-slate-200 mt-4">The page you're looking for doesn't exist.</p>
            </div>
        </div>
    );
}
