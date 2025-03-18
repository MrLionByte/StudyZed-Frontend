import React from 'react';
import { Skeleton } from 'antd';

const ChatSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Skeleton.Avatar active size="large" />
        <div className="ml-3 bg-[#f0f0f0] p-3 rounded-lg w-[40%]">
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 1, width: '100%' }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="mr-3 bg-[#b1d1ef] text-white p-3 rounded-lg w-[40%]">
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 1, width: '100%' }}
          />
        </div>
        <Skeleton.Avatar active size="large" />
      </div>

      <div className="flex items-center">
        <Skeleton.Avatar active size="large" />
        <div className="ml-3 bg-[#f0f0f0] p-3 rounded-lg w-[40%]">
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 1, width: '100%' }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="mr-3 bg-[#b1d1ef] text-white p-3 rounded-lg w-[40%]">
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 1, width: '100%' }}
          />
        </div>
        <Skeleton.Avatar active size="large" />
      </div>

      <div className="flex items-center">
        <Skeleton.Avatar active size="large" />
        <div className="ml-3 bg-[#f0f0f0] p-3 rounded-lg w-[40%]">
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 1, width: '100%' }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="mr-3 bg-[#b1d1ef] text-white p-3 rounded-lg w-[40%]">
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 1, width: '100%' }}
          />
        </div>
        <Skeleton.Avatar active size="large" />
      </div>
    </div>
  );
};

export default ChatSkeleton;
