import React from "react";
import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfileResetPassword(props) {
	const { key } = useParams();
	const form = useRef(null);

	useEffect(() => {
		fetch("/api/user/resetkey?key=" + key)
			.then((r) => r.json())
			.then((data) => {});
	}, [key]);

	const handleSubmitResponse = (data) => {};

	const handleChange = () => {};

	useEffect(() => {
		$(form.current).ajaxForm((data) => {
			handleSubmitResponse(data);
		});

		return () => {
			$(form.current).off();
		};
	}, []);

	return (
		<>
			<h1 className="content-title">Password Reset</h1>
			<form ref={form} role="form" action="/resetpassword" method="post">
				<section className="content-window">
					<section>
						<input type="hidden" name="resetkey" value={key} />
						<div className="flex-group">
							<label
								htmlFor="password"
								className="control-label line"
							>
								<input
									onChange={() => {
										handleChange();
									}}
									className="form-control email"
									id="password"
									name="password"
									type="password"
								/>
								<span class="label">Password:</span>
							</label>
							<label
								htmlFor="password_confirm"
								className="control-label line"
							>
								<input
									onChange={() => {
										handleChange();
									}}
									className="form-control"
									id="password_confirm"
									name="password_confirm"
									type="password"
								/>
								<span class="label">Confirm Password:</span>
							</label>
						</div>
					</section>
				</section>

				<section className="content-window">
					<section>
						<div className="submission-wrap">
							<input
								type="submit"
								className="button blue"
								value="Reset"
							/>
						</div>
					</section>
				</section>
			</form>
		</>
	);
}
