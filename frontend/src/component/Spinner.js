import React from "react";

function Spinner() {
  return (
    <div className="fixed inset-0 bg-black opacity-70 flex items-center justify-center z-[9999]">
      <div className="h-10 w-10 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
}

export default Spinner;
