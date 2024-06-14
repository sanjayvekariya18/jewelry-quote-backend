export enum USER_TYPES {
	ADMIN = "admin",
	USER = "user",
}

export enum PERMISSIONS {
	USERS = "users",
	USER_PERMISSIONS = "user_permissions",
	CATEGORY = "category",
	SUB_CATEGORY = "sub_category",
	PRODUCT = "product",
	CUSTOMER = "customer",
	CATALOG_MASTER = "catalog_master",
	ATTRIBUTES = "attributes",
	OPTIONS = "options",
	QUOTATION = "quotation",
	STYLE_MASTER = "style_master",
	DASHBOARD = "dashboard",
	HOME_PAGE_SETUP = "home_page_setup",
}

export enum QUOTATION_STATUS {
	PENDING = "pending",
	COMPLETED = "completed",
}

export enum OTHER_DETAIL_TYPES {
	LABEL = "label",
	TEXTBOX = "textbox",
}

export enum HOME_PAGE_SECTIONS {
	SLIDER_SECTION = "slider_section",
	BANNER_SECTION = "banner_section",
	ABOUT_US_SECTION = "about_us_section",
	OUR_CATEGORY_SECTION = "our_category_section",
	BOTTOM_SECTION = "bottom_section",
	SPECIAL_OFFERS = "special_offers",
}

export enum DESCRIPTION_OF_BUSINESS {
	RETAILER = "retailer",
	WHOLESALER = "wholesaler",
	DEALER = "dealer",
	FINANCIER = "financier",
	OTHER = "other",
}
