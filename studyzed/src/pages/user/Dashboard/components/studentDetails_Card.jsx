import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Info } from 'lucide-react';
import {TutorEndPoints} from '../../../../api/endpoints/userEndPoints'
import axios from "axios"
import { getSavedAuthData } from "../../../../utils/Localstorage"
import { api_dictnory } from "../../../../api/axios_api_call"


export default function CardWithForm({cancelModeal}) {
    const [studentData, setStudentData] = useState([]);
    const [duration, setDuration] = useState("1"); 
    const [fetchFromBackend,setFetchFromBackend] = useState(true)

    const handleCancelButton = () => {
      cancelModeal()
    }

    useEffect(()=> {

      async function fetchStudentsData () {
          setLoading(true);
          try {

              const response = await api.get(TutorEndPoints.StudentsInSession,{
                  baseURL: url,
                  params: qury_data,
              });
              setStudents(response.data);
              console.log("RESPONSE BRUT",response.data)
          } catch (e) {
              setError(e);
              setLoading(false);
              console.error("Error :", e);
          }
      };
      if (fetchFromBackend){
          fetchStudentsData();
          setFetchFromBackend(false);
      }
  } ,[fetchFromBackend]);

  return (
    <>
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Create New Session</CardTitle>
          <div className="relative group">
            <Info className="cursor-pointer hover:text-blue-500" />
            <div className="absolute left-1/2 transform -translate-x-1/2 top-6 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 z-50 transition-opacity duration-300">
              Payment Details
            </div>
          </div>
        </div>
        <CardDescription>Make a new session.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={TutorEndPoints.CreateSessionPayment}>
          <div className="grid w-full items-center gap-4">

            <div className="flex gap-4">
                <div className="flex flex-col space-y-1.5 w-3/4">
                    <Label htmlFor="name">Session name: </Label>
                    <Input id="name" value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        placeholder="Give a name to session"
                    />
                </div>
                <div className="flex flex-col space-y-1.5 w-1/4">
                    <Label htmlFor="name">Grade:</Label>
                    <Input id="name" value={grade}
                        maxLength={2}
                        onChange={handleGradeChange}
                    />
                </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col space-y-1.5 w-3/4">
                <Label htmlFor="duration">Duration:</Label>
                <select
                  id="duration"
                  value={duration}
                  onChange={handleDurationChange}
                  className="p-2 border rounded-sm"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1.5 w-1/4 text-center">
                <Label htmlFor="amount" >Amount:</Label>
                <p id="amount" className="p-1 border bg-slate-200 rounded-sm">{amount}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Give description about Session:</Label>
              <textarea
                id="description"value={description}
                onChange={(e) => setDescription(e.target.value)}
                
                placeholder="Provide a brief description of the session"
                className="p-2 border rounded-md"
                rows="4"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleCancelButton} className="hover:bg-red-600" variant="outline">Cancel</Button>
        {/* <Button>Add to Cart</Button> */}
        <Button onClick={handleSubmit} className="hover:bg-green-600">Buy Session</Button>
      </CardFooter>
    </Card>
    </>
  )
}

