import bcrypt from "bcryptjs";

const hashPassword = (password: string): Promise<any> => {
	return bcrypt.hash(password, 8);
};

const comparePassword = (password: string, hashPassword: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		bcrypt
			.compare(password, hashPassword)
			.then((isPasswordMatch) => {
				if (isPasswordMatch) {
					resolve(isPasswordMatch);
				} else {
					reject({ message: "Invalid credential" });
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export { hashPassword, comparePassword };
