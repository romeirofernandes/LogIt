import React from "react";

const Persistence = () => {
  return (
    <div className="max-w-3xl mx-auto mb-4 sm:mb-6 mt-2 sm:mt-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0d0c0c] dark:text-[#f1f1f2] mr-0 sm:mr-2">
            persistence
          </h1>
          <span className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
            /pərˈsɪstəns/
          </span>
        </div>

        <div className="mb-3 sm:mb-4">
          <span className="bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded-full text-xs font-medium">
            noun
          </span>
        </div>

        <div className="mb-3">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
            the fact of continuing in an opinion or course of action in spite of
            difficulty or opposition.
          </p>
        </div>

        <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-600 pt-3 mt-3 sm:mt-4">
          <p className="italic">
            "Persistence and endurance will make you omnipotent."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Persistence;
