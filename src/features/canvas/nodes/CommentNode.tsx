import { memo } from 'react';
import { NodeProps } from '@xyflow/react';

export const CommentNode = memo(({ data }: NodeProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 shadow-sm w-52 text-xs font-sans hover:shadow-md transition-shadow cursor-default">
      <div className="flex items-center gap-2 mb-2 border-b border-yellow-100 pb-1">
        <div className="w-4 h-4 rounded-md bg-yellow-500 text-white flex items-center justify-center font-bold text-[9px]">
             {(data.userName as string)?.[0] || '?'}
        </div>
        <span className="font-semibold text-yellow-900 truncate flex-1">{data.userName as string}</span>
      </div>
      <p className="text-yellow-900 whitespace-pre-wrap leading-relaxed break-words">
        {data.label as string}
      </p>
    </div>
  );
});
