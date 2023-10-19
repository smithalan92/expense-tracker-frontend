/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/store";
import { isMobile } from "react-device-detect";
import Select, { GroupBase, Props } from "react-select";
import MobileSelect from "./MobileSelect";

export default function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  const isNativeSelectsOnMobileDisabled = useAppSelector(
    (state) => state.userSettings.disableNativeSelectsOnMobile
  );

  const customStyles = {
    control: (): React.CSSProperties => ({
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
      minHeight: "48px",
      outline: "0!important",
      position: "relative",
      transition: "all 100ms",
      boxSizing: "border-box",
    }),
    option: (provided: any, state: any): React.CSSProperties => ({
      ...provided,
      color: state.isSelected ? "#fff" : "#000",
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 10,
    }),
  };

  if (isMobile && !props.isMulti && !isNativeSelectsOnMobileDisabled)
    return (
      <MobileSelect
        className={props.className}
        onChange={props.onChange}
        value={props.value as any}
        options={props.options as any}
      />
    );

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
