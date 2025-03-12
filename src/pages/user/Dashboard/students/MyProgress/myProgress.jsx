import { useEffect, useState } from "react";
import AssessmentPerformance from "./components/AssessmentPerformance";
import DailyTaskPerformance from "./components/DailyTaskPerformance";
import api, { API_BASE_URLS } from "../../../../../api/axios_api_call";
import Skeleton from "../../components/skelton";
import { getSessionData } from "../../components/currentSession";

const MyProgress = () => {
    const [fetchFromBackend, setFetchFromBackend] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [assessmentData, setAssessmentData] = useState({
        categories: [],
        marksObtained: [],
        marksLost: []
      });

    const [attendedTask, setAttendedTask] = useState([]);
    const [totalTask, setTotalTask] = useState([])
    const [taskScoreRatio, setTaskScoreRatio] = useState([])
    
    const url = API_BASE_URLS['Session_Service'];
    const session = getSessionData()

    const getDataForAssessmentCharts = async () => {
        try{
            const response = await api.get(
                "student-progress/assessment-performance-graph/", {
                    params: {
                        session_code: session.sessions.session_code
                    },
                    baseURL: url
                }
            );
            console.log(response);
            const { categories, marks_obtained, marks_lost } = response.data.data;
            setAssessmentData({
                categories: categories,
                marksObtained: marks_obtained,
                marksLost: marks_lost
            });
        } catch (err){
            console.error(err);
            
        }
    };

    const getDataForDailyTaskCharts = async () => {
        const response = await api.get(
            "student-progress/daily-performance-graph/", {
                params: {
                    session_code: session.sessions.session_code
                },
                baseURL: url
            }
        );
        console.log("TASK :",response);

        setAttendedTask(response.data.attended_task)
        setTotalTask(response.data.total_task)
        setTaskScoreRatio(response.data.task_score_ratio)

    };
    
    useEffect(() => {
        if (fetchFromBackend) {
            Promise.all([getDataForAssessmentCharts(),getDataForDailyTaskCharts()])
            .finally(() => {
                setTimeout(() => {
                    setIsLoading(false); 
                    setFetchFromBackend(false);
                }, 3000); 
            });
        }
    }, [fetchFromBackend]);

    return (
        <div className="grid grid-cols-1 md:h-[610px] 2xl:h-full overflow-y-auto gap-2">
            <div className="">
            {isLoading ? (
                    <Skeleton className="h-96 w-full" /> 
                ) : (
                <AssessmentPerformance assessmentData={assessmentData} />
                )
            }        
            </div>
            <div className="">
            {isLoading ? (
                    <Skeleton className="h-96 w-full" /> 
                ) : (
                <DailyTaskPerformance 
                    attendedTask={attendedTask}
                    totalTask={totalTask}
                    taskScoreRatio={taskScoreRatio}
                    />
                )
            }
            </div>
        </div>
    );
};

export default MyProgress;