import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";

import { useTheme } from "../../hooks/useTheme";

const CommentModal = ({ isOpen, onClose, onCommentSubmit }) => {
  const [comment, setComment] = useState("");
  const theme = useTheme();

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!comment) {
      toast.error("Please add some comment");
    }

    onCommentSubmit(comment);

    // Close the modal
    onClose();
  };

  return (
    <div>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            theme === "dark" ? "bg-black" : "bg-gray-400"
          } bg-opacity-50`}
        >
          <div
            className={`rounded-lg p-6 w-[80vw] sm:w-96 border border-gray-500 ${
              theme === "dark" ? "bg-dark-secondary" : "bg-white"
            }`}
          >
            <div className="flex justify-end">
              <AiOutlineClose
                className={`cursor-pointer text-${
                  theme === "dark" ? "white" : "black"
                } text-2xl`}
                onClick={onClose}
              />
            </div>
            <label
              className={`text-${
                theme === "dark" ? "white" : "black"
              } block mb-2`}
            >
              Drop your comment
            </label>
            <textarea
              className={`border p-2 w-full resize-none rounded-md focus:outline-none ${
                theme === "dark"
                  ? "bg-transparent text-white"
                  : "bg-transparent"
              }`}
              rows="4"
              value={comment}
              onChange={handleCommentChange}
            ></textarea>
            <div className="mt-4">
              <button
                className={`px-4 py-2 font-medium ${
                  theme === "dark"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                } rounded`}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentModal;
