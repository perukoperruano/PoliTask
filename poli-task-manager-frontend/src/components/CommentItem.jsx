import React, { useState, useEffect } from 'react';
import { getUserById } from '../services/api';
import UserAvatar from './UserAvatar'; // Importar UserAvatar
import { UserCircle2 } from 'lucide-react'; // Icono para avatar de usuario

/**
 * Componente para mostrar un comentario individual.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.comment - El objeto del comentario.
 */
const CommentItem = ({ comment }) => {
  const [commentUser, setCommentUser] = useState(null);

  useEffect(() => {
    if (comment.user_id) {
      getUserById(comment.user_id)
        .then(setCommentUser)
        .catch(err => console.error("Error fetching comment user:", err));
    }
  }, [comment.user_id]);

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow mb-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <UserAvatar name={commentUser ? commentUser.name : 'Anónimo'} size="md" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {commentUser ? commentUser.name : 'Usuario Anónimo'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(comment.created_at)}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
