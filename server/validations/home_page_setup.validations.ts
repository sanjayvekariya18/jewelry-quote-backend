export default class HomePageSetupValidations {
	public updateAboutUsSection = {
		title: "present|string",
		content: "present|string",
		image: "mimes:png,jpg,jpeg,webp",
	};

	public updateBottomSection = {
		image: "mimes:png,jpg,jpeg,webp",
		image1: "mimes:png,jpg,jpeg,webp",
		text_content: "present|string",
		our_vision_content: "present|string",
		our_mission_content: "present|string",
	};
}
