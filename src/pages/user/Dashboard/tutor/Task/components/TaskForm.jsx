import { useState } from 'react';

const TaskForm = ({ selectedDate, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [formError, setFormError] = useState({
    titleError:'',
    descriptionError:'',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let dateAndTime ;
    let isValid = true

    setFormError({
      titleError: "",
      descriptionError: "",
    });

    if (title.trim() === "") {
      setFormError((prev) => ({
        ...prev,
        titleError: "Add Title before submitting",
      }));
      isValid = false
    }
    if (description.trim() === ""){
      setFormError((prev)=> ({
        ...prev,
        descriptionError: "Add description before submitting"
      }))
      isValid = false
    }
    console.log(selectedDate, typeof selectedDate);

    if (isValid){
      const isoString = selectedDate.toISOString();
      dateAndTime = `${isoString.split("T")[0]}T23:59:00.000Z`; 

      if (dueTime){
          const datePart = selectedDate.toISOString().split("T")[0]
          dateAndTime = `${datePart}T${dueTime}:00.000Z`;
        }

      onSubmit({
      date: selectedDate,
      date_and_time: dateAndTime,
      title,
      description,
      dueTime: dueTime || undefined
    });
    };
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-emerald-400">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=" block w-full rounded bg-emerald-900/30 border border-emerald-800 
                   text-white placeholder-emerald-700 focus:border-emerald-600 
                   focus:ring focus:ring-emerald-600/50"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-emerald-400">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded bg-emerald-900/30 border border-emerald-800 
                   text-white placeholder-emerald-700 focus:border-emerald-600 
                   focus:ring focus:ring-emerald-600/50"
          required
        />
      </div>

      <div>
        <label htmlFor="dueTime" className="block text-sm font-medium text-emerald-400">
          Due Time (optional : default 24:00) 
        </label>
        <input
          type="time"
          id="dueTime"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="mt-1 block w-full rounded bg-emerald-900/30 border border-emerald-800 
                   text-white placeholder-emerald-700 focus:border-emerald-600 
                   focus:ring focus:ring-emerald-600/50"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded 
                   transition-colors duration-200"
        >
          Create Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-emerald-900/50 hover:bg-emerald-900 text-white py-2 px-4 
                   rounded transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;