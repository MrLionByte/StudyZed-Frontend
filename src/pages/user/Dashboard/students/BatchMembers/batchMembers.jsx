import React from 'react';
import { User } from 'lucide-react';
import { getStudentByCode } from '../../components/studentsInSession';

export default function BatchMembers() {
  const students = getStudentByCode();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {students.map((student, index) => (
        <div
          key={student.user_code}
          className="student-card p-4 rounded-lg shadow-md text-white"
        >
          <div className="flex items-center gap-3">
            {student?.profile?.profile_picture ? (
              <img
                src={student?.profile?.profile_picture.slice(13)}
                className="rounded-full h-10 w-10"
                alt=""
              />
            ) : (
              <User className="h-10 w-10 text-green-500" />
            )}
            <div>
              <p className="text-sm ">{student.username}</p>
              <p className="text-2xl font-bold"></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
