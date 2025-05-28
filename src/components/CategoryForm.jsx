import { createPortal } from 'react-dom';

const CategoryForm = ({
  showDialog,
  categoryName,
  onNameChange,
  onSubmit,
  onClose,
}) => {
  if (!showDialog) return null;

  return createPortal(
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>Add New Category</h2>
        <div className="form-group">
          <label htmlFor="category-name">Category Name</label>
          <input
            id="category-name"
            type="text"
            placeholder="Enter category name..."
            value={categoryName}
            onChange={onNameChange}
            autoFocus
          />
        </div>
        <div className="dialog-buttons">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button 
            onClick={onSubmit} 
            className="add-button"
            disabled={!categoryName.trim()}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CategoryForm;
