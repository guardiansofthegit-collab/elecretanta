type VideoPlayerProps = {
	streamUrl: string;
	downloadUrl: string;
};

const VideoPlayer = ({ streamUrl, downloadUrl }: VideoPlayerProps) => {
	return (
		<div className="w-full max-w-3xl mx-auto">
			<video
				controls
				className="w-full aspect-video rounded-lg shadow-lg"
				playsInline
			>
				{/* HLS Stream */}
				<source src={streamUrl} type="application/x-mpegURL" />
				{/* MP4 Fallback */}
				<source src={downloadUrl} type="video/mp4" />
			</video>
		</div>
	);
};

export default VideoPlayer;
