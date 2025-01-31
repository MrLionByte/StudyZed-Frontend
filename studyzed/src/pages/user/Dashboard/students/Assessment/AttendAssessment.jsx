import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const AttendAssessmentModal = ({ assessmentData, handleClose, onSubmit = () => {} }) => {
  const questions = assessmentData?.questions || [];

  const [answers, setAnswers] = useState(
    questions.map(q => ({
      questionId: q.id,
      answer: q.options && q.options.length > 0 ? [] : ''
    }))
  );

  if (questions.length === 0) {
    return null;
  }

  const updateAnswer = (questionId, value) => {
    setAnswers(prev => 
      prev.map(ans => 
        ans.questionId === questionId ? { ...ans, answer: value } : ans
      )
    );
  };

  const handleMultipleChoiceSelect = (questionId, optionValue, isChecked) => {
    setAnswers(prev => 
      prev.map(ans => {
        if (ans.questionId === questionId) {
          return {
            ...ans, 
            answer: isChecked 
              ? [...(ans.answer || []), optionValue]
              : (ans.answer || []).filter(val => val !== optionValue)
          };
        }
        return ans;
      })
    );
  };

  const renderQuestionInput = (question) => {
    const questionType = question.options && question.options.length > 0 
      ? (question.options.some(opt => opt.is_correct) ? 'SINGLE_CHOICE' : 'MULTIPLE_CHOICE')
      : 'OPEN';

    switch(questionType) {
      case 'OPEN':
        return (
          <Textarea 
            placeholder="Write your answer here..."
            value={answers.find(a => a.questionId === question.id)?.answer || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className="w-full min-h-[150px] bg-black/20 text-white"
          />
        );
      case 'SINGLE_CHOICE':
        return (
          <RadioGroup 
            onValueChange={(value) => updateAnswer(question.id, value)}
            className="space-y-2 "
          >
            {question.options?.map((option) => (
              <div key={option.option_no} className="flex items-center space-x-2">
                <RadioGroupItem 
                    className="bg-green-600"
                  value={option.option} 
                  id={`option-${question.id}-${option.option_no}`} 
                />
                <Label htmlFor={`option-${question.id}-${option.option_no}`}>
                  {option.option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.option_no} className="flex items-center space-x-2">
                <Checkbox 
                  id={`option-${question.id}-${option.option_no}`}
                  checked={
                    answers.find(a => a.questionId === question.id)?.answer.includes(option.option) || false
                  }
                  onCheckedChange={(checked) => 
                    handleMultipleChoiceSelect(question.id, option.option, checked)
                  }
                />
                <Label htmlFor={`option-${question.id}-${option.option_no}`}>
                  {option.option}
                </Label>
              </div>
            ))}
          </div>
        );
      default:
        return <p className="text-red-500">Unsupported question type</p>;
    }
  };

  const handleSubmitAssessment = () => {
    onSubmit(answers);
    console.log(answers);
    
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-teal-800/30 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-gray-900/95 z-10 border-b border-teal-800/30 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-teal-400">
              {assessmentData.assessment_title}
            </h2>
            <button 
              onClick={handleClose} 
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-400 mt-2">{assessmentData.assessment_description}</p>
          <div className="text-gray-300 text-sm mt-2">
            Start: {new Date(assessmentData.start_time).toLocaleString()}
            <br />
            End: {new Date(assessmentData.end_time).toLocaleString()}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-black/20 p-4 rounded-lg space-y-3">
              <h3 className="text-white font-bold">
                {index + 1} - {question.question}
              </h3>
              <p className="text-gray-400">
                Max Score: {question.max_score}
              </p>
              {renderQuestionInput(question)}
            </div>
          ))}
          
          <button 
            onClick={handleSubmitAssessment}
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendAssessmentModal;