"use client";

import { createContext, useContext, useState } from "react";

// Export the context so it can be used with useContext
export const SnowOverlayContext = createContext({
	isSnowing: false,
	toggleSnowSetting: () => {},
});

export const SnowOverlayProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isSnowing, setIsSnowing] = useState(() => {
		if (typeof window !== "undefined") {
			const setting = localStorage.getItem("isSnowing");
			return setting !== null ? JSON.parse(setting) : false;
		}
	});

	const toggleSnowSetting = () => {
		const newValue = !isSnowing;
		setIsSnowing(newValue);
		if (typeof window !== "undefined") {
			localStorage.setItem("isSnowing", JSON.stringify(newValue));
		}
	};
	const value = {
		isSnowing,
		toggleSnowSetting,
	};
	return (
		<SnowOverlayContext.Provider value={value}>
			{children}
		</SnowOverlayContext.Provider>
	);
};

export const useSnowOverlay = () => {
	const context = useContext(SnowOverlayContext);
	if (context === undefined) {
		throw new Error("useSnow must be used within a ThemeProvider");
	}
	return context;
};