import User from './schema_user.js';

export const getUser = async (username) => {
	const user = await User.findOne({ username: username }).lean();
	return user;
};

export default getUser;