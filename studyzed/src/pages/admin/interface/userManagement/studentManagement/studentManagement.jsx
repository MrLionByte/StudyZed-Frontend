import {useStudentManagement} from './_lib.js';

export default function StudentManagement() {

  const {
      students,
  } = useStudentManagement();

  return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          
          <div className="aspect-video rounded-xl bg-muted/50 flex justify-center items-center" >
            <img src="" alt="profile Pic" />
            <p>USERNAME:{students}</p>
          </div>
        </div>
      </div>
  )
};