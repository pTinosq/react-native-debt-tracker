import React from "react";
import { View } from "react-native";

type TProps = { size: number; horizontal?: boolean };

const Space = ({ size, horizontal }: TProps) => (
	<View style={{ [horizontal ? "width" : "height"]: size }} />
);

export default Space;
