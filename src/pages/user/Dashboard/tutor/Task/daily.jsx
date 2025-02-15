import { Calendar } from 'antd';

export default function SeeDailyTasks () {
    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
      };

    return (
    <>
        <div className="flex flex-col justify-center align-middle h-full">
<h1>SET TASK</h1>
<div className="grid sm:grid-cols-6 md:grid-cols-8 gap-4 p-4">
  
  {Array.from({length: month}, (_, index) => (
  <button key={index}  onClick={handleCreateTasks}
  className="rounded p-2 bg-white flex items-center space-x-2 shadow-md">
    <CheckCheck className="text-blue-400" />
    <CircleX className="text-red-500" />
    <CircleCheck className="text-emerald-500" />
    
    <p  className="text-black">{index+1}</p>
  </button>
    ))}
</div>
  <div className="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 p-4">
        {tasks.map((task, index) => (
            <div key={index} 
            className="rounded p-2 bg-white flex items-center space-x-2 shadow-md">
            <CheckCheck className="text-green-500" />
            <p className="text-black">
          {new Date(task.created_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long'
          })}
        </p>
            </div>
        ))}
    </div>

    </div>
    </>
    )
}