const bcrypt = require('bcrypt');
const User = require("../models/User.js");
const auth = require("../auth.js");
const { errorHandler } = auth;


module.exports.registerUser = (req, res) => {
	if (!req.body.email.includes("@")){
		return res.status(400).send({message: "Email Invalid"});
	}

	else if (req.body.mobileNo.length !== 11){
		return res.status(400).send({message: "Mobile number invalid"});
	}
	else if (req.body.password.length < 8) {
		return res.status(400).send({message: "Password must be atleast 8 characters"});
	} else {
		let newUser = new User({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			mobileNo : req.body.mobileNo,
			password : bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((result) => res.status(201).send({message: "Registered Successfully"}))
		.catch(error => errorHandler(error, req, res));
	}
}

module.exports.loginUser = (req, res) => {
	return User.findOne({ email: req.body.email })
	.then(result => {
		if (!req.body.email.includes("@")){
		return res.status(400).send({error: "Invalid Email"});
		} else if(result == null){
			return res.send({error: "No Email Found"});
		} else {
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

			if(isPasswordCorrect){
				return res.send({ access: auth.createAccessToken(result) })
			} else {
				return res.send({error: "Email and password do not match"});
			}
		}
	})
	.catch(error => errorHandler(error, req, res))
}

module.exports.showUserDetails = (req, res) => {
	return User.findById(req.body._id)
	.then(user => {

		if(!user){
            // if the user has invalid token, send a message 'invalid signature'.
			return res.status(403).send({ error: 'User not found' })
		}else {
            // if the user is found, return the user.
			user.password = undefined;
			return res.status(200).send({user : user});
		}  
	})
	.catch(error => errorHandler(error, req, res));
};

module.exports.updateAdmin = (req, res) => {
	let adminUserId = req.user.id; //user id after generated token
    let userId = req.params.id; // Get userId from url
    let adminUser = User.findById(adminUserId);
    let userToUpdate = User.findById(userId);

    console.log("admin", adminUser.firstName);
    if (!adminUser || !adminUser.isAdmin) {
		return res.status(403).send({ message: "Unauthorized" });
	}

	return User.findById(userId)
	.then(result => {
		if (!result) {
    		return res.status(404).send({ 
    			error: "Failed to Find",
    			details: {} });
    	}
    	result.isAdmin = true;
    	result.save()
    	.then(() => res.send({ updatedUser: `${result}` }));
	})
	.catch(error => errorHandler(error, req, res))
}

module.exports.updatePassword = (req, res) => {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    bcrypt.hash(newPassword, 10)
        .then(hashedPassword => {
            // Updating the user's password in the database
            return User.findByIdAndUpdate(id, { password: hashedPassword });
        })
        .then(() => {
            // Sending a success response
            res.status(200).send({ message: 'Password reset successfully' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        });
};
