import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

const FlagSelect = () => {
  const [selected, setSelected] = useState("");
  console.log(selected);

  return (
    <div className="relative">
      <ReactFlagsSelect
        selected="IN"
        onSelect={() => {}}
        disabled
        showSelectedLabel={true}
        className="relative"
      />
      <div className="w-6 h-6 top-1 right-1 bg-amber-200 absolute"></div>

      <ReactFlagsSelect
        selected={selected}
        onSelect={(code) => setSelected(code)}
        placeholder="Select Your Nationality"
        searchable
      />
    </div>
  );
};

export default FlagSelect;
