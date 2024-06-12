export default class HomePageSetupValidations {
	public updateAboutUsSection = {
		title: "required|string",
		content: "required|string",
		image: "mimes:png,jpg,jpeg,webp",
	};

	public updateBottomSection = {
		image: "mimes:png,jpg,jpeg,webp",
		text_content: "required|string",
		our_vision_content: "required|string",
		our_mission_content: "required|string",
	};
}
