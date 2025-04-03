/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import nodemailer from 'nodemailer';
import path from 'path';


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


// You can change the email content to your liking :D 
const sendInviteEmail = async (email: string) => {
  const logoPath = path.join(__dirname, 'logo'  , 'rouhijat.png');

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Kutsu liittyä Rouhijoiden palveluun',
    text: 'Sinut on kutsuttu liittymään Rouhijoiden tiimiin', // Fallback for email clients that don't support HTML
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <table align="center" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; text-align: center;">
          <!-- Logo Row -->
          <tr>
            <td style="padding: 20px 0;">
              <img src="cid:rouhijatLogo" alt="Rouhijat Logo" style="max-width: 150px; height: auto; border-radius: 5px;" />
            </td>
          </tr>
          <!-- Text Content Row -->
          <tr>
            <td style="padding: 20px; text-align: left;">
              <h2 style="color: #5d0065; text-align: center;">Tervetuloa!</h2>
              <p>Hei sinä tuleva Rouhija,</p>
              <p>Olet saanut kutsun liittyä Rouhijoiden tiimiin. Klikkaa allaolevaa linkkiä kirjautuaksesi:</p>
              <div style="text-align: center;">
                <a href="https://rouhijat.fi/login" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #5d0065; text-decoration: none; border-radius: 5px;">Kirjaudu</a>
              </div>
              <p style="margin-top: 20px;">Jos ylläoleva nappi ei toimi, kopioi ja liitä oheinen linkki selaimeen:</p>
              <p><a href="https://rouhijat.fi/login">https://rouhijat.fi/login</a></p>
              <p style="margin-top: 20px;">Täällä ei mestispullot juhli!</p>
            </td>
          </tr>
        </table>
      </div>
    `,
    attachments: [
      {
        filename: 'rouhijat.png',
        path: logoPath,
        cid: 'rouhijatLogo',
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

export default {
  sendInviteEmail,
};