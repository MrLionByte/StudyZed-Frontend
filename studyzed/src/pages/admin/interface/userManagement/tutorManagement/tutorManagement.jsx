import {useTutorManagement} from './_lib.js';

export default function StudentManagement() {

  const {
      tutors,
  } = useTutorManagement();
  
  return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {tutors.map((tutor) => (
          <div key={tutor.id}
            className="aspect-video rounded-xl bg-muted/50 flex justify-center items-center" >
              
              <p>USERNAME:{tutor.username}</p>
              <img src={tutor.profile.profile_picture.replace("image/upload/","")} alt="profile Pic" />
              
          </div>
            ))}
        </div>
      </div>
  )
};