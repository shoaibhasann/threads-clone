import { useState } from "react";
import { RiMoreFill } from "react-icons/ri";

const Dropdown = ({ onEdit, onDelete, onReport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleEdit = () => {
    onEdit();
    toggleDropdown();
  };

  const handleDelete = () => {
    onDelete();
    toggleDropdown();
  };

  const handleReport = () => {
    onReport();
    toggleDropdown();
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full py-2 text-base font-medium text-dark-text hover:dark:text-white hover:text-black"
          id="options-menu"
          onClick={toggleDropdown}
        >
          <RiMoreFill className="h-5 w-5" />
        </button>
      </div>
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 w-32 rounded-md shadow-lg bg-light-background dark:bg-dark-secondary"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1 dark:text-white" role="none">
            <button
              className="block px-4 py-2 text-sm w-full text-left border-b border-dark-text"
              onClick={handleEdit}
              role="menuitem"
            >
              Edit
            </button>
            <button
              className="block px-4 py-2 text-sm w-full text-left border-b border-dark-text"
              onClick={handleDelete}
              role="menuitem"
            >
              Delete
            </button>
            <button
              className="block px-4 py-2 text-sm text-red-500 w-full text-left"
              onClick={handleReport}
              role="menuitem"
            >
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
