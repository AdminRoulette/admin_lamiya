const {User} = require("../../../../models/models");

function reNewUserInfo({firstName,lastName,mobile,email,user}) {
    let newFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    let newLastname = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        if(firstName.length < 21 && lastName.length < 31 && mobile.length === 13 && email?.length < 51) {
             User.update(
                {firstname: newFirstName, lastname: newLastname, phone: mobile,email:email?email:user.email},
                {where: {id: user.id}}
            )
        }
}
module.exports = reNewUserInfo;