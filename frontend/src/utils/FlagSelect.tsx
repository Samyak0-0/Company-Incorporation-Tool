import React from "react";
import ReactFlagsSelect from "react-flags-select";

interface FlagSelectProps {
  value?: string;
  onChange?: (code: string) => void;
}

const FlagSelect: React.FC<FlagSelectProps> = ({ value = "", onChange }) => {
  const handleSelect = (code: string) => {
    if (onChange) {
      onChange(code);
    }
  };

  return (
    <div className="w-full relative">
      <ReactFlagsSelect
        className="w-full "
        selected={value}
        onSelect={handleSelect}
        selectedSize={20}
        optionsSize={20}
        placeholder="Select Your Nationality"
        searchable
      />
    </div>
  );
};

export default FlagSelect;
// <div className="relative">
//   <ReactFlagsSelect
//     selected="IN"
//     onSelect={() => {}}
//     disabled
//     showSelectedLabel={true}
//     className="relative"
//   />
//   <div className="w-6 h-6 top-1 right-1 bg-amber-200 absolute"></div>
//
//
// </div>
//
