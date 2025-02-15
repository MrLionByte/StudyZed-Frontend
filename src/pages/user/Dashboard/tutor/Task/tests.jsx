import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCheck } from 'lucide-react';
import { useEffect, useState } from "react";
import api, { api_dictatory } from "../../../../../api/axios_api_call";
import { TutorEndPoints } from "../../../../../api/endpoints/userEndPoints";
import { getSessionData } from "../../components/currentSession";


const TutorTask = () => {
  const session_data = getSessionData()
  const [tasks, setTasks] = useState([]);
  const [fetchFromBackend, setFetchFromBackend] = useState(true)
  const [newTask, setNewTask] = useState({
    title:"", 
    description: "", 
    session:session_data?.sessions});

  const handleCreateTasks = async () => {
    try {
      const url = api_dictatory["Session_Service"]

      const response = await api.post(TutorEndPoints.CreateNewTask, newTask,{
        baseURL: url,
      })
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const GetAllTasks = async () => {
    try {
      const url = api_dictatory["Session_Service"]
      const response = await api.get(TutorEndPoints.GetAllTasks, {
        baseURL: url,
      })
      console.log(response);
      setTasks(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewTask({ ...newTask, [id]: value });
  }
  useEffect(()=>{
    if (fetchFromBackend){
      GetAllTasks();
      setFetchFromBackend(false)
    }
  }, [fetchFromBackend])
  return (

<div className="flex justify-center items-center h-full">
  <div className="grid grid-cols-4 gap-6 p-3 min-w-fit">
      <button className="p-3 hover:bg-emerald-400 rounded-xl font-semibold ">
        Create Daily Task</button>
      <button className="p-3 bg-emerald-400 rounded-xl text-black font-semibold">
        See Daily Task</button>
      <button className="p-3 bg-emerald-400 rounded-xl text-black font-semibold">
        See Task</button>
      <button className="p-3 bg-emerald-400 rounded-xl text-black font-semibold">
        Create TASK</button>
      </div>
    </div>
  );
};

export default TutorTask;