const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const nodemailer = require("nodemailer");
const connection = require('./config/db');
const routes = require('./routes/index')
const router = express.Router();

const port = process.env.PORT || 4000

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

connection.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack)
    } else {
        console.log('database connected')
    }
})

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(__dirname + '/public'))

app.use('/pics', routes.pics)
app.use('/home', routes.home)
app.use('/about', routes.about)
app.use('/aboutme', routes.aboutme)
app.use('/snaps', routes.snaps)

app.get('/', (req, res) => {
    res.status(200).send('je suis dans le truc /')
})

const contactEmail = nodemailer.createTransport({
	service: 'gmail',
	// auth: {
	// user: "guillaume.lequin713@gmail.com",
	// pass: "Guigan713guillaume26",
	// },
});

contactEmail.verify((error) => {
	if (error) {
	console.log(error);
	} else {
	console.log("Ready to Send");
	}
});

router.post("/contact", (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const message = req.body.message; 
	const mail = {
	from: name,
	to: "guillaume.lequin713@gmail.com",
	subject: "Contact Form Submission",
	html: `<p>Name: ${name}</p>
			<p>Email: ${email}</p>
			<p>Message: ${message}</p>`,
	};
	contactEmail.sendMail(mail, (error) => {
	if (error) {
		res.json({ status: "ERROR" });
	} else {
		res.json({ status: "Message Sent" });
	}
	});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})