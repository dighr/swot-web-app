import React, { Component } from "react";

export default function NoteLine(props) {
	return (
		<div className="txt-icon notice txt-sm">
			<i>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 40 40"
					style={{ transform: " translate(-50%, -50%) scale(1.3)" }}
				>
					<circle
						fill="#929EAC"
						stroke="#bdccd4"
						strokeWidth="1px"
						cx="20"
						cy="20"
						r="20"
					/>
					<line
						fill="none"
						stroke="#f6f7f7"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						x1="20"
						y1="10"
						x2="20"
						y2="21.1"
					/>
					<circle fill="#f6f7f7" cx="20" cy="29.2" r="2.5" />
				</svg>
			</i>
			<span>{props.text || props.children}</span>
		</div>
	);
}
