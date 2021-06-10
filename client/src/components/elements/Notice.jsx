import React, { Component } from "react";

export default function Notice(props) {
	return (
		<span className="txt-icon notice">
			<i>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 40 40"
				>
					<circle
						fill="#f6f7f7"
						stroke="#bdccd4"
						stroke-width="1px"
						cx="20"
						cy="20"
						r="20"
					/>
					<line
						fill="none"
						stroke="#929EAC"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						x1="20"
						y1="10"
						x2="20"
						y2="21.1"
					/>
					<circle fill="#929EAC" cx="20" cy="29.2" r="2.5" />
				</svg>
			</i>
			<span>{props.text}</span>
		</span>
	);
}
