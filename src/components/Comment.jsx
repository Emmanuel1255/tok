// src/components/Comment.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Pencil, 
  Trash2, 
  X as XIcon, 
  Check as CheckIcon 
} from "lucide-react";

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${import.meta.env.VITE_API_BASE_URL_IMG}${imagePath}`;
};

export default function Comment({ 
  comment,
  postId,
  onEdit,
  onDelete,
  className = ""
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  
  const isAuthor = user?.id === comment.user._id;
  
  
  const handleEdit = async () => {
    try {
      await onEdit(postId, comment._id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit comment:', error);
      // You could add toast notification here
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        setIsDeleting(true);
        await onDelete(postId, comment._id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
        setIsDeleting(false);
        // You could add toast notification here
      }
    }
  };

  return (
    <div className={`flex space-x-4 ${className} ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="flex-shrink-0">
        <img
          src={getImageUrl(comment.user.avatar) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel'}
          alt={`${comment.user.firstName} ${comment.user.lastName}`}
          className="h-10 w-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel';
          }}
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {`${comment.user.firstName} ${comment.user.lastName}`}
            </h3>
            <p className="text-sm text-gray-500">@{comment.user.username}</p>
          </div>
          {isAuthor && !isEditing && !isDeleting && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="inline-flex items-center rounded px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
              >
                <XIcon className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="inline-flex items-center rounded px-2.5 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
        )}
        
        <time className="block mt-1 text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleDateString()}
        </time>
      </div>
    </div>
  );
}