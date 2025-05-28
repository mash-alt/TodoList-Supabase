const CategoryFilter = ({ 
  categories, 
  selectedFilterCategoryId, 
  onCategoryFilterClick,
  onAddCategoryClick 
}) => {
  return (
    <div className="category-filter-bar">
      <button 
        onClick={() => onCategoryFilterClick('all')} 
        className={`category-filter-button ${selectedFilterCategoryId === 'all' || selectedFilterCategoryId === null ? 'active' : ''}`}
      >
        All
      </button>
      {categories.map((category) => (
        <button 
          key={category.id} 
          onClick={() => onCategoryFilterClick(category.id)} 
          className={`category-filter-button ${selectedFilterCategoryId === category.id ? 'active' : ''}`}
        >
          {category.category}
        </button>
      ))}
      <button onClick={onAddCategoryClick} className="add-category-filter-button">
        +
      </button>
    </div>
  );
};

export default CategoryFilter;
