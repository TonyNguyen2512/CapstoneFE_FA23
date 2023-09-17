import DOMPurify from "dompurify";
import React from "react";

export const RawHtml = ({ html }) => {
	const sanitizedHtml = DOMPurify.sanitize(html);
	return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};
