const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const user = models.User;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zwigato09@gmail.com',
        pass: 'htezsmllibzaorke'
    }
});

//Admin signup
exports.signup = async (req, res) => {
    try {
        const { phoneNumber, name, email, address, CallingCode, photo } = req.body;
        const hashPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await user.create({
            calling_code: CallingCode,
            phone: phoneNumber,
            name: name,
            email: email,
            address: address,
            password: hashPassword,
            account_type: "0",
            photo_uri: photo
        });
        res.json({ msg: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, error });
    }
}

//Admin login
exports.login = async (req, res) => {
    try {
        console.log('dshajfkjd');
        const { email, password } = req.body;
        const userdata = await user.findOne({ where: { email: email, account_type: '0' }, attributes: ['id', 'name', 'email', 'account_type', 'password', 'tokens', 'photo_uri'] });
        if (!userdata) {
            return res.status(400).json({ success: false, msg: "Email not valid" });
        }
        const matchPassword = await bcrypt.compare(password, userdata.password);

        if (!matchPassword) {
            return res.status(400).json({ msg: "Password not match" });
        } else {
            const token = jwt.sign(
                { id: userdata.id, email: userdata.email, account_type: userdata.account_type },
                "dbdad61f0eab1aded7bd4b43edd7",
                {
                    expiresIn: "15d",
                }
            );
            await userdata.update({
                tokens: token
            })
            return res.status(200).json({ success: true, msg: 'Admin Login Successfully', data: userdata });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, error });
    }
}

//Admin forgot api
module.exports.forgotAdmin = async (req, res) => {
    const { email } = req.body;
    try {
        const userdata = await user.findOne({ where: { email: email, account_type: '0' } });

        if (!userdata) {
            return res.status(400).json({ success: false, msg: 'Email is not registered' });
        } else {
            const token = jwt.sign(
                { id: userdata.id, email: userdata.email },
                "dbdad61f0eab1aded7bd4b43edd7",
                {
                    expiresIn: "10m",
                }
            );

            const emailContent = `
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f1f1f1;
                            }
                            
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #fff;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            
                            h1 {
                                text-align: center;
                                color: #333;
                            }
                            
                            p {
                                margin-bottom: 20px;
                                line-height: 1.5;
                                color: #555;
                            }
                            
                            .btn {
                                display: inline-block;
                                padding: 10px 20px;
                                background-color: #096D5B;
                                color: #fff;
                                text-decoration: none;
                                border-radius: 4px;
                            }
                            
                            .btn:hover {
                                background-color: #fff;
                                color: #096D5B;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Reset Password</h1>
                            <p>Hello,</p>
                            <p>Click on the button below to reset your password:</p>
                            <p><a class="btn" href="http://52.66.240.18:3000/reset-password/${token}">Reset Password</a></p>
                            <p>If you did not request a password reset, please ignore this email.</p>
                            <p>Best regards,<br>Zwigato</p>
                        </div>
                    </body>
                    </html>
                `;

            await transporter.sendMail({
                to: req.body.email,
                from: 'Zwigato <zwigato09@gmail.com>',
                subject: 'Reset Password',
                html: emailContent
            });

            return res.status(200).json({
                success: true,
                msg: "Forgot password link has been sent to your email",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports.ResetPassword = async (req, res) => {
    const { token } = req.params;
    try {
        var decoded = jwt.verify(token, "dbdad61f0eab1aded7bd4b43edd7");
        return res.render('../views/Admin/reset-password', { email: decoded.email });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

//Admin reset password api
exports.resetPassword = async (req, res) => {
    const { new_password, confirm_password } = req.body;
    const { token } = req.params;
    try {
        if (new_password == confirm_password) {
            var decoded = jwt.verify(token, "dbdad61f0eab1aded7bd4b43edd7");
            if (decoded) {
                const userdata = await user.findOne({ where: { id: decoded.id } });
                if (userdata) {
                    const hashPassword = await bcrypt.hash(new_password, 12);
                    userdata.password = hashPassword;
                    userdata.save();
                    return res.status(200).json({
                        success: true,
                        msg: "Password updated sucessfully",
                    });
                }
            }
        } else {
            return res.status(400).json({ success: false, msg: "new_password & confirm_password not matched" });
        }
    }

    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};


