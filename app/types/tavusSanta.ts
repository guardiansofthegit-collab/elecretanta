export type UnprocessedVideoResult = {
	video_id: string;
	video_name: string;
	status: string;
	hosted_url: string;
	created_at: string;
};
export type ProcessedVideoResult = UnprocessedVideoResult & {
	download_url: string;
	stream_url: string;
};
