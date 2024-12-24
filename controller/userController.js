const User = require("../model/modelController");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const RegisterUser = async (req, res) => {
  try {
    const { name, address, role, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: "User email already exists",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      email,
      password: hashedPassword,
      name,
      address,
      role,
    });

    const token = JWT.sign(
      {
        email: result.email,
        id: result._id,
        role: result.role, 
      },
      process.env.JWT,
      { expiresIn: "1h" } 
    );

    // Return a success response
    return res.status(200).send({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("User registration error:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};







const Login = async(req, res) =>{
    try {
        const {email, password} = req.body 
        const extingUser = await User.findOne({email })
        if(!extingUser){
            return res.status(400).send({
                success:false, 
                message:"user email not current"
            })
        }

        const matchpassword = await bcrypt.compare(password, extingUser.password)
        if(!matchpassword){
            return res.status(400).send({
                success:false, 
                message:"user email not current"
            })
        }

        const token = JWT.sign({
            email:extingUser.email,
            id:extingUser._id
        }, process.env.JWT)

        return    res.status(200).send({
            success:true,
            message:"user Login Successfully",
            token,
            
        })
        
    } catch (error) {
       return res.status(200).send({
            success:false,
            message:"unsuccessfully Login"
        })
    }
}



module.exports = {RegisterUser, Login};
