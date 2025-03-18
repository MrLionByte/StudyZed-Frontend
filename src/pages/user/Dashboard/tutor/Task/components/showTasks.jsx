import { useEffect, useState } from 'react';
import { Plus, X, Circle, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api, { API_BASE_URLS } from '../../../../../../api/axios_api_call';
import { TutorEndPoints } from '../../../../../../api/endpoints/userEndPoints';
import { getStudentByCode } from '../../../components/studentsInSession';

const TaskSubmittedModal = ({ taskData, handleClose }) => {
  const [mark, setMark] = useState('0');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [markMarked, setMarkMarked] = useState(false);
  console.log(taskData);

  const studentDetails = getStudentByCode();

  const handleFinalizeMark = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmMark = () => {
    if (mark === '') {
      return;
    }
    try {
      const url = API_BASE_URLS['Session_Service'];
      const response = api.patch(
        `task-tutor/tasks/${taskData.id}/mark/`,
        { score: mark },
        {
          baseURL: url,
        },
      );
      console.log(response);

      setMarkMarked(true);
    } catch (error) {
      console.log(error);
    }
    setShowConfirmDialog(false);
  };

  const handleMarkInput = (value) => {
    if (value === '') {
      setMark('');
      return;
    }
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      if (parsedValue > 10) {
        setMark(10);
      } else if (parsedValue < 0) {
        setMark(0);
      } else {
        setMark(parsedValue);
      }
    }
  };

  function getStudentNameByCode(studentCode) {
    const matchedStudent = studentDetails.find(
      (student) => student.user_code === studentCode,
    );
    return matchedStudent ? matchedStudent.username : 'Student not found';
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-gray-900/95 border border-teal-800/30 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto m-4">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-teal-400">
              <span className="text-white text-opacity-50">
                Submitted By :{' '}
              </span>
              {getStudentNameByCode(taskData.student_code)}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {taskData ? (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between rounded-lg">
                <div>
                  {!taskData?.is_late_submission && (
                    <p className="bg-yellow-600 rounded-md text-center p-1 text-white">
                      Is late submission
                    </p>
                  )}
                </div>
                {markMarked || !taskData?.score ? (
                  <div className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="mark-input">Mark:</label>
                      <input
                        id="mark-input"
                        type="text"
                        value={mark}
                        onChange={(e) => handleMarkInput(e.target.value)}
                        className="p-1 ml-3 text-center font-bold rounded-2xl text-black bg-slate-500 shadow-inner w-24 hover:shadow-slate-100"
                      />
                    </div>
                    <button
                      onClick={handleFinalizeMark}
                      className="bg-emerald-500 rounded-lg p-1 hover:bg-red-600"
                    >
                      Finalize
                    </button>
                  </div>
                ) : (
                  <p>MARK : {markMarked || taskData?.score}</p>
                )}
              </div>

              <p className="text-gray-400 w-full break-words">
                {taskData.answer}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">No Assessment Data Available</p>
          )}
          <p>{taskData.score}</p>
        </div>
      </div>

      {showConfirmDialog && mark !== '' && Number(mark) > -1 && (
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="text-black bg-slate-300 bg-opacity-50 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Final Mark</DialogTitle>
              <DialogDescription className="text-white">
                Are you sure you want to finalize the mark as <b>{mark}</b>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-4 sm:justify-end">
              <Button
                className="bg-slate-300 hover:bg-emerald-400"
                type="button"
                variant="primary"
                onClick={handleConfirmMark}
              >
                Yes
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  className="text-black hover:bg-red-400"
                  variant="secondary"
                >
                  No
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TaskSubmittedModal;
