import  { useEffect, useRef } from "react";

function TextArea({ defaultValue, onChangeText }) {

    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        textarea.addEventListener("input", function (event){
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";

            onChangeText(event.target.value);
        });
    }, [onChangeText]);

  return (
    <textarea
      ref={textareaRef}
      className="w-full border-none focus:ring-0 focus:outline-none bg-transparent dark:text-gray-200 resize-none dark:caret-white"
      name="thread-content"
      id="thread-content"
      value={defaultValue}
      style={{ overflowY: "hidden" }}
      placeholder="Start a thread..."
    ></textarea>
  );
}

export default TextArea;
