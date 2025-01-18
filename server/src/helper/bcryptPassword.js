const bcrypt = require('bcrypt');
const saltRounds = 10;

const securePassword= async (password) => {
    try {
        return (await bcrypt.hash(password, saltRounds))
    } catch (error) {
        console.log(error)
    }
}

const comparePassword= async (planePassword,hahedPassword) => {
    try {
        return await bcrypt.compare(planePassword, hahedPassword)
    } catch (error) {
        console.log(error)
    }

}
module.exports={securePassword,comparePassword}