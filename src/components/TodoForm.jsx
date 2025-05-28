import { createPortal } from 'react-dom';

const TodoForm = ({
  isEditing = false,
  showDialog,
  onClose,
  title,
  content,
  categoryId,
  categories,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onSubmit,
  submitDisabled
}) => {
  const titleId = isEditing ? 'edit-title' : 'title';
  const contentId = isEditing ? 'edit-content' : 'content';
  const categoryInputId = isEditing ? 'edit-category' : 'category';
  const formTitle = isEditing ? 'Edit Todo' : 'Add New Todo';
  const submitButtonText = isEditing ? 'Save Changes' : 'Add Todo';

  if (!showDialog) return null;

  return createPortal(
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>{formTitle}</h2>
        <div className="form-group">
          <label htmlFor={titleId}>Title</label>
          <input
            id={titleId}
            type="text"
            placeholder="Todo title..."
            value={title}
            onChange={onTitleChange}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor={contentId}>Content</label>
          <textarea
            id={contentId}
            placeholder="Todo content..."
            value={content}
            onChange={onContentChange}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label htmlFor={categoryInputId}>Category</label>
          <select
            id={categoryInputId}
            value={categoryId}
            onChange={onCategoryChange}
          >
            <option value="">No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category}
              </option>
            ))}
          </select>
        </div>
        <div className="dialog-buttons">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button 
            onClick={onSubmit} 
            className="add-button"
            disabled={submitDisabled}
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TodoForm;
