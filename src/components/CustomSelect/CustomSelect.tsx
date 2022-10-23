/* eslint-disable @typescript-eslint/no-explicit-any */
import Select, { GroupBase, Props } from "react-select";

export default function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  const customStyles = {
    control: (): React.CSSProperties => ({
      height: "48px",
      display: "flex",
      alignItems: "center",
      backgroundColor: "hsl(0, 0%, 100%)",
      borderColor: "hsl(0, 0%, 80%)",
      borderRadius: "8px",
      borderStyle: "solid",
      borderWidth: "1px",
      cursor: "default",
      flexWrap: "wrap",
      justifyContent: "space-between",
      minHeight: "38px",
      outline: "0!important",
      position: "relative",
      transition: "all 100ms",
      boxSizing: "border-box",
    }),
    option: (provided: any, state: any): React.CSSProperties => ({
      ...provided,
      color: state.isSelected ? "#fff" : "#000",
    }),
  };

  return (
    <Select
      // @ts-expect-error - Weird typing on styles
      styles={customStyles}
      menuPlacement="auto"
      maxMenuHeight={200}
      {...props}
    />
  );
}
