import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import EmailLog from "@/model/logModel";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { email, subject } = await req.json();
    // console.log("Sending to:", email);
    const mainSubject =
      subject || `Application for Full Stack Developer hiring`;
    const resumePath = path.join(
      process.cwd(),
      "public",
      "Krunal Vaishnav.pdf"
    );
    const resumeBuffer = fs.readFileSync(resumePath);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: mainSubject,
      html: `
  <div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333;">
    <p>Dear Hiring Manager,</p>

<p>
  I am writing to express my interest in the <strong>Full Stack (MERN) Developer</strong> position at your esteemed company. With hands-on experience in building responsive, full-stack web applications using <strong>React.js, Node.js, Next.js, MongoDB, Express.js, AngularJS</strong>, and <strong>Java</strong>, I specialize in developing scalable and user-centric solutions. 
</p>

<p> My expertise in both frontend and backend development, along with strong Git version control skills, enables me to deliver seamless applications from concept to deployment.</p>

    <p>
      Currently, I am undergoing a 6-month training program, of which I have successfully completed 5 months, gaining practical experience in full-stack development.
    </p>

    <p>
      What particularly excites me about your organization is its commitment to innovation and leveraging cutting-edge technologies. 
      I am passionate about crafting impactful software solutions, and I believe my skills and enthusiasm for development align perfectly with your company’s vision.
    </p>

    <p>
      You can explore my portfolio at <a href="https://krunalvaishnav.vercel.app" target="_blank">krunalvaishnav.vercel.app</a>, 
      where I have showcased my projects and technical expertise. I have also attached my resume for your review and would be delighted to provide 
      any additional information.
    </p>

    <p>
      Thank you for considering my application. I would welcome the opportunity to discuss how I can contribute to your team and drive success in this role.
    </p>

    <br/>

 
    <p>
      Warm regards,<br/>
      <strong>Krunal Vaishnav</strong><br/>
      +91 70437 54778<br/>
      <a href="mailto:krunalvaishnav2004@gmail.com">krunalvaishnav2004@gmail.com</a><br/>
      <a href="https://krunalvaishnav.vercel.app" target="_blank">krunalvaishnav.vercel.app</a>
    </p>
  </div>
      `,
      attachments: [
        {
          filename: "Krunal_Vaishnav_Resume.pdf",
          content: resumeBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    await dbConnect();
    await EmailLog.create({
      subject: mainSubject,
      email,
      sentAt: new Date(),
    });
    // const logMessage = `Email sent to: ${email} at ${new Date().toLocaleString()}\n`;
    // const logFilePath = path.join(process.cwd(), "email-log.txt");
    // fs.appendFileSync(logFilePath, logMessage, "utf8");

    return new Response(
      JSON.stringify({ message: "Email sent successfully." }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ error: "Failed to send email." }), {
      status: 500,
    });
  }
}
