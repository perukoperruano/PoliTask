
import React from 'react';
import { MessageSquare } from 'lucide-react';
import CommentItem from '../CommentItem';
import CreateCommentForm from '../CreateCommentForm';

const TaskComments = ({ taskId, comments, onCommentCreated }) => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
        <MessageSquare size={22} className="mr-2 text-primary" />
        Comentarios ({comments.length})
      </h2>
      {comments.length === 0 ? (
        <p className="text-muted-foreground">No hay comentarios aún. ¡Sé el primero!</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      <CreateCommentForm taskId={taskId} onCommentCreated={onCommentCreated} />
    </div>
  );
};

export default TaskComments;
